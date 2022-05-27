const {Payment, Comment, Program, User} = require('../models')
const { Op } = require("sequelize")
const moment = require("moment")
const {midtransApi, getPagination, getPagingData} = require('../config/mixins')

module.exports = {
    allProduct: async(req, res) => {
        let program = await Program.findAndCountAll()

        try{
            if(!program){
                res.status(404).json({message: 'Tipe program tidak tersedia', status: false})
            }else{
                const data = [program.count]

                res.json({
                    data : data,
                    message: 'Total program berhasil ditampilkan',
                    request: {
                        method: req.method,
                        url: process.env.BASE_URL + 'product'
                    },
                    status: true
                })
            }
        }catch(err){
            res.status(404).json({message : 'Terjadi kesalahan pada program', status: false})
        }
    },
    allAccepted: async(req, res) => {
        let { year } = req.query
        checkAccepted()
        await Payment.findAll({
            include: [{
                model: Payment,
                as: 'payments',
            },{
                model: User,
                as: 'user',
            }],
            where:{
                [Op.or]: [{status:'Accepted'}, {status:'Delivering'}, {status:'Processing'}]
        }}).then(data => {
            if(!data){
                res.status(404).json({message: 'Program yang sudah dibayar tidak ditemukan', status: false})
            }else{
                let total_harga = 0
                let count = {
                    program : { januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, oktober: 0, november: 0, desember: 0 }
                }

                let payments = []
                data.map(item =>{
                    if(moment(item.updatedAt).format('YYYY') == year){
                        month = moment(item.updatedAt).format('MM')
                        checkMonth(count.program, month)
                    }

                    total_harga = total_harga + item.total_harga
                    let payment_item = {
                        'id' : item.kode,
                        'title' : `Rp. ${Number(item.total_harga).toLocaleString()},00`,
                        'total_harga' : `Rp. ${Number(item.total_harga).toLocaleString()},00`,
                        'start' : item.updatedAt,
                        'user_id' : item.user_id,
                        'user_nama' : null,
                        'user_email' : null,
                    }
                    if(item.user){
                        payment_item.user_nama = item.user.nama
                        payment_item.user_email = item.user.email
                    }else{
                        payment_item.user_nama = 'Akun sudah dihapus'
                        payment_item.user_email = 'Akun sudah dihapus'
                    }
                    payments.push(payment_item)
                })

                const countMonth = {
                    program : Object.values(count.program),
                }

                res.json({
                    count: countMonth,
                    total_harga : total_harga,
                    payments : payments,
                    message: 'Program yang sudah dibayar berhasil ditampilkan',
                    request: {
                        method: req.method,
                        url: process.env.BASE_URL + 'accepted'
                    },
                    status: true
                })
            }
        }).catch(() => {
            res.status(404).json({message : 'Program yang sudah dibayar tidak ditemukan', status: false})
        })
    },
    getHistory: async(req, res) => {
        let { page } = req.query
        const { limit, offset } = getPagination(page, 10)
        await checkStatus(req.params.status, limit, offset).then(data => {            
            if(!data){
                res.status(404).json({message: 'Tipe program tidak tersedia', status: false})
            }else{
                let total_harga = 0
                data.rows.map(item =>{
                    total_harga = total_harga + item.total_harga
                })
                
                const { totalItems, dataPaginate, totalPages, currentPage } = getPagingData(data, page, limit)

                if(dataPaginate.length != 0 && !isNaN(currentPage)){
                    res.json({
                        total_harga : total_harga,
                        totalItems : totalItems,
                        limitItems : limit,
                        totalPages : totalPages,
                        currentPage : currentPage,
                        payments : dataPaginate,
                        message: 'Transaksi berhasil ditampilkan',
                        request: {
                            method: req.method,
                            url: process.env.BASE_URL + 'accepted'
                        },
                        status: true
                    })
                }else{res.json({totalItems : 0, message : 'Belum ada transaksi', status: false})}
            }
        }).catch(() => {
            res.status(404).json({message : 'Belum ada transaksi', status: false})
        })
    },
    showPayment: async(req, res) => {
        if(req.params.kode){
            await checkStatus(req.params.status, null, null, null, req.params.kode).then(data => {
                if(!data){
                    res.status(404).json({message: 'Pembayaran tidak ditemukan', status: false})
                }else{
                    const core = midtransApi()
                    core.transaction.status(data.kode).then((response)=>{
                        res.json({
                            payment: response,
                            data : data,
                            message: 'Pembayaran berhasil ditampilkan',
                            request: {
                                method: req.method,
                                url: process.env.BASE_URL + 'payments/' + req.params.status + req.params.kode
                            },
                            status: true
                        })
                    })
                }
            }).catch(() => {
                res.status(404).json({message : 'Pembayaran tidak ditemukan', status: false})
            })
        }else{
            res.status(404).json({message : 'Kode pembayaran belum dimasukkan', status: false})
        }
    },
    searchPayments: async(req, res) => {
        if(req.params.keyword == ''){
            res.status(404).json({message : 'Program tidak ditemukan', status: false})
        }
        let { page } = req.query
        const { limit, offset } = getPagination(page, 10)
        
        await checkStatus(req.params.status, limit, offset, req.params.keyword).then(data => {
            if(!data){
                res.status(404).json({message: 'Tipe program tidak tersedia', status: false})
            }else{
                let total_harga = 0
                data.rows.map(item =>{
                    total_harga = total_harga + item.total_harga
                })

                const { totalItems, dataPaginate, totalPages, currentPage } = getPagingData(data, page, limit)

                if(dataPaginate.length != 0 && !isNaN(currentPage)){
                    res.json({
                        total_harga : total_harga,
                        totalItems : totalItems,
                        limitItems : limit,
                        totalPages : totalPages,
                        currentPage : currentPage,
                        payments : dataPaginate,
                        message: 'Pencarian berhasil ditampilkan',
                        request: {
                            method: req.method,
                            url: process.env.BASE_URL + 'payments/search/' + req.params.status + req.params.keyword
                        },
                        status: true
                    })
                }else{res.json({totalItems : 0, message : 'Pencarian tidak ditemukan', status: false})}
            }
        }).catch(() => {
            res.status(404).json({message : 'Pencarian tidak ditemukan', status: false})
        })
    },
    replyComment: async(req, res) => {
        if(req.body.messages == ''){
            res.status(404).json({message : 'Anda belum memasukkan kata apapun', status: false})
        }else{
            const comment = await Comment.findOne({where:{kode: req.params.kode}})
            if(comment != null){
                try{
                    const adminKode = 'ADMIN-'+req.params.kode
                    let replyReq = {
                        kode: adminKode,
                        user_id: req.decoded.id,
                        program_id: comment.program_id,
                        reply_kode: req.params.kode,
                        messages: req.body.messages,
                        status: 'Accepted',
                        role: 'Admin',
                    }

                    if(req.body.program_id){
                        replyReq.program_id = req.body.program_id
                    }
                    await Comment.create(replyReq)

                    res.json({
                        message: 'Komentar berhasil ditambahkan',
                        request: {
                            method: req.method,
                            url: process.env.BASE_URL + 'product/reply/' + req.params.kode
                        },
                        status: true
                    })
                }catch(e){
                    res.status(500).json({message : 'Terjadi kesalahan saat menambah komentar', status: false})
                }
            }else{
                res.status(404).json({message : 'Komentar tidak ditemukan', status: false})
            }
        }
    }
}

function checkMonth(count, month){
    if(month == 1)count.januari += 1
    if(month == 2)count.februari += 1
    if(month == 3)count.maret += 1
    if(month == 4)count.april += 1
    if(month == 5)count.mei += 1
    if(month == 6)count.juni += 1
    if(month == 7)count.juli += 1
    if(month == 8)count.agustus += 1
    if(month == 9)count.september += 1
    if(month == 10)count.oktober += 1
    if(month == 11)count.november += 1
    if(month == 12)count.desember += 1
}

async function checkAccepted(){
    await Payment.findAll({where: {status: 'Pending'}}).then(data=>{
        const now = new Date()
        let expired
        if(data.length == 0){
            return false
        }else{
            const midtransCheck = midtransApi()
            data.map(item =>{
                midtransCheck.transaction.status(item.kode).then(async (response)=>{
                    if(response){
                        if(response.transaction_status == 'settlement'){
                            await Payment.update({status: 'Accepted', expiredAt: null, deeplink_url: null},{where: {kode: item.kode}})
                            await Comment.update({status: 'Accepted'},{where: {kode: item.kode}})
                        }
                    }

                    expired = item.expiredAt !== null && new Date(item.expiredAt) - now < 0
                    if(expired){
                        await Comment.destroy({where: {kode: item.kode}})
                        await Payment.destroy({where: {kode: item.kode}})
                    }
                })
            })
        }
    })
}

async function checkStatus (status, limit, offset, keyword, kode) {
    checkAccepted()
    let include = [{
        model: Payment,
        as: 'payments',
        include : [{model : Program, as: 'program'}] // nested association
    },{
        model: User,
        as: 'user',
    },{
        model: Comment,
        as: 'comment',
    }]

    if(kode){
        return Payment.findOne({include: include, where: {kode: kode, status: `${status}`}})
    }else{
        if(keyword){
            return Payment.findAndCountAll({limit, offset, include: include, where : {
                kode : {
                    [Op.like]: `%${keyword}%`,
                },
                status : `${status}`
            }, order: [['updatedAt', 'DESC']], distinct: true})
        }
        
        return Payment.findAndCountAll({limit, offset, include: include, where : {status : `${status}`}, order: [['updatedAt', 'DESC']], distinct: true})
    }

}