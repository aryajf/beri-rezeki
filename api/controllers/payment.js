require('dotenv').config()
const {MIDTRANS_SERVER, JWT_SECRET_EXPIRES, MAIL_FROM_ADDRESS} = process.env
const {Payment, Comment, Program, User} = require('../models')
const crypto = require("crypto")
const emailConfig = require('../config/email')
const nodemailer = require("nodemailer")
const { Op } = require("sequelize")
const {midtransApi, PaymentInit, getPagination, getPagingData} = require('../config/mixins')

module.exports = {
    show: async(req, res) => {
        req.params.status = req.params.status[0].toUpperCase() + req.params.status.slice(1)
        req.params.kode = req.params.kode[0].toUpperCase() + req.params.kode.slice(1)

        await checkStatus( req.decoded.id, req.params.status, null, null, null, req.params.kode).then(data => {
            const {message, errorMessage} = PaymentInit(data.status)
            if(data){
                if(data.status == 'Pending' || data.status == 'Processing' || data.status == 'Delivering' || data.status == 'Accepted'){
                    const core = midtransApi()
                    core.transaction.status(data.kode).then((response)=>{
                        res.json({
                            payment: response,
                            data : data,
                            message: message,
                            request: {
                                method: req.method,
                                url: process.env.BASE_URL + 'payment/' + req.params.status + req.params.kode
                            },
                            status: true
                        })
                    })
                }
            }else{res.status(404).json({message : 'Tidak ada data pembayaran', status: false})}
        
        }).catch(() => {
            res.status(404).json({message : 'Terjadi kesalahan', status: false})
        })
    },
    getPayment: async(req, res) => {
        req.params.status = req.params.status[0].toUpperCase() + req.params.status.slice(1)
        const {message, errorMessage, status} = PaymentInit(req.params.status)
        let { page } = req.query
        const { limit, offset } = getPagination(page, 5)
        
        await checkStatus( req.decoded.id, status, limit, offset, null, null).then(data => {
            
            const { totalItems, dataPaginate, totalPages, currentPage } = getPagingData(data, page, limit)
            
            if(dataPaginate.length != 0 && !isNaN(currentPage)){
                res.json({
                    totalItems : totalItems,
                    limitItems : limit,
                    totalPages : totalPages,
                    currentPage : currentPage,
                    payments : dataPaginate,
                    message: message,
                    request: {
                        method: req.method,
                        url: process.env.BASE_URL + 'payment'
                    },
                    status: true
                })
            }else{res.json({totalItems : 0, message : errorMessage, status: false})}
        
        }).catch(() => {
            res.status(404).json({message : 'Data tidak ditemukan', status: false})
        })
    },
    checkStatus: async(req, res) => {
        const kode = req.params.kode
        const core = midtransApi()
        core.transaction.status(kode).then((response)=>{
            res.json({
                response: response,
                status: true
            })
        })
    },
    cancelPayment: async(req, res) => {
        const kode = req.params.kode
        const core = midtransApi()
        const payment = await Payment.findOne({where: {kode: kode, user_id: req.decoded.id}})
        
        if(payment){
            core.transaction.cancel(kode).then(async (response)=>{
                await Comment.destroy({where: {kode: response.order_id, user_id: req.decoded.id}})
                payment.destroy()

                res.json({
                    message: `Berhasil membatalkan pembayaran`,
                    status: true
                })
            }).catch((e) => {
                res.status(500).json({err:e,message : 'Terjadi kesalahan saat membatalkan pembayaran', status: false})
            })
        }else{
            res.status(404).json({message : 'Transaksi tidak ditemukan', status: false})
        }
    },
    handleNotification: async(req, res) => {
        const payload = req.body
        const validSignatureKey = crypto.createHash('sha512').update(payload.order_id + payload.status_code + payload.gross_amount + MIDTRANS_SERVER).digest('hex')
        if(payload.signature_key != validSignatureKey){
            return res.status(404).json({message : 'Invalid Signature Key', status: false})
        }

        const core = midtransApi()
        core.transaction.notification(payload).then(async (statusResponse) => {
            const orderId = statusResponse.order_id
            const paymentType = statusResponse.payment_type
            const transactionStatus = statusResponse.transaction_status
            const fraudStatus = statusResponse.fraud_status

            if (paymentType == 'bank_transfer' || paymentType == 'gopay' || paymentType == 'credit_card'){
                if (fraudStatus == 'deny'){
                    return res.status(404).json({message : 'Payment includes fraud', status: false})
                }
            }
            
            if (transactionStatus == 'settlement'){
                await Payment.update({status: 'Accepted', expiredAt: null, deeplink_url: null},{where: {kode: orderId}})
                await Comment.update({status: 'Accepted'},{where: {kode: orderId}})
            }

            res.json({
                message: `Notifikasi transaksi diterima. Order ID: ${orderId}. Status Transaksi: ${transactionStatus}. Status Fraud: ${fraudStatus}`,
                status: true
            })
        }).catch(()=>{
            res.status(500).json({message : 'Terjadi kesalahan saat menampilkan notifikasi transaksi', status: false})
        })
    },
    buyProduct: async(req, res) => {
        if(req.decoded.role != 'Member'){
            return res.status(403).json({message : 'Access Denied', status: false})
        }

        const user = await User.findOne({where : {
            id: req.decoded.id
        }})
        
        let harga, expired
        const now = new Date()
        
        let kode = 'INV-' + crypto.randomBytes(5).toString('hex') + now.getTime().toString().slice(-4)
        let program = await Program.findOne({where : {
            slug: req.params.slug
        }})

        if(program){
            expired = new Date(program.expiredAt) - now < 0
            if(expired){
                return res.status(404).json({message : 'program sudah kadaluarsa', status: false})
            }
            harga = program.harga
            
            if(program.type == 'Crowdfunding'){
                if(req.body.harga){
                    harga = req.body.harga
                }else{
                    return res.status(404).json({message : 'Masukkan nominal pembayaran', status: false})
                }
            }
        }

        // Cek minimum pembayaran
        if(harga < 1000){
            return res.status(404).json({message : 'Minimal pembayaran E-Wallet Rp. 1.000', status: false})
        }else if(req.body.harga < 10000){
            if(req.body.method != 'gopay'){
                return res.status(404).json({message : 'Metode pembayaran belum dipilih', status: false})
            }
        }
        
        // Cek maximum pembayaran
        if(req.body.method == 'gopay'){
            if(harga > 2000000){
                return res.status(404).json({message : 'Maksimal pembayaran Rp. 2.000.000', status: false})
            }
        }else if(req.body.method == 'alfamart' || req.body.method == 'indomaret'){
            if(harga > 5000000){
                return res.status(404).json({message : 'Maksimal pembayaran Rp. 5.000.000', status: false})
            }
        }else if(req.body.method == 'bni'){
            if(harga > 50000000){
                return res.status(404).json({message : 'Maksimal pembayaran Rp. 50.000.000', status: false})
            }
        }else if(req.body.method == 'permata' || req.body.method == 'mandiri'){
            if(harga > 999999999){
                return res.status(404).json({message : 'Maksimal pembayaran Rp. 999.999.999', status: false})
            }
        }else if(req.body.method == 'bca' || req.body.method == 'bri'){
            if(harga > 20000000000){
                return res.status(404).json({message : 'Maksimal pembayaran Rp. 20.000.000.000', status: false})
            }
        }
        
        if(program != null && user != null){
            let parameter = checkPaymentMethod(req.body.method, user, kode, harga)
            if(parameter == null){
                return res.status(404).json({message : 'Metode pembayaran belum dipilih', status: false})
            }
            
            const core = midtransApi()
            core.charge(parameter).then(chargeResponse => {
                core.transaction.status(kode).then(async response => {
                    let deeplinkUrl = null
                    let time = parseInt(JWT_SECRET_EXPIRES)
                    if(req.body.method == 'gopay'){
                        deeplinkUrl = chargeResponse.actions.find(link => link.name === 'deeplink-redirect').url
                        time = 900000
                    }
                    const expiresToken = Date.parse(response.transaction_time) + time

                    paymentReq = {
                        kode : kode,
                        user_id : req.decoded.id,
                        program_id : program.id,
                        total_harga : harga,
                        status: 'Pending',
                        deeplink_url : deeplinkUrl,
                        expiredAt: expiresToken,
                    }

                    await Payment.create(paymentReq)

                    if(req.body.messages){
                        commentReq = {
                            kode: kode,
                            user_id : req.decoded.id,
                            program_id : program.id,
                            messages : req.body.messages,
                            isAnonymous : false,
                            status: 'Pending',
                        }

                        if(req.body.isAnonymous == true){
                            commentReq.isAnonymous = true
                        }

                        await Comment.create(commentReq)
                    }

                    res.json({
                        response: chargeResponse,
                        message : `Program berhasil dipesan`,
                        request : {
                            method: req.method,
                            url: process.env.BASE_URL + '/payment/buy/' + req.params.slug
                        },
                        status: true
                    })
                })
            }).catch((err) => {
                console.log(err)
                res.status(500).json({message : 'Terjadi kesalahan saat membeli program', status: false})
            })
        }else{res.status(404).json({message : 'Program tidak ditemukan', status: false})}
    }
}

checkAccepted = async () => {
    await Payment.findAll({where: {status: 'Pending'}}).then(data=>{
        const now = new Date()
        let expired
        if(data.length == 0){
            return false
        }else{
            const midtransCheck = midtransApi()
            data.map(item => {
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

checkStatus = async (user_id, status, limit, offset, keyword, kode) => {
    checkAccepted()
    let include = [{
        model : Program,
        as: 'program'
    },{
        model: User,
        as: 'user',
    },{
        model: Comment,
        as: 'comment',
    }]

    if(kode){
        return Payment.findOne({include: include, where: {user_id: user_id, kode: kode, status: `${status}`}})
    }else{
        if(keyword){
            return Payment.findAndCountAll({limit, offset, include: include, where : {
                user_id: user_id,
                kode : {
                    [Op.like]: `%${keyword}%`,
                },
                status : `${status}`
            }, order: [['updatedAt', 'DESC']], distinct: true})
        }
        return Payment.findAndCountAll({include: include, where : {user_id : user_id, status : `${status}`}, order: [['updatedAt', 'DESC']], limit, offset, distinct: true })
    }
}

function checkPaymentMethod(method, user, kode, harga){
    let parameter = {
        "transaction_details": {
            "order_id": kode,
            "gross_amount": harga
        },
        "customer_details": {
            "first_name": user.nama,
            "email": user.email,
            "phone": user.no_telp,
            "billing_address": {
                "first_name": user.nama,
                "phone": user.no_telp,
                "address": user.alamat,
            },
            "shipping_address": {
                "first_name": user.nama,
                "phone": user.no_telp,
                "address": user.alamat,
            }
        },
    }

    switch(method){
        case 'bca':
            parameter.payment_type = "bank_transfer"
            parameter.bank_transfer = {
                "bank" : "bca"
            }
            break
        case 'bni':
            parameter.payment_type = "bank_transfer"
            parameter.bank_transfer = {
                "bank" : "bni"
            }
            break
        case 'bri':
            parameter.payment_type = "bank_transfer"
            parameter.bank_transfer = {
                "bank" : "bri"
            }
            break
        case 'permata':
            parameter.payment_type = "permata"
            break
        case 'mandiri':
            parameter.payment_type = "echannel"
            parameter.echannel = {
                "bill_info1" : "Pembayaran:",
                "bill_info2" : "Program Beri Rezeki",
            }
            break
        case 'gopay':
            parameter.payment_type = "gopay"
            break
        case 'alfamart':
            parameter.payment_type = "cstore"
            parameter.cstore = {
                "store" : "alfamart",
                "message" : "Pembayaran program Beri Rezeki"
            }
            break
        case 'indomaret':
            parameter.payment_type = "cstore"
            parameter.cstore = {
                "store" : "indomaret",
                "message" : "Pembayaran program Beri Rezeki"
            }
            break
        default:
            parameter = null
            break
    }

    return parameter
}
