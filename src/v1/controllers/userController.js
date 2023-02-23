const userServices = require('../services/userServices');
const { body } = require('express-validator');

const validations = [body('')];
module.exports.loginUser = (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(401).send({
			status: 'FAILED',
			message: 'Please make sure username or password field is not empty',
		});
	}
	userServices
		.loginUser(username, password)
		.then((result) => {
			res.status(200).send({ status: 'OK', message: 'Login successful' });
		})
		.catch((err) => {
			res
				.status(err?.status || 500)
				.send({ status: 'FAILED', message: err?.message || 'Internal Server Error' });
		});
};

module.exports.registerNewUser = (req, res) => {
	const { body } = req;

	const data = {
		nickname: body.nickname,
		username: body.username,
		password: body.password,
		phoneNumber: body.phoneNumber,
	};

	userServices
		.registerNewUser(data)
		.then((result) => {
			if (result) {
				res.status(201).send({ status: 'OK', message: 'Registration successful', data: result });
			}
		})
		.catch((err) => {
			res
				.status(err?.status || 500)
				.send({ status: 'FAILED', message: err?.message || 'Internal Server Error' });
		});
};
