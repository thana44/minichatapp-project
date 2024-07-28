const usermodel = require('../model/user.model');

const usersList = async(req, res)=>{
    try{
        const users = await usermodel.find({_id: {$ne: req.user._id}}).select('-password -email')
        return res.json({users, currentUser: req.user})
    }catch(err){
        console.log(err)
    }
};

const addNotification = async(req, res)=>{
    const {userid} = req.body
    try{
        const myid = req.user._id
        const add = await usermodel.findOneAndUpdate({_id: userid}, {$push: {notification: myid}},{new:true})
        return res.json(add)
    }catch(err){
        console.log(err)
    }
};

const readNotification = async(req, res)=>{
    const {userid} = req.body
    try{
        const myid = req.user._id
        const read = await usermodel.findOneAndUpdate({_id: myid}, {$pull: {notification: userid}}, {new:true})
        return res.json(read)
    }catch(err){
        console.log(err)
    }
};

const getNotification = async(req, res)=>{
    try{
        const me = await usermodel.findOne({_id: req.user._id})
        return res.json(me.notification)
    }catch(err){
        console.log(err)
    }
};

module.exports = {usersList, addNotification, readNotification, getNotification};