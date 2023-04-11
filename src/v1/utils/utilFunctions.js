const { response } = require('express');
const { validationResult } = require('express-validator');

const checkValidationResult = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		res.status(400).send({ status: 'FAILED', errors: errors.array() });
		return true;
	}
};

const validatePhoneNumber = (phoneNumber, res) => {
	const isPhoneNumber = /^\+?(?:[0-9] ?){6,14}[0-9]$/.test(phoneNumber);

	if (!isPhoneNumber) {
		res
			.status(400)
			.send({ status: 'FAILED', errors: [{ msg: 'Invalid Phone Number' }] });
		return true;
	}
};

const extractPhoneNumber = (req) => {
	const phoneNumber = req.body.To;

	return phoneNumber.at(0) === '+' ? phoneNumber : '+' + phoneNumber;
};

/**
 * Will create and send response
 * @param {Object} res - response object
 * @param {Object} responseDetails
 * @returns {undefined}
 */
const sendResponse = (res, status, responseDetails) => {
	if (responseDetails.error) {
		res.status(responseDetails.error.status || 500);
		res.send({
			status: 'FAILED',
			...({ message, data } = responseDetails.error),
		});

		return;
	}

	res.status(status || 200);
	res.send(responseDetails);
	
};
module.exports = {
	checkValidationResult,
	validatePhoneNumber,
	extractPhoneNumber,
	sendResponse,
};
