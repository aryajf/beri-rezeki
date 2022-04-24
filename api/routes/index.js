var express = require('express')
var router = express.Router()

// CALL CONTROLLER
const auth = require('../controllers/auth')
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

module.exports = router