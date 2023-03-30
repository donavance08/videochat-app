const { validationResult } = require('express-validator');

const checkValidationResult = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		res.status(400).send({ status: 'FAILED', errors: errors.array() });
		return true;
	}
};

const validatePhoneNumber = (req, res) => {
	const phoneNumberParam = req.params.phoneNumber;
	const isPhoneNumber = /^\+?(?:[0-9] ?){6,14}[0-9]$/.test(phoneNumberParam);

	if (!isPhoneNumber) {
		res
			.status(400)
			.send({ status: 'FAILED', errors: [{ msg: 'Invalid Phone Number' }] });

		return true;
	}
};

const extractPhoneNumber = (req) => {
	const phoneNumber = req.params.phoneNumber;

	return phoneNumber.at(0) === '+' ? phoneNumber : '+' + phoneNumber;
};

module.exports = {
	checkValidationResult,
	validatePhoneNumber,
	extractPhoneNumber,
};
