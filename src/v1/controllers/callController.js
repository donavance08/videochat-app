const callServices = require('../services/callServices');

const incomingCall = (req, res) => {
	const {
		body,
		body: { From, AccountSid },
	} = req;

	const isPhoneNumber = /^\+[0-9]*$/.test(From);
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

const answerCall = (req, res) => {
	callServices.answerCall(req, res);
};

module.exports = {
	incomingCall,
	getCallToken,
	answerCall,
};
