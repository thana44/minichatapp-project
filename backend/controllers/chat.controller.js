const chatmodel = require('../model/chatroom.model')
const sendtextmodel = require('../model/sendtext.model');
const userModel = require('../model/user.model');

const findRoom = async(req, res) => {
    const {myid, userid} = req.body
    try{
        const [user1, user2] = await userModel.find({_id: [myid, userid]})
        if(!user1 || !user2){
            return res.status(404).json('err id')
        }
        
        if(myid !== req.user._id){
            return res.status(401).json('protect chat')
        }
        const findroom = await chatmodel.findOne({
            roomUsers: {$all: [myid, userid]}
        })
        
        if(!findroom) {
            const createRoom = await chatmodel.create({
                roomUsers: [myid, userid],
                Allchat: []
            })

            const dtWhenCreate = await createRoom.populate('roomUsers', '_id username')
            
            return res.json({
                allchat: dtWhenCreate.Allchat, 
                roomusers: dtWhenCreate.roomUsers,
                me: req.user._id
            })
        }
        
        if(findroom.Allchat.length > 0) {
            const withMessage = await findroom
            .populate('roomUsers Allchat', '_id username userSend userGet text')
            return res.json({
                allchat: withMessage.Allchat, 
                roomusers: withMessage.roomUsers,
                me: req.user._id
            })
        }

        const noMessage = await findroom.populate('roomUsers', '_id username')

        return res.json({
            allchat: noMessage.Allchat, 
            roomusers: noMessage.roomUsers,
            me: req.user._id
        })
        
    }catch(err){
        console.log(err)
        return res.status(404).json('err id')
    }
};

const sendMessage = async(req, res) => {
    const {usersend, userget, text} = req.body
    try{
        if(!text) {
            return res.json('No message.')
        }

        const message = await sendtextmodel.create({
            userSend: usersend,
            userGet: userget,
            text
        })

        const addMessage = await chatmodel.findOneAndUpdate({
            roomUsers: {$all: [usersend, userget]}
        }, {$push: {Allchat: message._id}}, {new:true})

        await addMessage
        .populate('roomUsers Allchat', '_id username userSend userGet text')

        return res.json(addMessage)
        
    }catch(err){
        console.log(err)
    }
};

module.exports = {findRoom, sendMessage};