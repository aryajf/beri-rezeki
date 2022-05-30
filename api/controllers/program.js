const {Program, Payment, Comment, Like, User} = require('../models')
const { Op } = require("sequelize")
const path = require('path')
const programCoverPath = path.join(__dirname, '../public/images/programs/')
const programPDFPath = path.join(__dirname, '../public/pdf/programs/')
const Validator = require('validatorjs')
const validatorMessage = require('../config/validatorMessage')
const {compressImage, moveFile, deleteFile, makeDirectory, createSlug, getPagination, getPagingData, fs} = require('../config/mixins')

module.exports = {
    index: async(req, res) => {
        let { page, type, keyword } = req.query
        const { limit, offset } = getPagination(page, 12)
        
        await programType(limit, offset, type, keyword).then(async (data) => {
            const { totalItems, dataPaginate, totalPages, currentPage } = getPagingData(data, page, limit)
            
            if(dataPaginate.length != 0 && !isNaN(currentPage)){
                dataPaginate.map(program => {
                    if(program.type == 'Crowdfunding'){
                        program.dataValues.total_funding = 0
                        program.payments.map(payment => {
                            if(payment){
                                if(payment.status == 'Accepted'){
                                    program.dataValues.total_funding += payment.total_harga
                                }
                            }
                        })
                    }
                    delete program.dataValues.payments
                })

                res.json({
                    totalItems : totalItems,
                    limitItems : limit,
                    totalPages : totalPages,
                    currentPage : currentPage,
                    program : dataPaginate,
                    message: 'Program berhasil ditampilkan',
                    request: {
                        method: req.method,
                        url: process.env.BASE_URL + 'program'
                    },
                    status: true
                })
            }else{res.json({totalItems : 0,program: dataPaginate, message : 'Program belum tersedia', status: false})}
        }).catch((err) => {
            res.status(404).json({message : 'Terjadi kesalahan saat menampilkan program', status: false})
        })
    },
    show: async(req, res) => {
        const program = await findProgram(req.params.slug)
        if(program != null){
            let programSize = 0
            if(program.pdf_file){
                fs.existsSync(programPDFPath + program.pdf_file) ? programSize = fs.statSync(programPDFPath + program.pdf_file).size : programSize = 'Unknown'
            }

            const program_comments = await Comment.findAll({
                where: {
                    program_id: program.id
                },
                order:[['updatedAt', 'DESC']],
                include: [{
                    model: Like,
                    as: 'likes',
                },{
                    model: User,
                    as: 'user',
                }]
            })

            let comments_length = 0
            let comments = []
            if(program_comments.length != 0){
                program_comments.map(item => {
                    if(!item.kode.includes('ADMIN-') && item.status == 'Accepted'){
                        let likes = []
                        if(item.likes){
                            item.likes.map((like) => {
                                likes.push(like)
                            })
                        }
                        if(item.user){
                            comments.push({
                                id: item.kode,
                                nama: item.user.nama,
                                avatar: item.user.avatar,
                                auth_type: item.user.auth_type,
                                isAnonymous: item.isAnonymous,
                                messages: item.messages,
                                createdAt: item.createdAt,
                                updatedAt: item.updatedAt,
                                likes: likes,
                                reply_comments: []
                            })
                        }else{
                            comments.push({
                                id: item.kode,
                                nama: 'Beri Rezeki Member',
                                avatar: null,
                                auth_type: 'Local',
                                isAnonymous: item.isAnonymous,
                                messages: item.messages,
                                createdAt: item.createdAt,
                                updatedAt: item.updatedAt,
                                likes: likes,
                                reply_comments: []
                            })
                        }
                        comments_length++
                    }
                })

                program_comments.map(item => {
                    if(item.kode.includes('ADMIN-')){
                        comments.map(itemComment => {
                            if (itemComment.id === item.reply_kode) {
                                itemComment.reply_comments.push({
                                    id: item.kode,
                                    nama: item.user.nama,
                                    avatar: item.user.avatar,
                                    isAnonymous: item.isAnonymous,
                                    messages: item.messages,
                                    createdAt: item.createdAt,
                                    updatedAt: item.updatedAt,
                                })
                            }
                        })
                        comments_length++
                    }
                })
            }

            if(program.type == 'Crowdfunding'){
                program.dataValues.total_funding = 0
                program.payments.map(payment => {
                    if(payment){
                        if(payment.status == 'Accepted'){
                            program.dataValues.total_funding += payment.total_harga
                        }
                    }
                })
            }
            delete program.dataValues.payments

            res.json({
                comments_length: comments_length,
                comments: comments,
                program : program,
                programSize: programSize,
                message: 'Program berhasil ditampilkan',
                request: {
                    method: req.method,
                    url: process.env.BASE_URL + 'program/' + req.params.slug
                },
                status: true
            })
        }else{res.status(404).json({message : 'Belum ada program', status: false})}
    },
    store: async(req, res) => {
        let slug, title = req.body.title
        title == null ? slug = title : slug = createSlug(title)

        let programReq = {
            title: req.body.title,
            slug: slug,
            short_desc: req.body.short_desc,
            long_desc: req.body.long_desc,
            cover: '',
            pdf_file: null,
            harga: req.body.harga,
            type: req.body.type,
            expiredAt: req.body.expiredAt
        }
        if(Object.keys(req.files).length === 0){
            programReq.cover = null
            programReq.pdf_file = null
        }else{
            if(req.files.cover){
                if(req.files.cover[0]){
                    programReq.cover = req.files.cover[0].filename
                }
            }
            if(req.files.pdf_file){
                if(req.files.pdf_file[0]){
                    programReq.pdf_file = req.files.pdf_file[0].filename
                }
            }
        }
        if(programValidation(programReq) != null){
            res.status(400).send(programValidation(programReq))
            if(programReq.cover){
                deleteFile(req.files.cover[0].path)
            }
            return
        }
        
        try{
            let checkSlug = await Program.findOne({where: {slug: programReq.slug}})
            if(checkSlug){
                programReq.slug = createSlug(req.body.title) + '-' + new Date().getTime()
            }

            let newProgram = await Program.create(programReq)

            // 1. Make cover 2. pdf directory, 3. Move pdf file, 4. Compress image
            makeDirectory(programCoverPath)
            compressImage('public/uploads/'+req.files.cover[0].filename, programCoverPath, req.files.cover[0].path)

            if(programReq.pdf_file){
                makeDirectory(programPDFPath)
                moveFile(req.files.pdf_file[0].path, programPDFPath + req.files.pdf_file[0].filename)
            }

            res.status(201).json({
                data: {
                    slug: newProgram.slug,
                    title: newProgram.title
                },
                message: 'Program berhasil ditambah',
                request: {
                    method: req.method,
                    url: process.env.BASE_URL + 'program'
                },
                status: true,
            })
        }catch(err){
            deleteFile(req.files.cover[0].path)
            res.status(400).json({
                error: err.message,
                message: 'Terjadi kesalahan saat menambah program',
                status: false
            })
        }
    },
    update: async(req, res) => {
        let program = await findProgram(req.params.slug)

        if(program == null){
            res.status(404).json({message : 'Belum ada program', status: false})
            deleteFile(req.files.cover[0].path)
            return 
        }

        let programReq = {
            title: req.body.title,
            short_desc: req.body.short_desc,
            long_desc: req.body.long_desc,
            cover: program.cover,
            pdf_file: null,
            harga: req.body.harga,
            type: req.body.type,
            expiredAt: req.body.expiredAt
        }

        if(program.pdf_file){
            programReq.pdf_file = program.pdf_file
        }
        
        if(req.files.cover){
            if(req.files.cover[0]){
                programReq.cover = req.files.cover[0].filename
                compressImage('public/uploads/'+req.files.cover[0].filename, programCoverPath, req.files.cover[0].path)
                deleteFile(programCoverPath + program.cover)

                if(programValidation(programReq) != null){
                    res.status(400).send(programValidation(programReq))
                    deleteFile(req.files.cover[0].path)
                    return
                }
            }
        }
        if(req.files.pdf_file){
            if(req.files.pdf_file[0]){
                programReq.pdf_file = req.files.pdf_file[0].filename
                compressImage('public/uploads/'+req.files.pdf_file[0].filename, programPDFPath, req.files.pdf_file[0].path)
                deleteFile(programPDFPath + program.pdf_file)

                if(programValidation(programReq) != null){
                    res.status(400).send(programValidation(programReq))
                    deleteFile(req.files.pdf_file[0].path)
                    return
                }
            }
        }

        if(programValidation(programReq) != null){
            res.status(400).send(programValidation(programReq))
            return
        }
        
        try{
            program.update(programReq)
            res.status(201).json({
                data: {
                    slug: program.slug,
                    title: program.title
                },
                message: 'Program berhasil diubah',
                request: {
                    method: req.method,
                    url: process.env.BASE_URL + 'program/' + req.params.slug
                },
                status: true,
            })
        }catch(err){
            res.status(400).json({
                error: err.message,
                message: 'Terjadi kesalahan saat mengubah program',
                status: false
            })
        }
    },
    delete: async(req, res) => {
        const program = await findProgram(req.params.slug)
        if(program != null){
            deleteFile(programCoverPath + program.cover)
            if(program.pdf_file){
                deleteFile(programPDFPath + program.pdf_file)
            }

            try{
                program.destroy()

                res.status(200).json({
                    data : {
                        slug: program.slug,
                        title: program.title
                    },
                    message: 'Program berhasil dihapus',
                    request: {
                        method: req.method,
                        url: process.env.BASE_URL + 'program/' + req.params.slug
                    },
                    status: true
                })
            }catch(err){
                res.status(400).json({
                    error: err.message,
                    message: 'Terjadi kesalahan saat menghapus program',
                    status: false
                })
            }
        }else{res.status(404).json({message : 'Belum ada program', status: false})}
    },
}

function findProgram(slug){
    return Program.findOne({
    include: [{
        model: Payment,
        as: 'payments',
    },{
        model: Comment,
        as: 'comments',
        required: false,
        include: [{
            model: User,
            as: 'user',
        }]
    }],  where: {slug: slug}})
}

function programType(limit, offset, type, keyword){
    let statement

    if(keyword){
        statement = {
            where: {
                title:{}
            },
            distinct: true,
            include: [{
                model: Payment,
                as: 'payments',
            },{
                model: Comment,
                as: 'comments',
            }], limit,offset,order:[['updatedAt', 'DESC']]
        }
    }else{
        statement = {
            where: {},
            distinct: true,
            include: [{
                model: Payment,
                as: 'payments',
            },{
                model: Comment,
                as: 'comments',
            }], 
            limit,offset,order:[['updatedAt', 'DESC']]
        }
    }

    if(type == 'single'){
        statement.where = {
            type : 'Single'
        }
    }else if(type == 'crowdfunding'){
        statement.where = {
            type : 'Crowdfunding'
        }
    }

    if(keyword){
        statement.where.title = {
            [Op.like]: `%${keyword}%`
        }
    }

    return Program.findAndCountAll(statement)
}

function programValidation(dataRequest){
    let rules = {
        title: 'required|min:3',
        short_desc: 'required',
        long_desc: 'required',
        cover: 'required',
        harga: 'required|numeric|min:4',
        type: 'required',
        expiredAt: 'required',
    }
    
    let validation = new Validator(dataRequest, rules, validatorMessage)
    if(validation.fails()){
        return {
            message: "Harap isi form dengan benar",
            errors: validation.errors.errors
        }
    }
}