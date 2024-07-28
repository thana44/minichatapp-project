const jwt = require('jsonwebtoken')

const middleware = async(req, res, next) => {
    try{
        const token = req.header('Authorization')?.split(' ')[1]

        if(!token) {
            return res.json('No token.')
        }

        const decoded = jwt.verify(token, process.env.jwt_secrect)

        req.user = decoded

        next()

    }catch(err){
        return res.status(401).json(err)
    }
}
module.exports = middleware;