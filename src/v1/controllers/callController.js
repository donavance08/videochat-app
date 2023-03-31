const callServices = require('../services/callServices');
const auth = require('../../../auth');
const io = require('../../../io');
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

const outboundCall = async (req, res) => {
	const userId = auth.decode(req.body.token).id;

	if (validatePhoneNumber(req.body.To, res)) {
		io.emit('invalid phoneNumber', { userId });
		return;
	}

	const phoneNumber = extractPhoneNumber(req);

	callServices.outboundCall(phoneNumber, userId).then((result) => {
		res.type(result.type).send(result.data);
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
