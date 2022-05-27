require('dotenv').config()
const {MIDTRANS_SERVER, MIDTRANS_CLIENT} = process.env
const midtransClient = require('midtrans-client')
const imagemin = require("imagemin")
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require("imagemin-pngquant")
const imageminGiflossy = require('imagemin-giflossy')
const fs = require('fs')

async function compressImage(source, destination, sourcePath){
    await imagemin([source], {
        destination: destination,
        plugins: [
            imageminMozjpeg({quality: [20]}),
            imageminPngquant({quality: [0.6, 0.8]}),
            imageminGiflossy({ lossy: 80 })
        ]
    })
    .then(() => {
        deleteFile(sourcePath)
    })
}

function moveFile(source, destination) {
    if(fs.existsSync(source)){
        fs.copyFile(source, destination, (err) => {
            fs.unlinkSync(source);
        })
    }
}

function deleteFile(source) {
    if(fs.existsSync(source)){
        fs.unlinkSync(source);
    }
}

function makeDirectory(source) {
    if(!fs.existsSync(source)){
        fs.mkdirSync(source);
    }
}

function createSlug(string) {
    return string
            .toString()
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]+/g, "")
            .replace(/\-\-+/g, "-")
            .replace(/^-+/, "")
            .replace(/-+$/, "")
}

function midtransApi() {
    return new midtransClient.CoreApi({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction : false,
        serverKey : MIDTRANS_SERVER,
        clientKey : MIDTRANS_CLIENT
    })
}

function PaymentInit(status) {
    status = status[0].toUpperCase() + status.slice(1)

    if(status == 'Pending'){
        message = 'Transaksi berhasil ditampilkan'
        errorMessage = 'Belum ada transaksi'
    }else if(status == 'Processing'){
        message = 'Transaksi berhasil ditampilkan'
        errorMessage = 'Belum ada transaksi'
    }else if(status == 'Delivering'){
        message = 'Transaksi berhasil ditampilkan'
        errorMessage = 'Belum ada transaksi'
    }else if(status == 'Accepted'){
        message = 'Riwayat pembelian berhasil ditampilkan'
        errorMessage = 'Belum ada riwayat pembelian'
    }else{
        res.status(404).json({message : 'Transaksi tidak ditemukan', status: false})
    }
    
    return { status, message, errorMessage }
}

function getPagination(page, limit) {
    const offset = page ? page * limit : 0

    return { limit, offset }
}

function getPagingData(data, page, limit) {
    const { count: totalItems, rows: dataPaginate } = data
    const currentPage = page ? +page : 0
    const totalPages = Math.ceil(totalItems / limit)
    
    return { totalItems, dataPaginate, totalPages, currentPage }
}

module.exports = {
    // modules
    fs,

    // function
    compressImage,
    moveFile,
    deleteFile,
    makeDirectory,
    createSlug,
    midtransApi,
    PaymentInit,
    getPagination,
    getPagingData,
}