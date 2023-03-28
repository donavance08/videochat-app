const { validationResult } = require('express-validator');

const checkValidationResult = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		res.status(400).send({ status: 'FAILED', errors: errors.array() });
		return true;
	}
};

module.exports = {
	checkValidationResult,
};
