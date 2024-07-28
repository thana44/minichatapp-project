const express = require('express');
const { findRoom, sendMessage } = require('../controllers/chat.controller');
const middleware = require('../middleware/auth.middleware');
const router = express.Router()

router.post('/findroom', middleware, findRoom)
router.post('/sendmessage', middleware, sendMessage)


module.exports = router;