const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { body, header, param } = require('express-validator');
const auth = require('../../../auth');

module.exports = router;

const regValidations = [
	body('nickname')
		.trim()
		.isLength({ min: 3, max: 15 })
		.escape()
		.withMessage('Nickname should be 3-15 characters long'),
	body('username')
		.trim()
		.isEmail()
		.isLength({ min: 12 })
		.withMessage('Email should be a minimun of 12 characters long'),
	body('password')
		.trim()
		.isLength({ min: 8, max: 50 })
		.withMessage('Password should be 8-50 characters long'),
	body('phoneNumber')
		.trim()
		.isLength({ min: 7, max: 15 })
		.withMessage('Phone number is invalid'),
];

const searchValidations = [
	param('name')
		.escape()
		.trim()
		.stripLow()
		.isLength({ min: 1, max: 60 })
		.withMessage('Name should not exceed 60 characters long'),
];

const validateMongoId = [
	param('contactId').trim().isMongoId().withMessage('Invalid Id'),
];

router.post('/login', userController.loginUser);

router.post('/', regValidations, userController.registerNewUser);

router.get('/contacts', auth.verify, userController.getUserContacts);

router.get(
	'/search/:name',
	auth.verify,
	searchValidations,
	userController.findAllUsersByName
);

router.put(
	'/contacts/:contactId',
	auth.verify,
	validateMongoId,
	userController.addContact
);
