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

router.get('/', async function(req, res) {
    res.json({
        messages: 'hello world'
    })
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

router.route('/payments/search/:status/:keyword')
    .get(checkAuth, isAdmin, admin.searchPayments)

router.route('/payments/:status/:kode')
    .get(checkAuth, isAdmin, admin.showPayment)

router.route('/history/:status')
    .get(checkAuth, isAdmin, admin.getHistory)

// PROGRAM
router.route('/program')
    .get(program.index)
    .post(checkAuth, isAdmin, fileUpload.single('cover'), program.store)

router.route('/program/reply/:kode')
    .post(checkAuth, isAdmin, admin.replyComment)

router.route('/program/:slug')
    .get(program.show)
    .put(checkAuth, isAdmin, fileUpload.single('cover'), program.update)
    .delete(checkAuth, isAdmin, program.delete)

// SEARCH PROGRAM
router.route('/program/search/:keyword')
    .get(program.search)

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