const {User} = require('../models')
const bcrypt = require('bcrypt')
const hbs = require('nodemailer-express-handlebars')
const jwt = require('jsonwebtoken')
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const emailConfig = require('../config/email')
const Validator = require('validatorjs')
const validatorMessage = require('../config/validatorMessage')
const path = require('path')
const avatarPath = path.join(__dirname, '../public/images/avatars/')
const {JWT_SECRET, JWT_SECRET_EXPIRES, BASE_URL, HOME_URL, MAIL_FROM_ADDRESS} = process.env
const {compressImage, deleteFile} = require('../config/mixins')

module.exports = {
    login: async(req, res) => {
        const userReq = {
            email: req.body.email,
            password: req.body.password
        }

        if(userValidation(userReq, req.url) != null) return res.status(400).send(userValidation(userReq, req.url))

        let user = await findUser(userReq.email)
        if(!user){
            return res.status(404).json({email: userReq.email, message: 'User tidak terdaftar', status: false})
        }else{
            if(!verifyPassword(userReq.password, user.password)) return res.status(400).json({message: 'Kombinasi email dan password tidak sesuai', status: false})

            if(user.email_status != 'Verified') return res.status(400).json({message: 'Harap verifikasi email anda terlebih dahulu', status: false})

            const authLog = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            }

            const token = jwt.sign(authLog, JWT_SECRET, {
                expiresIn: JWT_SECRET_EXPIRES
            })

            const expiresToken = parseInt(JWT_SECRET_EXPIRES)

            const expired = new Date(user.token_expired_at) - new Date()
            if (expired <= 0) {
                user.update({token_expired_at: null})
            }

            user.update({token_expired_at: Date.now() + expiresToken})

            if(user.role == 'Admin'){
                res.json({
                    data: {
                        id: user.id,
                        email: user.email,
                        nama: user.nama,
                        role: user.role
                    },
                    message: 'Berhasil login',
                    request: {
                        method: req.method,
                        url: BASE_URL + 'login'
                    },
                    status: true,
                    token: token
                })
            }else if(user.role == 'Member'){
                res.json({
                    data: {
                        id: user.id,
                        email: user.email,
                        nama: user.nama
                    },
                    message: 'Berhasil Login',
                    request: {
                        method: req.method,
                        url: BASE_URL + 'login'
                    },
                    status: true,
                    token: token
                })
            }
        }
    },
    register: async(req, res) => {
        const userReq = {
            email: req.body.email,
            nama: req.body.nama,
            no_telp: req.body.no_telp,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
        }
        
        if(userValidation(userReq, req.url) != null) return res.status(400).send(userValidation(userReq, req.url))
        
        let user = await findUser(req.body.email)
        if(user){
            return res.status(400).json({email: req.body.email, message: 'Alamat email sudah digunakan', status: false})
        }else{
            try{
                let token = crypto.randomBytes(16).toString('hex')

                let transporter = nodemailer.createTransport(emailConfig)
                await transporter.use('compile', hbs({
                    viewEngine: {
                        partialsDir: path.resolve('./views/email/'),
                        defaultLayout: false,
                    },
                    viewPath: path.resolve('./views/email/'),
                })).sendMail({
                    from: MAIL_FROM_ADDRESS,
                    to: userReq.email,
                    subject: "Verifikasi email - Beri Rezeki",
                    template: 'register',
                    context: {
                        url: HOME_URL,
                        email: req.body.email,
                        token: token
                    }
                }).then(async () => {
                    const newUser = await User.create({
                        email: userReq.email,
                        nama: userReq.nama,
                        no_telp: req.body.no_telp,
                        password: hashPassword(userReq.password),
                        token: token
                    })
                    
                    if(newUser.token){
                        setTimeout(async() => {
                            user = await findUser(req.body.email)
                            if(user != null){
                                if(user.email_status != 'Verified'){
                                    user.destroy()
                                }
                            }
                        }, 3600000)
                    }
                    res.status(201).json({
                        data: {
                            id: newUser.id,
                            email: newUser.email,
                            nama: newUser.nama
                        },
                        message: 'Berhasil register, cek email anda terlebih dahulu untuk verifikasi',
                        request: {
                            method: req.method,
                            url: BASE_URL + 'register'
                        },
                        status: true,
                    })
                })
            }catch(err){
                res.status(400).json({
                    error: err.message,
                    message: 'Terjadi kesalahan saat register',
                    status: false
                })
            }
        }
    },
    profile: async (req, res) => {
        let user = await findUser(req.decoded.email)
        res.json({
            data: {
                email: user.email,
                nama: user.nama,
                no_telp: user.no_telp,
                avatar: user.avatar,
                role: user.role,
                email_status: user.email_status,
                token_expired_at: user.token_expired_at
            },
            request: {
                method: req.method,
                url: BASE_URL + 'profile'
            },
            status: true,
        })
    },
    verifyEmail: async (req, res) => {
        let user = await findUser(req.params.email)
        if(user == null || user.token != req.params.token){
            res.status(404).json({
                message: 'Link tidak valid',
                status: false,
            })
        }else{
            user.email_status = 'Verified',
            user.email_verified_at = Date.now()
            user.token = null
            await user.save()

            res.json({
                message: 'Email berhasil diverifikasi',
                request: {
                    method: req.method,
                    url: BASE_URL + 'verify/' + req.params.email + req.params.token
                },
                status: true,
            })
        }
    },
    forgotPasswordRequest: async(req, res) => {
        try{
            if(userValidation({email: req.body.email}, req.url) != null){
                res.status(400).send(userValidation({email: req.body.email}, req.url))
                return
            }

            let user = await findUser(req.body.email)
            if(user){
                const token = crypto.randomBytes(16).toString('hex')
                user.token = token
                await user.save()

                let transporter = nodemailer.createTransport(emailConfig)
                await transporter.use('compile', hbs({
                    viewEngine: {
                        partialsDir: path.resolve('./views/email/'),
                        defaultLayout: false,
                    },
                    viewPath: path.resolve('./views/email/'),
                })).sendMail({
                    from: MAIL_FROM_ADDRESS,
                    to: user.email,
                    subject: "Lupa Password - Moazza Indonesia",
                    template: 'forgot',
                    context: {
                        url: HOME_URL,
                        email: user.email,
                        token: token
                    }
                }).then(async () => {
                    if (user.token) {
                        setTimeout(async function () {
                            user.token = null
                            await user.save()
                        }, 3600000)
                    }

                    res.status(201).json({
                        message: 'Silahkan cek email anda untuk mengubah password',
                        request: {
                            method: req.method,
                            url: process.env.BASE_URL + req.url
                        },
                        status: true,
                    })
                }).catch(() => {
                    res.status(400).json({
                        message: 'Terjadi kesalahan saat mengirim email',
                        status: false
                    })
                })
            }else{
                res.status(404).json({email: req.body.email, message: 'Email tidak ditemukan', status: false})
            }
        }catch(err){
            res.status(400).json({
                error: err.message,
                message: 'Ups, terjadi kesalahan',
                status: false
            })
        }
    },
    updatePassword: async (req, res) => {
        let user = await findUser(req.params.email)
        if(user == null || user.token != req.params.token || user.token == null){
            res.status(404).json({
                message: 'Link tidak valid',
                request: {
                    method: req.method,
                    url: BASE_URL + 'password/update/' + req.params.email + req.params.token
                },
                status: false,
            })
            return
        }

        let userReq = {
            newPassword: req.body.newPassword,
            confirmNewPassword: req.body.confirmNewPassword,
        }

        if(updatePasswordValidation(userReq) != null){
            res.status(400).send(updatePasswordValidation(userReq))
            return
        }

        try{
            user.password = hashPassword(userReq.newPassword),
            user.token = null
            await user.save()

            res.status(201).json({
                message: 'Password berhasil diganti',
                request: {
                    method: req.method,
                    url: BASE_URL + 'password/update/' + req.params.email + req.params.token
                },
                status: true,
            })
        }catch(err){
            res.status(400).json({
                error: err.message,
                message: 'Ups, terjadi kesalahan',
                status: false
            })
        }
    },
    changePassword: async (req, res) => {
        let user = await findUser(req.decoded.email)

        let userReq = {
            oldPassword: req.body.oldPassword,
            newPassword: req.body.newPassword,
            confirmNewPassword: req.body.confirmNewPassword,
        }

        if(userValidation(userReq, req.url) != null){
            res.status(400).send(userValidation(userReq, req.url))
            return
        }

        if(!verifyPassword(req.body.oldPassword, user.password)){
            res.status(400).json({message: 'Password lama salah', status: false})
        }else{
            user.password = hashPassword(req.body.newPassword)
            await user.save()

            res.status(201).json({
                message: 'Password berhasil diganti',
                request: {
                    method: req.method,
                    url: BASE_URL + 'password/change'
                },
                status: true,
            })
        }
    },
    updateProfile: async (req, res) => {
        let user = await findUser(req.decoded.email)
        let userReq = {
            nama: req.body.nama,
            no_telp: req.body.no_telp
        }

        if(userReq.no_telp == 'null'){
            userReq.no_telp = ''
        }
        
        if(userValidation(userReq, req.url) != null){
            res.status(400).send(userValidation(userReq, req.url))
            return
        }

        try{
            user.update(userReq).then(data => {
                res.status(200).json({
                    data: {
                        email: data.email,
                        nama: data.nama,
                    },
                    message: 'User berhasil diedit',
                    request: {
                        method: req.method,
                        url: BASE_URL + 'user/' + req.decoded.email
                    },
                    status: true,
                })
            })
        }catch(err){
            res.status(400).json({
                error: err.message,
                message: 'Terjadi kesalahan saat mengedit profile',
                status: false
            })
        }
    },
    updateAvatar: async (req, res) => {
        let user = await findUser(req.decoded.email)
        let userReq = {
            avatar: req.file.filename,
        }
        compressImage('public/uploads/'+req.file.filename, avatarPath, req.file.path)
        deleteFile(avatarPath + user.avatar)

        try{
            user.update(userReq).then(() => {
                res.status(200).json({
                    avatar: userReq.avatar,
                    message: 'Avatar berhasil diubah',
                    request: {
                        method: req.method,
                        url: BASE_URL + 'user/' + req.decoded.email
                    },
                    status: true,
                })
            })
        }catch(err){
            res.status(400).json({
                error: err.message,
                message: 'Terjadi kesalahan saat mengubah avatar',
                status: false
            })
            deleteFile(req.file.path)
        }
    }
}

function findUser(email){
    return User.findOne({where: {email: email}})
}

function hashPassword(password){
    return bcrypt.hashSync(password, 10, null)
}

function verifyPassword(password, hashPassword){
    return hashPassword == null ? false : bcrypt.compareSync(password, hashPassword)
}

function updatePasswordValidation(dataRequest){
    let rules = {
        newPassword: 'required|min:5',
        confirmNewPassword: 'required|min:5|same:newPassword'
    }

    let validation = new Validator(dataRequest, rules, validatorMessage)
    if(validation.fails()){
        return {
            message: "Harap isi form dengan benar",
            errors: validation.errors.errors
        }
    }
}

function userValidation(dataRequest, url){
    let rules
    if(url == '/register'){
        rules = {
            nama: 'required|min:3',
            email: 'required|email|min:5',
            no_telp: 'required|min:3',
            password: 'required|min:5',
            confirmPassword: 'required|min:5|same:password'
        }
    }else if(url == '/login'){
        rules = {
            email: 'required|email|min:5',
            password: 'required|min:5',
        }
    }else if(url == '/password/forgot'){
        rules = {
            email: 'required|email|min:5',
        }
    }else if(url == '/password/change'){
        rules = {
            oldPassword: 'required|min:5',
            newPassword: 'required|min:5',
            confirmNewPassword: 'required|min:5|same:newPassword'
        }
    }else if(url == '/profile/update'){
        rules = {
            nama: 'required|min:3',
            no_telp: 'required|numeric|min:10',
        }
    }

    let validation = new Validator(dataRequest, rules, validatorMessage)
    if(validation.fails()){
        return {
            message: "Harap isi form dengan benar",
            errors: validation.errors.errors
        }
    }
}