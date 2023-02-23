const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

module.exports = router;

router.post('/login', userController.loginUser);

router.post('/', userController.registerNewUser);
