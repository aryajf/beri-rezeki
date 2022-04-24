var express = require('express')
var router = express.Router()

router.get('/', async function(req, res) {
    res.json({
        messages: 'hello world'
    })
})

module.exports = router