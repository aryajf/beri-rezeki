const {User} = require('../models')
const { Op } = require("sequelize")
const path = require('path')
const hbs = require('nodemailer-express-handlebars')
const bcrypt = require('bcrypt')
const crypto = require("crypto")
const avatarPath = path.join(__dirname, '../public/images/avatars/')
const nodemailer = require("nodemailer")
const emailConfig = require('../config/email')
const Validator = require('validatorjs')
const validatorMessage = require('../config/validatorMessage')
const {BASE_URL, HOME_URL, MAIL_FROM_ADDRESS} = process.env
const {deleteFile, getPagination, getPagingData} = require('../config/mixins')

module.exports = {
    getUsers: async(req, res) => {
        await User.findAll().then(data=>{
            const now = new Date()
            let expired
            if(data.length == 0){
                res.json({totalItems : 0,message : 'User tidak ditemukan', status: false})
                return
            }else{
                data.map(async (item)=>{
                    expired = (Date.parse(item.createdAt) + 3600000) - now < 0
                    if(item.email_status == 'Unverified'){
                        if(expired){
                            item.destroy()
                        }
                    }
                })
            }
        })

        let { page } = req.query
        const { limit, offset } = getPagination(page, 10)

        await User.findAndCountAll({limit,offset,order:[['updatedAt', 'DESC']],where:{role: 'Member'}}).then(data => {
            const { totalItems, dataPaginate, totalPages, currentPage } = getPagingData(data, page, limit)

            if(dataPaginate.length != 0 && !isNaN(currentPage)){
                res.json({
                    totalItems : totalItems,
                    limitItems : limit,
                    totalPages : totalPages,
                    currentPage : currentPage,
                    users : dataPaginate,
                    message: 'User berhasil ditampilkan',
                    request: {
                        method: req.method,
                        url: BASE_URL + 'user'
                    },
                    status: true
                })
            }else{res.json({totalItems : 0,message : 'User tidak ditemukan', status: false})}
        }).catch(() => {
            res.status(404).json({message : 'User tidak ditemukan', status: false})
        })
    },
    createUser: async(req, res) => {
        const userReq = {
            email: req.body.email,
            nama: req.body.nama,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
        }
        
        if(userValidation(userReq, req.url) != null) return res.status(400).send(userValidation(userReq, req.url))
        
        let user = await findUserEmail(req.body.email)
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
                        password: hashPassword(userReq.password),
                        token: token
                    })
                    
                    if(newUser.token){
                        setTimeout(async() => {
                            user = await findUserEmail(req.body.email)
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
                        message: 'User berhasil didaftarkan, cek email untuk verifikasi akun',
                        request: {
                            method: req.method,
                            url: BASE_URL + 'user'
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
    showUsers: async(req, res) => {
        await User.findOne({where:{id:req.params.id,role: 'Member'}}).then(user => {
            if(user != null){
                res.json({
                    user : user,
                    message: 'User berhasil ditampilkan',
                    request: {
                        method: req.method,
                        url: BASE_URL + 'user/' + req.params.id
                    },
                    status: true
                })
            }else{res.status(404).json({message : 'User tidak ditemukan', status: false})}
        }).catch(() => {
            res.status(404).json({message : 'User tidak ditemukan', status: false})
        })
    },
    searchUsers: async(req, res) => {
        if(req.params.keyword == ''){
            res.status(404).json({message : 'User tidak ditemukan', status: false})
        }
        
        let { page } = req.query
        const { limit, offset } = getPagination(page, 10)

        await User.findAndCountAll({limit,offset,where:{
            [Op.or]: [{
                nama : {[Op.like]: `%${req.params.keyword}%`},
            },{
                email : {[Op.like]: `%${req.params.keyword}%`},
            },{
                no_telp : {[Op.like]: `%${req.params.keyword}%`},
            }],
            role: 'Member'
        }}).then(data => {
            const { totalItems, dataPaginate, totalPages, currentPage } = getPagingData(data, page, limit)

            if(dataPaginate.length != 0 && !isNaN(currentPage)){
                res.json({
                    totalItems : totalItems,
                    limitItems : limit,
                    totalPages : totalPages,
                    currentPage : currentPage,
                    users : dataPaginate,
                    message: 'User berhasil ditampilkan',
                    request: {
                        method: req.method,
                        url: BASE_URL + 'user/search/' + req.params.keyword
                    },
                    status: true
                })
            }else{res.json({totalItems : 0,message : 'User tidak ditemukan', status: false})}
        }).catch(() => {
            res.status(404).json({message : 'User tidak ditemukan', status: false})
        })
    },
    deleteUser: async(req, res) => {
        const user = await findUser(req.params.id)
        if(user != null){
            deleteFile(avatarPath + user.avatar)
            try{
                user.destroy()

                res.json({
                    data : {
                        id: user.id,
                        email: user.email,
                        nama: user.nama,
                    },
                    message: 'Member berhasil dihapus',
                    request: {
                        method: req.method,
                        url: BASE_URL + 'user/' + req.params.id
                    },
                    status: true
                })
            }catch(err){
                res.status(400).json({
                    error: err.message,
                    message: 'Terjadi kesalahan saat menghapus user',
                    status: false
                })
            }
        }else{res.status(404).json({message : 'User tidak ditemukan', status: false})}
    },
}

function findUser(id){
    return User.findOne({where: {id: id}})
}

function findUserEmail(email){
    return User.findOne({where: {email: email}})
}

function hashPassword(password){
    return bcrypt.hashSync(password, 10, null)
}

function userValidation(dataRequest, url){
    let rules
    if(url == '/user'){
        rules = {
            nama: 'required|min:3',
            email: 'required|email|min:5',
            password: 'required|min:5',
            confirmPassword: 'required|min:5|same:password'
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