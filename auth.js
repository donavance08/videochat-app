const jwt = require('jsonwebtoken');
const secretPhrase = 'waterCoolerchatapp';
const { sendResponse } = require('./src/v1/utils/utilFunctions');

/**
 * Create access token for successful user login
 * @param {Object} userData
 * @returns {String} token
 * */
module.exports.createAccessToken = (userData) => {
	console.log(userData);
	return jwt.sign(userData, secretPhrase, {});
};

/**
 * verify if token provided came from this API
 * @param {Object} req - requrest object
 * @param {Object} res - response object
 * @param {Function} next
 */
module.exports.verify = (req, res, next) => {
	let token = req.headers.authorization;

	if (typeof token !== 'undefined') {
		token = token.slice(7, token.length);

		return jwt.verify(token, secretPhrase, (error, data) => {
			if (error) {
				sendResponse(res, 400, {
					status: 'FAILED',
					message: 'Invalid Token',
					data: req.headers.authorization,
				});

				return;
			}

			next();
		});
	}

	sendResponse(res, 400, {
		status: 'FAILED',
		message: 'Invalid Token',
		data: req.headers.authorization,
	});
};

/** Decoding a token to retrieve user information
 * @param {String} token - containing user information
 * @returns {Object} decoded user information || null
 */
module.exports.decode = (token) => {
	if (typeof token !== 'undefined') {
		// Retrieves only the token and removes the "Bearer " prefix
		token = token.slice(7, token.length);

		return jwt.verify(token, secretPhrase, (error, data) => {
			if (error) {
				return null;
			} else {
				return jwt.decode(token, { complete: true }).payload;
			}
		});
	}

	return null;
};
