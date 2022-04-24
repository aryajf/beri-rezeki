const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
    const token = req.headers['authorization']
    try{
        let decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.decoded = {
            id: decoded.id,
            nama: decoded.nama,
            email: decoded.email,
            role: decoded.role
        }

        next()
    }catch(err){
        res.status(401).json({message: "You're not authenticated", status: false})
    }
}