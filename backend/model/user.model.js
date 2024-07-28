const mongoose = require('mongoose');

const userModel = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    notification: []
},{timestamps: true})

module.exports = mongoose.model('users', userModel)