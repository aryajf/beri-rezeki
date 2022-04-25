require('dotenv').config()
const {MIDTRANS_SERVER, JWT_SECRET_EXPIRES, MAIL_FROM_ADDRESS} = process.env
const {Payment, Item, Comment, Proposal, TabunganNyimas, Investasi, Shop, Ongkir, User, Wisata, WisataPaket, WisataTransaksi, WisataTanggal} = require('../models')
const crypto = require("crypto")
const emailConfig = require('../config/email')
const nodemailer = require("nodemailer")
const { Op } = require("sequelize")
const {midtransApi, PaymentInit, getPagination, getPagingData, getOngkos} = require('../config/mixins')

module.exports = {
    show: async(req, res) => {
        req.params.status = req.params.status[0].toUpperCase() + req.params.status.slice(1)
        req.params.kode = req.params.kode[0].toUpperCase() + req.params.kode.slice(1)
        req.params.type = req.params.type[0].toUpperCase() + req.params.type.slice(1)

        await checkType( req.decoded.id, req.params.type, req.params.status, null, null, null, req.params.kode).then(data => {
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
                                url: process.env.BASE_URL + 'payment/' + req.params.type + req.params.status + req.params.kode
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
        req.params.type = req.params.type[0].toUpperCase() + req.params.type.slice(1)
        const {message, errorMessage, status} = PaymentInit(req.params.status)
        let { page } = req.query
        const { limit, offset } = getPagination(page, 5)
        
        await checkType( req.decoded.id, req.params.type, status, limit, offset, null, null).then(data => {
            
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
    getCart: async(req, res) => {
        req.params.type = req.params.type[0].toUpperCase() + req.params.type.slice(1)
        await checkCart(req.decoded.id, req.params.type).then(data => {
            if(data.length != 0){
                let total_harga = 0
                data.map(item => {
                    total_harga += item.harga
                })

                res.json({
                    totalHarga : total_harga,
                    totalItems : data.length,
                    items : data,
                    request: {
                        method: req.method,
                        url: process.env.BASE_URL + 'cart'
                    },
                    status: true
                })
            }else{
                res.json({
                    totalItems : data.length,
                    message : 'Anda belum menambahkan barang ke keranjang',
                    request: {
                        method: req.method,
                        url: process.env.BASE_URL + 'cart'
                    },
                    status: true
                })
            }
        }).catch((err) => {
            res.status(404).json({message : 'Data tidak ditemukan', status: false})
        })
    },
    setCart: async(req,res) => {
        const user = await User.findOne({where : {
            id: req.decoded.id
        }})
        let produk, kode, harga, qty
        const now = new Date()

        if(req.body.qty <= 0 || req.body.qty == null || req.body.qty == undefined){
            return res.status(404).json({message : 'Masukkan jumlah barang', status: false})
        }

        if(req.params.type == 'shop'){
            produk = await Shop.findOne({where : {
                slug: req.params.slug
            }})
            if(produk){
                if(produk.stock == 'Tidak Tersedia'){
                    return res.status(404).json({message : 'Stok produk habis', status: false})
                }
                kode = 'SHOP-' + now.getTime().toString().slice(-6).substring(0,4) + crypto.randomBytes(4).toString('hex') + now.getTime().toString().slice(-4)
                qty = req.body.qty
                harga = produk.harga * req.body.qty
            }
        }else{
            res.status(404).json({message : 'Tipe produk tidak ditemukan', status: false})
        }
        
        if(produk != null && user != null){
            // Cek apakah ada data yang sudah dimasukkan ke cart, kalau ada update kalau tidak ditambah

            const item = await Item.findOne({where : {
                produk_id: produk.id,
                status : 'Cart'
            }})

            if(item){
                let request = {
                    stok: item.stok + qty,
                    harga: item.harga + harga
                }

                item.update(request)
            }else{
                let produkType = req.params.type[0].toUpperCase() + req.params.type.slice(1)
                let request = {
                    user_id: req.decoded.id,
                    produk_id: produk.id,
                    kode: kode,
                    stok: qty,
                    harga: harga,
                    type: `${produkType}`,
                    status : 'Cart'
                }

                await Item.create(request)
            }
            
            res.json({
                message : 'Barang berhasil dimasukkan ke keranjang',
                request : {
                    method: req.method,
                    url: process.env.BASE_URL + '/payment/cart/'+req.params.type+'/'+req.params.slug
                },
                status: true
            })
        }else{res.status(404).json({message : 'Tipe produk tidak ditemukan', status: false})}
    },
    deleteCart: async(req,res) => {
        if(req.params.type == 'shop'){
            let produkType = req.params.type[0].toUpperCase() + req.params.type.slice(1)
            const item = await Item.findOne({where : {kode: req.params.kode, type: `${produkType}`, status: 'Cart', user_id: req.decoded.id}})
            
            if(item != null){
                item.destroy()

                res.json({
                    message : 'Item berhasil dihapus dari keranjang',
                    request : {
                        method: req.method,
                        url: process.env.BASE_URL + '/payment/cart/'+req.params.type+'/'+req.params.slug
                    },
                    status: true
                })
            }else{
                res.status(404).json({message : 'Item tidak ditemukan', status: false})
            }
        }else{
            res.status(404).json({message : 'Tipe produk tidak ditemukan', status: false})
        }
    },
    addQty: async (req, res) => {
        if(req.params.type == 'shop'){
            let produkType = req.params.type[0].toUpperCase() + req.params.type.slice(1)
            const item = await Item.findOne({where : {kode: req.params.kode, type: `${produkType}`, status: 'Cart', user_id: req.decoded.id}})
            
            if(item != null){
                let newHarga = item.harga / item.stok
                let cartReq = {
                    stok: item.stok + 1,
                    harga: item.harga + newHarga
                }
                item.update(cartReq)

                res.json({
                    message : 'Item berhasil ditambah',
                    request : {
                        item: cartReq,
                        method: req.method,
                        url: process.env.BASE_URL + '/payment/cart/'+req.params.type+'/'+req.params.slug
                    },
                    status: true
                })
            }else{
                res.status(404).json({message : 'Item tidak ditemukan', status: false})
            }
        }else{
            res.status(404).json({message : 'Tipe produk tidak ditemukan', status: false})
        }
    },
    removeQty: async (req, res) => {
        if(req.params.type == 'shop'){
            let produkType = req.params.type[0].toUpperCase() + req.params.type.slice(1)
            const item = await Item.findOne({where : {kode: req.params.kode, type: `${produkType}`, status: 'Cart', user_id: req.decoded.id}})

            if(item.stok <= 1){
                return res.status(404).json({message : 'Stok tidak bisa dikurangi', status: false})
            }
            
            if(item != null){
                let newHarga = item.harga / item.stok
                let cartReq = {
                    stok: item.stok - 1,
                    harga: item.harga - newHarga
                }
                item.update(cartReq)

                res.json({
                    message : 'Item berhasil dikurang',
                    request : {
                        item: cartReq,
                        method: req.method,
                        url: process.env.BASE_URL + '/payment/cart/'+req.params.type+'/'+req.params.slug
                    },
                    status: true
                })
            }else{
                res.status(404).json({message : 'Item tidak ditemukan', status: false})
            }
        }else{
            res.status(404).json({message : 'Tipe produk tidak ditemukan', status: false})
        }
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
                if(payment.type == 'Proposal'){
                    await Comment.destroy({where: {kode: response.order_id, user_id: req.decoded.id}})
                }else if(payment.type == 'Nyimas'){
                    let item = await Item.findOne({where: {kode: response.order_id}})
                    await TabunganNyimas.destroy({where: {id: item.produk_id}})
                }else if(payment.type == 'Wisata'){
                    await WisataTransaksi.destroy({where: {kode: response.order_id}})
                }else if(payment.type == 'Shop'){
                    await Ongkir.destroy({where: {kode: response.order_id}})
                }
                payment.destroy()
                await Item.destroy({where: {kode: response.order_id, user_id: req.decoded.id}})

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
    confirmPayment: async(req, res) => {
        const payment = await Payment.findOne({where: {kode: req.params.kode, user_id: req.decoded.id, status: 'Delivering'}})
        if(payment){
            try{
                if(payment.type == 'Shop'){
                    const items = await Item.findAll({where: {kode: req.params.kode, user_id: req.decoded.id}})
                    items.map(async (item) => {
                        await Comment.create({kode: item.kode, produk_id: item.produk_id, user_id: item.user_id, status: 'Pending', type: 'Shop'})
                    })
                }
                
                payment.update({status : 'Accepted'})
                res.json({
                    message: 'Berhasil mengonfirmasi pembayaran',
                    status: true
                })
            }catch(e){
                res.status(500).json({err:e,message : 'Terjadi kesalahan saat mengonfirmasi pembayaran', status: false})
            }
        }else{
            res.status(404).json({message : 'Transaksi tidak ditemukan', status: false})
        }
    },
    restartPayment: async(req, res) => {
        const payment = await Payment.findOne({where: {kode: req.params.kode, type: 'Investasi'}})
        const user = await User.findOne({where: {id: payment.user_id}})
        if(payment){
            const item = await Item.findOne({where: {kode: req.params.kode}})
            const investasi = await Investasi.findOne({where: {id: item.produk_id}})
            let closed = new Date()
            let transporter = nodemailer.createTransport(emailConfig)
            await transporter.sendMail({
                from: MAIL_FROM_ADDRESS,
                to: user.email,
                subject: "Investasi berhasil dilanjutkan - Pojoklaku",
                html: `
                <div>
                    <h1 style="color:#333;text-align:center;">Yaay Investasimu berhasil dilanjutkan</h1>
                    <div style="padding: auto 10px;">
                        <div>Harap cek website kami secara berkala yaa :) investasimu telah kami lanjutkan kembali sesuai tenor yang ditentukan</div>
                    </div>
                </div>
                `,
            })
            closed.setMonth( closed.getMonth() + investasi.tenor )
            payment.update({status : 'Processing', closedAt: closed}).then(() => {
                res.json({
                    message: 'Berhasil melanjutkan pembayaran',
                    status: true
                })
            }).catch((e) => {
                res.status(500).json({err:e,message : 'Terjadi kesalahan saat menlanjutkan pembayaran', status: false})
            })
        }else{
            res.status(404).json({message : 'Transaksi tidak ditemukan', status: false})
        }
    },
    acceptPayment: async(req, res) => {
        const payment = await Payment.findOne({where: {kode: req.params.kode}})
        const user = await User.findOne({where: {id: payment.user_id}})
        if(payment){
            try{
                let message
                if(payment.type == 'Shop'){
                    let transporter = nodemailer.createTransport(emailConfig)
                    await transporter.sendMail({
                        from: MAIL_FROM_ADDRESS,
                        to: user.email,
                        subject: "Barang dalam perjalanan - Pojoklaku",
                        html: `
                        <div>
                            <h1 style="color:#333;text-align:center;">Barang sedang kami antar</h1>
                            <div style="padding: auto 10px;">
                                <div>Harap cek website kami secara berkala yaa :) pesanan mu sedang kami antar ke tempat tujuanmu</div>
                            </div>
                        </div>
                        `,
                    })
                    payment.update({status : 'Delivering'})
                    message = 'Berhasil mengonfirmasi barang untuk dikirim'
                }else{
                    payment.update({status : 'Accepted'})
                    message = 'Berhasil mengonfirmasi pembayaran'
                }
                res.json({
                    message: message,
                    status: true
                })
            }catch(e){
                res.status(500).json({err:e,message : 'Terjadi kesalahan saat mengonfirmasi pembayaran', status: false})
            }
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
                let payment = await Payment.findOne({where: {kode: orderId}})

                if(payment.type == 'Proposal'){
                    await Payment.update({status: 'Accepted', expiredAt: null, deeplink_url: null},{where: {kode: orderId}})
                    await Comment.update({status: 'Accepted'},{where: {kode: orderId}})
                }else if(payment.type == 'Investasi'){
                    let item = await Item.findOne({where: {kode: orderId}})
                    let investasi = await Investasi.findOne({where: {id: item.produk_id}})
                    let closed = new Date()
                    closed.setMonth( closed.getMonth() + investasi.tenor )
                    if(payment.closedAt == null){
                        await Payment.update({status: 'Processing', closedAt: closed, expiredAt: null, deeplink_url: null},{where: {kode: orderId}})
                    }
                }
                else if(payment.type == 'Nyimas'){
                    let item = await Item.findOne({where: {kode: orderId}})
                    await TabunganNyimas.update({status: 'Accepted'}, {where: {status: 'Pending', id: item.produk_id}})
                    payment.update({status: 'Accepted', expiredAt: null, deeplink_url: null})
                }
                else if(payment.type == 'Shop'){
                    await Payment.update({status: 'Processing', expiredAt: null, deeplink_url: null},{where: {kode: orderId}})
                }else if(payment.type == 'Wisata'){
                    let transaksi = await WisataTransaksi.findOne({where: {kode: orderId}})
                    let tanggal = await WisataTanggal.findOne({where: {kode: orderId}})
                    if(tanggal == null){
                        await WisataTanggal.create({kode: orderId, startedAt: transaksi.startedAt, description: 'Sudah dipesan', type: 'Member'})
                    }
                    await Payment.update({status: 'Processing', expiredAt: null, deeplink_url: null},{where: {kode: orderId}})
                }
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
        const user = await User.findOne({where : {
            id: req.decoded.id
        }})
        
        let produk, kode, harga, stok, expired
        let hargaSatuGram = 0
        let hargaDuaGram = 0
        const now = new Date()
        
        if(req.params.type == 'proposal'){
            kode = 'SOSIAL-' + now.getTime().toString().slice(-6).substring(0,4) + crypto.randomBytes(4).toString('hex') + now.getTime().toString().slice(-4)
            produk = await Proposal.findOne({where : {
                slug: req.params.slug
            }})

            if(produk){
                stok = 1
                expired = new Date(produk.expiredAt) - now < 0
                if(expired){
                    return res.status(404).json({message : 'Produk sudah kadaluarsa', status: false})
                }
                harga = produk.harga
                
                if(produk.type == 'Crowdfunding'){
                    if(req.body.harga){
                        harga = req.body.harga
                    }else{
                        return res.status(404).json({message : 'Masukkan nominal pembayaran', status: false})
                    }
                }
            }
        }else if(req.params.type == 'investasi'){
            kode = 'INVESTASI-' + now.getTime().toString().slice(-6).substring(0,4) + crypto.randomBytes(4).toString('hex') + now.getTime().toString().slice(-4)
            produk = await Investasi.findOne({where : {
                slug: req.params.slug
            }})
            if(produk){
                stok = 1
                let checkAdministration = await Payment.findOne({where:{
                    type: 'Investasi',
                    user_id: req.decoded.id,
                    [Op.or]: [{
                        status: 'Processing'
                    },{
                        status: 'Accepted'
                    }],
                }})
                if(checkAdministration == null){
                    harga = produk.harga + 155000
                }else{
                    harga = produk.harga
                }
            }
        }else if(req.params.type == 'wisata'){
            kode = 'WISATA-' + now.getTime().toString().slice(-6).substring(0,4) + crypto.randomBytes(4).toString('hex') + now.getTime().toString().slice(-4)
            produk = await WisataPaket.findOne({where : {
                id: req.params.slug
            }})
            if(produk){
                if(req.body.startedAt == null || !req.body.startedAt){
                    return res.status(404).json({message : 'Masukkan tanggal pengadaan wisata', status: false})
                }else{
                    if(req.body.tiket_umum > produk.max_umum_tiket){
                        return res.status(404).json({message : 'Tiket Umum melebihi batas maksimal', status: false})
                    }

                    if(req.body.tiket_pelajar > produk.max_pelajar_tiket){
                        return res.status(404).json({message : 'Tiket Pelajar melebihi batas maksimal', status: false})
                    }

                    if(req.body.tiket_umum == null || !req.body.tiket_umum){
                        req.body.tiket_umum = 0
                    }
                    
                    if(req.body.tiket_pelajar == null || !req.body.tiket_pelajar){
                        req.body.tiket_pelajar = 0
                    }
                    
                    stok = 1
                    harga = (req.body.tiket_umum * produk.harga_umum) + (req.body.tiket_pelajar * produk.harga_pelajar)
                }
            }
        }else if(req.params.type == 'nyimas'){
            // Cek apakah jumlah emas satu gram dan dua gram pas terpenuhi dengan total emas
            if((req.body.nyimas.jumlah_satu_gram + req.body.nyimas.jumlah_dua_gram) !== req.body.nyimas.total_jumlah){
                return res.status(404).json({message : 'Jumlah Emas belum memenuhi jumlah total Emas', status: false})
            }

            if(req.body.nyimas.selectedAngsuran){
                let tipeAngsuran = req.body.nyimas.selectedAngsuran.split("-")[1]
                if(tipeAngsuran == 'harian'){
                    hargaSatuGram = req.body.nyimas.jumlah_satu_gram * 1000
                    hargaDuaGram = req.body.nyimas.jumlah_dua_gram * 2000
                }else if(tipeAngsuran == 'mingguan'){
                    hargaSatuGram = req.body.nyimas.jumlah_satu_gram * 70000
                    hargaDuaGram = req.body.nyimas.jumlah_dua_gram * 140000
                }else if(tipeAngsuran == 'bulanan'){
                    hargaSatuGram = req.body.nyimas.jumlah_satu_gram * 300000
                    hargaDuaGram = req.body.nyimas.jumlah_dua_gram * 600000
                }else{
                    return res.status(404).json({message : 'Tipe Angsuran tidak tersedia', status: false})
                }
            }else{
                return res.status(404).json({message : 'Masukkan Angsuran yang dipilih', status: false})
            }

            kode = 'NYIMAS-' + now.getTime().toString().slice(-6).substring(0,4) + crypto.randomBytes(4).toString('hex') + now.getTime().toString().slice(-4)
            produk = 'Nyimas'
            stok = 1
            harga = 160000 + hargaSatuGram + hargaDuaGram
        }else if(req.params.type == 'shop'){
            if(req.body.ongkir.no_telp == null || req.body.ongkir.alamat == null || req.body.ongkir.destination == null || req.body.ongkir.courier == null || req.body.ongkir.service == null || req.body.ongkir.cost == null || req.body.ongkir.etd == null){
                return res.status(404).json({message : 'Ongkir Belum Diisi', status: false})
            }

            kode = 'SHOP-' + now.getTime().toString().slice(-6).substring(0,4) + crypto.randomBytes(4).toString('hex') + now.getTime().toString().slice(-4)
            produk = await Item.findAll({where : {
                user_id: req.decoded.id,
                type: 'Shop',
                status: 'Cart'
            }})
            
            harga = 0
            if(produk){
                if(produk.length != 0){
                    produk.map(item => {
                        harga += item.harga
                    })
                    harga += (10/100) * harga
                    harga += req.body.ongkir.cost
                }else{
                    produk = null
                }
            }
        }else{
            return res.status(404).json({message : 'Tipe Produk tidak ditemukan', status: false})
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
        
        if(produk != null && user != null){
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

                    produkType = req.params.type[0].toUpperCase() + req.params.type.slice(1)

                    if(req.params.type == 'shop'){
                        await Ongkir.create({kode: kode, no_telp: req.body.ongkir.no_telp, alamat: req.body.ongkir.alamat, tujuan: req.body.ongkir.destination, kurir: req.body.ongkir.courier, service: req.body.ongkir.service, etd: req.body.ongkir.etd, harga: req.body.ongkir.cost})

                        await Item.update({kode: kode, status : 'Accepted'},
                        {where : {
                            user_id: req.decoded.id,
                            type: 'Shop',
                            status: 'Cart'
                        }})
                    }else if(req.params.type == 'nyimas'){
                        let angsuranType = req.body.nyimas.selectedAngsuran.split("-")[1]
                        tabunganNyimasReq = {
                            user_id : req.decoded.id,
                            total_jumlah: req.body.nyimas.total_jumlah,
                            jumlah_satu_gram: req.body.nyimas.jumlah_satu_gram,
                            jumlah_dua_gram: req.body.nyimas.jumlah_dua_gram,
                            harga_satu_gram: hargaSatuGram,
                            harga_dua_gram: hargaDuaGram,
                            angsuran: angsuranType[0].toUpperCase() + angsuranType.substring(1),
                            status : 'Pending'
                        }

                        let tabungan = await TabunganNyimas.create(tabunganNyimasReq)

                        let itemReq = {
                            user_id: req.decoded.id,
                            produk_id: tabungan.id,
                            kode: kode,
                            stok: stok,
                            harga: harga,
                            type: `${produkType}`,
                            status : 'Accepted'
                        }
            
                        await Item.create(itemReq)
                    }else{
                        if(req.params.type == 'wisata'){
                            wisataTransaksiReq = {
                                kode: kode,
                                user_id : req.decoded.id,
                                paket_id : produk.id,
                                tiket_umum : req.body.tiket_umum,
                                tiket_pelajar : req.body.tiket_pelajar,
                                startedAt : req.body.startedAt,
                            }
                            await WisataTransaksi.create(wisataTransaksiReq)
                        }
                        let itemReq = {
                            user_id: req.decoded.id,
                            produk_id: produk.id,
                            kode: kode,
                            stok: stok,
                            harga: harga,
                            type: `${produkType}`,
                            status : 'Accepted'
                        }
            
                        await Item.create(itemReq)
                    }
        
                    paymentReq = {
                        kode : kode,
                        user_id : req.decoded.id,
                        total_harga : harga,
                        status: 'Pending',
                        type: `${produkType}`,
                        deeplink_url : deeplinkUrl,
                        expiredAt: expiresToken,
                    }

                    await Payment.create(paymentReq)

                    if(req.body.messages){
                        commentReq = {
                            kode: kode,
                            user_id : req.decoded.id,
                            produk_id : produk.id,
                            messages : req.body.messages,
                            isAnonymous : false,
                            status: 'Pending',
                            type: `${produkType}`,
                        }

                        if(req.body.isAnonymous == true){
                            commentReq.isAnonymous = true
                        }

                        await Comment.create(commentReq)
                    }

                    res.json({
                        response: chargeResponse,
                        message : `${produkType} berhasil dipesan`,
                        request : {
                            method: req.method,
                            url: process.env.BASE_URL + '/payment/buy/'+ req.params.type + '/' + req.params.slug
                        },
                        status: true
                    })
                })
            }).catch(() => {
                res.status(500).json({message : 'Terjadi kesalahan saat membeli produk', status: false})
            })
        }else{res.status(404).json({message : 'Produk tidak ditemukan', status: false})}
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
                            if(item.type == 'Proposal'){
                                await Payment.update({status: 'Accepted', expiredAt: null, deeplink_url: null},{where: {kode: item.kode}})
                                await Comment.update({status: 'Accepted'},{where: {kode: item.kode}})
                            }else if(item.type == 'Investasi'){
                                let items = await Item.findOne({where: {kode: item.kode}})
                                let investasi = await Investasi.findOne({where: {id: items.produk_id}})
                                let closed = new Date()
                                closed.setMonth( closed.getMonth() + investasi.tenor )
                                if(item.closedAt == null){
                                    await Payment.update({status: 'Processing', closedAt: closed, expiredAt: null, deeplink_url: null},{where: {kode: item.kode}})
                                }
                            }else if(item.type == 'Nyimas'){
                                let items = await Item.findOne({where: {kode: item.kode}})
                                await TabunganNyimas.update({status: 'Accepted'}, {where: {status: 'Pending', id: items.produk_id}})
                                await Payment.update({status: 'Accepted', expiredAt: null, deeplink_url: null},{where: {kode: item.kode}})
                            }else if(item.type == 'Shop'){
                                await Payment.update({status: 'Processing', expiredAt: null, deeplink_url: null},{where: {kode: item.kode}})
                            }else if(item.type == 'Wisata'){
                                let transaksi = await WisataTransaksi.findOne({where: {kode: item.kode}})
                                let tanggal = await WisataTanggal.findOne({where: {kode: item.kode}})
                                if(tanggal == null){
                                    await WisataTanggal.create({kode: item.kode,startedAt: transaksi.startedAt, description: 'Sudah dipesan', type: 'Member'})
                                }
                                await Payment.update({status: 'Processing', expiredAt: null, deeplink_url: null},{where: {kode: item.kode}})
                            }
                        }
                    }
                    expired = item.expiredAt !== null && new Date(item.expiredAt) - now < 0
                    if(expired){
                        if(item.type == 'Proposal'){
                            await Comment.destroy({where: {kode: item.kode}})
                        }else if(item.type == 'Nyimas'){
                            let items = await Item.findOne({where: {kode: item.kode}})
                            await TabunganNyimas.destroy({where: {id: items.produk_id}})
                        }else if(item.type == 'Wisata'){
                            await WisataTransaksi.destroy({where: {kode: item.kode}})
                        }else if(item.type == 'Shop'){
                            await Ongkir.destroy({where: {kode: item.kode}})
                        }
                        await Payment.destroy({where: {kode: item.kode}})
                        await Item.destroy({where: {kode: item.kode}})
                    }
                })
            })
        }
    })
}

checkCart = async (user_id, type) => {
    let include = null
    switch (type) {
        case 'Proposal':
            include = [{
                model : Proposal,
                as: 'proposal'
            }]
            break
        case 'Shop':
            include = [{
                model : Shop,
                as: 'shop'
            }]
            break
        case 'Nyimas':
            include = [{
                model: TabunganNyimas,
                as: 'tabunganNyimas',
            }]
            break
        case 'Wisata':
            include = [{
                model: WisataTransaksi,
                as: 'wisataTransaksi'
            },{
                model : WisataPaket,
                as: 'wisataPaket',
                include : [{model : Wisata, as: 'wisata'}] 
            }]
            break
        case 'Investasi':
            include = [{
                model: Investasi,
                as: 'investasi'
            }]
            break
        default:
            break
    }
    return Item.findAll({include: include, where : {user_id : user_id, type : `${type}`, status : 'Cart'}, distinct: true })
}

checkType = async (user_id, type, status, limit, offset, keyword, kode) => {
    checkAccepted()

    let include = null
    switch (type) {
        case 'Proposal':
            include = [{
                model: Item,
                as: 'item',
                include : [{model : Proposal, as: 'proposal'}] // nested association
            },{
                model: User,
                as: 'user',
            },{
                model: Comment,
                as: 'comment',
            }]
            break
        case 'Shop':
            include = [{
                model: Item,
                as: 'items',
                include : [{model : Shop, as: 'shop'}] // nested association
            },{
                model: User,
                as: 'user',
            },{
                model: Comment,
                as: 'comments',
                include : [{model : Shop, as: 'shop'}]
            },{
                model: Ongkir,
                as: 'ongkir',
            }]
            break
        case 'Nyimas':
            include = [{
                model: Item,
                as: 'item',
                include : {model : TabunganNyimas, as: 'tabungan_nyimas'}
            },{
                model: User,
                as: 'user',
            },{
                model: Comment,
                as: 'comment',
            }]
            break
        case 'Wisata':
            include = [{
                model: Item,
                as: 'item',
                include : [{
                    model : WisataTransaksi,
                    as: 'wisataTransaksi',
                },{
                    model : WisataPaket,
                    as: 'wisataPaket',
                    include : [{model : Wisata, as: 'wisata'}] 
                }] // nested association
            },{
                model: User,
                as: 'user',
            },{
                model: Comment,
                as: 'comment',
            }]
            break
        case 'Investasi':
            include = [{
                model: Item,
                as: 'item',
                include : [{model : Investasi, as: 'investasi'}] // nested association
            },{
                model: User,
                as: 'user',
            },{
                model: Comment,
                as: 'comment',
            }]
            break
        default:
            break
    }

    if(kode){
        return Payment.findOne({include: include, where: {user_id: user_id, kode: kode, status: `${status}`,type : `${type}`}})
    }else{
        if(keyword){
            return Payment.findAndCountAll({limit, offset, include: include, where : {
                user_id: user_id,
                kode : {
                    [Op.like]: `%${keyword}%`,
                },
                type : `${type}`,
                status : `${status}`
            }, order: [['updatedAt', 'DESC']], distinct: true})
        }
        return Payment.findAndCountAll({include: include, where : {user_id : user_id, type : `${type}`, status : `${status}`}, order: [['updatedAt', 'DESC']], limit, offset, distinct: true })
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
                "bill_info1" : "Pembelian:",
                "bill_info2" : "Produk Pojoklaku",
            }
            break
        case 'gopay':
            parameter.payment_type = "gopay"
            break
        case 'alfamart':
            parameter.payment_type = "cstore"
            parameter.cstore = {
                "store" : "alfamart",
                "message" : "Pembelian produk Pojoklaku"
            }
            break
        case 'indomaret':
            parameter.payment_type = "cstore"
            parameter.cstore = {
                "store" : "indomaret",
                "message" : "Pembelian produk Pojoklaku"
            }
            break
        default:
            parameter = null
            break
    }

    return parameter
}
