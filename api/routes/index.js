var express = require('express')
var router = express.Router()

// CALL CONTROLLER
const admin = require('../controllers/admin')
const auth = require('../controllers/auth')
const comment = require('../controllers/comment')
const payment = require('../controllers/payment')
const program = require('../controllers/program')
const user = require('../controllers/user')

// CALL MIDDLEWARE
const checkAuth = require('../middleware/checkAuth')
const isAdmin = require('../middleware/isAdmin')
const fileUpload = require('../middleware/fileUpload')

// USER MODEL & BSCRYPT
const {User} = require('../models')
const bcrypt = require('bcrypt')

router.get('/', async function(req, res) {
    let email = 'beriberkahrezeki@gmail.com'
    let user = await User.findOne({where: {email: email}})
    if(user){
        res.status(500).json("Email sudah digunakan")
        return
    }

    await User.create({
        email: email,
        nama: 'Beri Rezeki',
        password: bcrypt.hashSync('berirezeki123', 10, null),
        no_telp: '0812345678',
        role: 'Admin',
        email_status: 'Verified',
        email_verified_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
    })
    res.redirect(process.env.HOME_URL)
})

// AUTH
router.post('/login', auth.login)
router.post('/register', auth.register)
router.get('/profile', checkAuth, auth.profile)
router.put('/profile/update', checkAuth, auth.updateProfile)
router.put('/profile/updateAvatar', checkAuth, fileUpload.single('avatar'), auth.updateAvatar)
router.get('/verify/:email/:token', auth.verifyEmail)
router.post('/password/forgot', auth.forgotPasswordRequest)
router.put('/password/update/:email/:token', auth.updatePassword)
router.post('/password/change', checkAuth, auth.changePassword)

// ADMIN
router.route('/user')
    .get(checkAuth, isAdmin, user.getUsers)
    .post(checkAuth, isAdmin, user.createUser)
router.route('/user/:id')
    .get(checkAuth, isAdmin, user.showUsers)
    .delete(checkAuth, isAdmin, user.deleteUser)
router.route('/user/search/:status/:keyword')
    .get(checkAuth, isAdmin, user.searchUsers)
router.route('/user/search/:keyword')
    .get(checkAuth, isAdmin, user.searchUsers)

router.route('/product')
    .get(checkAuth, isAdmin, admin.allProduct)

router.route('/accepted')
    .get(checkAuth, isAdmin, admin.allAccepted)

router.route('/history')
    .get(checkAuth, isAdmin, admin.getHistory)
    
router.route('/history/:kode')
    .get(checkAuth, isAdmin, admin.showPayment)

// PROGRAM
router.route('/program')
    .get(program.index)
    .post(checkAuth, isAdmin, fileUpload.fields([{name: 'cover'}, {name: 'pdf_file'}]), program.store)

router.route('/comment/reply/:kode')
    .post(checkAuth, isAdmin, admin.replyComment)

router.route('/program/:slug')
    .get(program.show)
    .put(checkAuth, isAdmin, fileUpload.fields([{name: 'cover'}, {name: 'pdf_file'}]), program.update)
    .delete(checkAuth, isAdmin, program.delete)

// COMMENTS
router.get('/comments', comment.get)

router.route('/comment/like/:kode')
    .post(checkAuth, comment.like)

// PAYMENTS
router.route('/payment/notification')
    .post(payment.handleNotification)

router.route('/payment/buy/:slug')
    .put(checkAuth, payment.buyProduct)

// router.route('/payment/check/:kode')
//   .get(checkAuth, payment.checkStatus)

router.route('/payment/cancel/:kode')
    .delete(checkAuth, payment.cancelPayment)

router.route('/payment/:type/:status')
    .get(checkAuth, payment.getPayment)

router.route('/payment/:type/:status/:kode')
    .get(checkAuth, payment.show)

module.exports = router