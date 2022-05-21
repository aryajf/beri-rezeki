const {Comment, Like, Payment, Program, User} = require('../models')
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
        }).catch((err) => {
            res.status(404).json({message : 'Ada kesalahan saat menampilkan komentar', status: false})
        })
    },
    like: async(req, res) => {
        try{
            const comment = await Comment.findOne({where: {kode: req.params.kode}})
            if(comment){
                const like = await Like.findOne({where: {comment_id: comment.id, user_id: req.decoded.id}})
                let message
                if(like){
                    await Like.destroy({where: {id: like.id}})
                    message = 'Berhasil menghapus like pada komentar'
                }else{
                    await Like.create({comment_id: comment.id, user_id: req.decoded.id})
                    message = 'Berhasil memberikan like pada komentar'
                }
                res.json({
                    message: message,
                    request: {
                        method: req.method,
                        url: process.env.BASE_URL + 'comments'
                    },
                    status: true
                })
            }else{
                res.status(404).json({message : 'Komentar tidak ditemukan', status: false})
            }
        }catch(err){
            res.status(404).json({message : 'Ada kesalahan saat memberikan like komentar', status: false})
        }
    }
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
        attributes: ['email', 'nama', 'avatar', 'role']
    },{
        model: Like,
        as: 'likes',
    },{
        model: Program,
        as: 'program',
        attributes: ['title', 'slug', 'cover', 'harga', 'type']
    }]

    return Comment.findAndCountAll({include: include,where:{role: 'Member', status:'Accepted'},limit,offset,order:[['updatedAt', 'DESC']]})
}