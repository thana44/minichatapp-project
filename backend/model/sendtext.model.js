const mongoose = require('mongoose');

const sendText = mongoose.Schema({
    userSend: String,
    userGet: String,
    text: String
},{timestamps:true})

module.exports = mongoose.model('send', sendText);