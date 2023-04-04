const { body, header, param } = require('express-validator');
const UserDB = require('../database/UserDB');

const registrationValidations = [
	body('nickname')
		.trim()
		.isLength({ min: 3, max: 15 })
		.escape()
		.withMessage('Nickname should be 3-15 characters long'),

	body('username')
		.trim()
		.isEmail()
		.normalizeEmail()
		.isLength({ min: 12 })
		.withMessage('Email should be a minimun of 12 characters long'),

	body('username')
		.trim()
		.normalizeEmail()
		.custom(async (value) => {
			const result = await UserDB.findExistingUserByName(value);
			if (result) {
				return Promise.reject('Username already exists');
			}
			return await Promise.resolve(true);
		}),

	body('password')
		.trim()
		.isLength({ min: 8, max: 50 })
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
		.withMessage('Password should be 8-50 characters long'),

	body('phoneNumber')
		.trim()
		.isLength({ min: 7, max: 15 })
		.withMessage('Phone number must be min of 7 and max of 15 numbers'),

	body('phoneNumber')
		.trim()
		.customSanitizer((phoneNumber) => {
			if (phoneNumber.at(0) === '+') {
				return phoneNumber.slice(1, phoneNumber.length);
			}

			return phoneNumber;
		})
		.isNumeric()
		.withMessage('Invalid phoneNumber'),
	body('phoneNumber').custom(async (value) => {
		const result = await UserDB.findExistingPhoneNumber(value);
		if (result) {
			return Promise.reject('Phone number already in use');
		}
		return await Promise.resolve(true);
	}),
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
