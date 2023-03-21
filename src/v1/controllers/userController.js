const userServices = require('../services/userServices');
const { validationResult } = require('express-validator');
const auth = require('../../../auth');

const checkValidationResult = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		res.status(400).send({ errors: errors.array() });
	}
};
const loginUser = (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(401).send({
			status: 'FAILED',
			message: 'Please make sure username or password field is not empty',
		});
	}
	userServices
		.loginUser(username.toLowerCase(), password)
		.then((result) => {
			if (res) {
				res.status(200).send({
					status: 'OK',
					message: 'Login successful',
					data: result,
				});
			}
		})
		.catch((err) => {
			res.status(err?.status || 500).send({
				status: 'FAILED',
				message: err?.message || 'Internal Server Error',
			});
		});
};

const registerNewUser = (req, res) => {
	checkValidationResult(req, res);

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
				res.status(201).send({
					status: 'OK',
					message: 'Registration successful',
					data: result,
				});
			}
		})
		.catch((err) => {
			res.status(err?.status || 500).send({
				status: 'FAILED',
				message: err?.message || 'Internal Server Error',
			});
		});
};

const getUserContacts = (req, res) => {
	const id = auth.decode(req.headers.authorization).id;

	userServices
		.getUserContacts(id)
		.then((result) => {
			if (result) {
				res.status(201).send({
					status: 'OK',
					message: 'Contacts found',
					data: result,
				});
			}
		})
		.catch((err) => {
			res.status(err?.status || 500).send({
				status: 'FAILED',
				message: err?.message || 'Internal Server Error',
			});
		});
};

const findAllUsersByName = (req, res) => {
	userServices
		.findAllUsersByName(req.params.name)
		.then((result) => {
			res
				.status(200)
				.send({ status: 'OK', message: 'Search result', data: result });
		})
		.catch((err) => {
			res.status(err?.status || 500).send({
				status: 'FAILED',
				message: err?.message || 'Internal Server Error',
				data: [],
			});
		});
};

const updateUser = (req, res) => {
	checkValidationResult(req, res);

	const id = auth.decode(req.headers.authorization).id;

	userServices
		.updateUser(req.params.userId, id)
		.then((result) => {
			res
				.status(200)
				.send({ status: 'OK', message: 'Contacts Updated', data: result });
		})
		.catch((err) => {
			res.status(err?.status || 500).send({
				status: 'FAILED',
				message: err?.message || 'Internal Server Error',
				data: [],
			});
		});
};

module.exports = {
	loginUser,
	registerNewUser,
	getUserContacts,
	findAllUsersByName,
	updateUser,
};
