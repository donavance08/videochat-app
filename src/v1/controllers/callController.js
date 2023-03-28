const callServices = require('../services/callServices');
const auth = require('../../../auth');

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

const callResponse = (req, res) => {
	callServices.callResponse(req.body.CallSid, req.params.response);

	res.send(true);
};

const outboundCall = (req, res) => {
	const userId = auth.decode(req.headers.authorization).id;
	callServices
		.outboundCall(req.params.phoneNumber, userId)

		.then((result) => {
			res.send();
		})

		.catch((err) => {
			res.status(err?.status || 500).send({
				status: 'FAILED',
				message: err?.message || 'Internal Server Error',
				data: null,
			});
		});
};

module.exports = {
	incomingCall,
	getCallToken,
	callResponse,
	outboundCall,
};
