const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { body } = require('express-validator');

module.exports = router;

const validations = [
	body('nickname')
		.trim()
		.isLength({ min: 3, max: 15 })
		.escape()
		.withMessage('Please check nickname'),
	body('username')
		.trim()
		.isEmail()
		.isLength({ min: 12 })
		.withMessage('Email should be a minimun of 12 characters long'),
	body('password')
		.trim()
		.isLength({ min: 8, max: 50 })
		.withMessage('Password should be a minumum of 8 characters and max of 50'),
	body('phoneNumber')
		.trim()
		.isLength({ min: 7, max: 15 })
		.withMessage('Phone number should be min of 7 and max of 15'),
];

router.post('/login', userController.loginUser);

router.post('/', validations, userController.registerNewUser);
