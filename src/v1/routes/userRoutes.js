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
	body('username').trim().isEmail().isLength({ min: 12 }).withMessage('Please check username'),
	body('password').trim().isLength({ min: 8, max: 50 }).withMessage('Please check your password'),
	body('phoneNumber').trim().isLength({ min: 7, max: 15 }).withMessage('Please check phoneNumber'),
];

router.post('/login', userController.loginUser);

router.post('/', validations, userController.registerNewUser);
