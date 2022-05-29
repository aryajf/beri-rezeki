const {Program, Payment, Comment, Item, User} = require('../models')
const { Op } = require("sequelize")
const path = require('path')
const programCoverPath = path.join(__dirname, '../public/images/programs/')
const Validator = require('validatorjs')
const validatorMessage = require('../config/validatorMessage')
const {compressImage, moveFile, deleteFile, makeDirectory, createSlug, getPagination, getPagingData, fs} = require('../config/mixins')

module.exports = {
    index: async(req, res) => {
        let { page, type, keyword } = req.query
        const { limit, offset } = getPagination(page, 6)
        
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
                    delete program.dataValues.item
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
            const program_comments = await Comment.findAll({
                where: {
                    program_id: program.id
                },
                order:[['updatedAt', 'DESC']],
                include: [{
                    model: User,
                    as: 'user',
                }]
            })

            let comments_length = 0
            let comments = []
            if(program_comments.length != 0){
                program_comments.map(item => {
                    if(!item.kode.includes('ADMIN-') && item.status == 'Accepted'){
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
                        if(payment.status == 'Accepted' && payment.type == 'Program'){
                            program.dataValues.total_funding += payment.total_harga
                        }
                    }
                })
            }
            delete program.dataValues.item

            res.json({
                comments_length: comments_length,
                comments: comments,
                program : program,
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
            harga: req.body.harga,
            type: req.body.type,
            expiredAt: req.body.expiredAt
        }

        !req.file ? programReq.cover = null : programReq.cover = req.file.filename
        if(programValidation(programReq) != null){
            res.status(400).send(programValidation(programReq))
            if(programReq.cover){
                deleteFile(req.file.path)
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
            compressImage('public/uploads/'+req.file.filename, programCoverPath, req.file.path)

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
            deleteFile(req.file.path)
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
            deleteFile(req.file.path)
            return 
        }

        let programReq = {
            title: req.body.title,
            short_desc: req.body.short_desc,
            long_desc: req.body.long_desc,
            cover: '',
            harga: req.body.harga,
            type: req.body.type,
            expiredAt: req.body.expiredAt
        }

        if(!req.file){
            programReq.cover = program.cover
            if(programValidation(programReq) != null){
                res.status(400).send(programValidation(programReq))
                return
            }
        }else{
            programReq.cover = req.file.filename
            if(programValidation(programReq) != null){
                res.status(400).send(programValidation(programReq))
                deleteFile(req.file.path)
                return
            }
            compressImage('public/uploads/'+req.file.filename, shopCoverPath, req.file.path)
            deleteFile(shopCoverPath + shop.cover)
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

            try{
                program.destroy()

                res.json({
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
            }], limit,offset,order:[['updatedAt', 'DESC']]
        }
    }else{
        statement = {
            where: {},
            distinct: true,
            include: [{
                model: Payment,
                as: 'payments',
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
        harga: 'required|numeric|min:4',
        type: 'required',
        cover: 'required',
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