const { validationResult } = require('express-validator');
const auth = require('../../../auth');
const messageServices = require('../services/messageServices');

module.exports.addMessage = (req, res) => {
	// const errors = validationResult(req);
	const {
		body: { message },
		params: { receiver },
	} = req;

	const filename = res.file ? res.file.filename : undefined;

	const sender = auth.decode(req.headers.authorization).id;

	// if (req.file) {
	// 	const { file } = req
	// }

	// if (!errors.isEmpty()) {
	// 	return res.status(400).send({ errors: errors.array() });
	// }

	messageServices
		.addMessage({ sender, receiver, message, filename })
		.then((result) => {
			res
				.status(200)
				.send({ status: 'OK', message: 'New message added', data: result });
		})
		.catch((err) => {
			res.status(err?.status || 500).send({
				status: 'FAILED',
				message: err?.message || 'Internal Server Error',
			});
		});
};

module.exports.getConversationHistory = (req, res) => {
	const sender = auth.decode(req.headers.authorization).id;

	messageServices
		.getConversationHistory(sender, req.params.receiver)
		.then((result) => {
			res.status(200).send({
				status: 'OK',
				message: 'Retrieved conversation successfully',
				data: result,
			});
		})
		.catch((err) => {
			res.status(err?.status || 500).send({
				status: 'FAILED',
				message: err?.message || 'Internal server error',
			});
		});
};
