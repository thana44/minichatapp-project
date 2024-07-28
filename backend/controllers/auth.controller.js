const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const usermodel = require('../model/user.model')


const registerController = async(req, res) => {
    try{
        const {username, email, password} = req.body

        if(!username || !email || !password) {
            return res.json({err: "Please fill in all the fields."})
        }

        const findname = await usermodel.findOne({username})
        const findemail = await usermodel.findOne({email})

        if (findname) {
            return res.json({err: 'The name has already been used.'})
        }

        if(findemail) {
            return res.json({err: 'The email has already been used.'})
        }
        
        const passwordHash = bcrypt.hashSync(password, await bcrypt.genSalt(10))
        const createUser = await usermodel.create({username, email, password: passwordHash})

        return res.json(createUser)

    }catch(err){
        console.log(err)
    }
};

const loginController = async(req, res) => {
    try{
        const {email, password} = req.body

        if(!email || !password) {
            return res.json({err: 'Please fill in all the fields.'})
        }

        const finduser = await usermodel.findOne({email})

        if(!finduser) {
            return res.json({err: 'Wrong email or password.'})
        }

        const checkPass = await bcrypt.compare(password, finduser.password)
        
        if(!checkPass) {
            return res.json({err: 'Wrong email or password.'})
        }

        const token = jwt.sign({_id: finduser._id, username: finduser.username}, process.env.jwt_secrect,{expiresIn: '1h'})
        
        return res.json({token})
        
    }catch(err){
        console.log(err)
    }
};

module.exports = {registerController, loginController};