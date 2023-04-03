const { body, header, param } = require('express-validator');

const registrationValidations = [
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
		.custom((value) => {
			const isValid =
				/^(?=\P{Ll}*\p{Ll})(?=\P{Lu}*\p{Lu})(?=\P{N}*\p{N})[\s\S]{8,}$/gu.test(
					value
				);

			if (!isValid) {
				throw new Error(
					'Password must be min of 8 characters long, with at least 1 uppercase, 1 lowercase and 1 number'
				);
			}

			return true;
		})
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

const phoneNumberValidator = [
	header('phoneNumber')
		.trim()
		.isMobilePhone()
		.withMessage('Invalid Phone Number! Number must start with a "+" sign '),
];

module.exports = {
	registrationValidations,
	searchValidations,
	validateMongoId,
	phoneNumberValidator,
};
