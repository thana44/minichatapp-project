const express = require('express');
const {usersList, addNotification, readNotification, getNotification} = require('../controllers/user.controller');
const middleware = require('../middleware/auth.middleware')
const router = express.Router();

router.get('/users', middleware, usersList);
router.put('/addNoti', middleware, addNotification);
router.put('/readNoti', middleware, readNotification);
router.get('/getNoti', middleware, getNotification);

module.exports = router;