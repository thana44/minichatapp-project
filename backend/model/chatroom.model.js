const mongoose = require('mongoose');

const chatRoom = mongoose.Schema({
    roomUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    Allchat: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'send'
    }]
},{timestamps:true})

module.exports = mongoose.model('chatRoom', chatRoom);