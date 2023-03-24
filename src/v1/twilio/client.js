const client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKEN);
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const ClientCapability = require('twilio').jwt.ClientCapability;
const io = require('../../../io');

const sendSMS = async (senderPhoneNumber, receiverPhoneNumber, message) => {
	return await client.messages

		.create({
			body: message,
			to: `+${receiverPhoneNumber}`,
			from: `+${senderPhoneNumber}`,
		})

		.then((result) => {
			return result;
		})

		.catch((err) => {
			throw err;
		});
};

const incomingCall = (req, res, userId) => {
	const voiceResponse = new VoiceResponse();
	io.emit('incoming call', { data: req.body, userId });
	voiceResponse.say('Please wait');
	res.set({ 'Content-type': 'text/xml' }).send(voiceResponse.toString());
};

const getCallToken = (req, res) => {
	try {
		const clientCapability = new ClientCapability({
			accountSid: process.env.ACCOUNTSID,
			authToken: process.env.AUTHTOKEN,
		});
		clientCapability.addScope(
			new ClientCapability.IncomingClientScope('watercooler')
		);
		const token = clientCapability.toJwt();

		res.set('Content-type', 'application/json');
		res.status(200);
		res.send({ status: 'OK', message: 'Token generated', token });
	} catch (err) {
		res.status(err?.status || 500).send({
			status: 'FAILED',
			message: err?.message || 'Internal Server Error',
			data: null,
		});
	}
};

const answerCall = () => {};

module.exports = {
	sendSMS,
	getCallToken,
	incomingCall,
};
