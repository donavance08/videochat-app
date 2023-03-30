const callServices = require('../services/callServices');
const auth = require('../../../auth');
const { validationResult } = require('express-validator');
const {
	checkValidationResult,
	validatePhoneNumber,
	extractPhoneNumber,
} = require('../utils/utilFunctions');

const incomingCall = (req, res) => {
	const {
		body,
		body: { From, AccountSid },
	} = req;

	const isPhoneNumber = /^\+(?:[0-9] ?){6,14}[0-9]$/.test(From);
	const from = isPhoneNumber ? From.slice(1, From.length) : 'Anonymous';

	callServices
		.incomingCall(body, from, AccountSid)

		.then((result) => {
			res.type(result.type).send(result.data);
		})

		.catch((err) => {
			res.type('text/xml').send();
		});
};

const getCallToken = (req, res) => {
	callServices.getCallToken(req, res);
};

const callResponse = (req, res) => {
	callServices.callResponse(req.body.CallSid, req.params.response);

	res.send(true);
};

const outboundCall = (req, res) => {
	if (validatePhoneNumber(req, res)) {
		return;
	}

	const phoneNumber = extractPhoneNumber(req);

	const userId = auth.decode(req.headers.authorization).id;
	callServices
		.outboundCall(phoneNumber, userId)

		.then((result) => {
			if (result) {
				res
					.status(200)
					.send({ status: 'OK', message: 'Calling', data: result });
				return;
			}

			res
				.status(400)
				.send({ status: 'OK', message: 'Call Failed', data: result });
		})

		.catch((err) => {
			console.log(err);
			res.status(err?.status || 500).send({
				status: 'FAILED',
				message: err?.message || 'Internal Server Error',
				data: null,
			});
		});
};

const callUpdate = (req, res) => {
	callServices.callUpdate(req.body);
};

module.exports = {
	incomingCall,
	getCallToken,
	callResponse,
	outboundCall,
	callUpdate,
};
