const {Comment, Payment, Program, User} = require('../models')
const Validator = require('validatorjs')
const validatorMessage = require('../config/validatorMessage')
const {getPagination, getPagingData} = require('../config/mixins')

module.exports = {
    get: async(req, res) => {
        let { page } = req.query
        const { limit, offset } = getPagination(page, 10)
        
        await findComment(limit, offset).then(data => {
            const { totalItems, dataPaginate, totalPages, currentPage } = getPagingData(data, page, limit)
            
            if(dataPaginate.length != 0 && !isNaN(currentPage)){
                res.json({
                    totalItems : totalItems,
                    limitItems : limit,
                    totalPages : totalPages,
                    currentPage : currentPage,
                    comments : dataPaginate,
                    message: 'Semua komentar berhasil ditampilkan',
                    request: {
                        method: req.method,
                        url: process.env.BASE_URL + 'comments'
                    },
                    status: true
                })
            }else{res.json({totalItems : 0, message : 'Belum ada yang berkomentar', status: false})}
        }).catch(() => {
            res.status(404).json({message : 'Belum ada yang berkomentar', status: false})
        })
    },
    store: async(req, res) => {
        let status = req.body.status[0].toUpperCase() + req.body.status.slice(1)
        let payments = await Payment.findOne({where: {kode: req.body.kode, user_id: req.decoded.id}})
        if(payments){
            let produkId = payments.produk_id
            let commentsReq = {
                kode : req.body.kode,
                status : status,
                user_id : payments.user_id,
                produk_id : produkId,
                messages : req.body.messages,
            }

            if(commentValidation(commentsReq) != null){
                res.status(400).send(commentValidation(commentsReq))
                return
            }
            
            try{
                await Comment.create(commentsReq)
                res.status(201).json({
                    message: 'Komentar berhasil ditambah',
                    request: {
                        method: req.method,
                        url: process.env.BASE_URL + 'comments'
                    },
                    status: true,
                })
            }catch(err){
                res.status(400).json({
                    error: err.message,
                    message: 'Terjadi kesalahan saat menambah komentar',
                    status: false
                })
            }
        }else{
            res.status(400).json({ message: 'Item tidak ditemukan',status: false })
        }
    },
}
function commentValidation(dataRequest){
    let rules = {
        messages: 'required|min:3'
    }

    let validation = new Validator(dataRequest, rules, validatorMessage)
    if(validation.fails()){
        return {
            message: "Harap isi form dengan benar",
            errors: validation.errors.errors
        }
    }

}

function findComment(limit, offset){
    let include = [{
        model: User,
        as: 'user',
    },{
        model: Program,
        as: 'program',
    }]

    return Comment.findAndCountAll({include: include,where:{role: 'Member', status:'Accepted'},limit,offset,order:[['updatedAt', 'DESC']]})
}