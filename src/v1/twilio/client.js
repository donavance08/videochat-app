let client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKEN);
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

const response = (voiceResponse) => {
	return {
		type: 'text/xml',
		data: voiceResponse.toString(),
	};
};

const incomingCall = (data, from, userId) => {
	const voiceResponse = new VoiceResponse();

	const isOnline = io.emit('incoming phone call', { data, from, userId });

	if (isOnline) {
		voiceResponse.play({ loop: 100 }, `${process.env.REACT_APP_API_URL}/sound`);
		return response(voiceResponse);
	}

	voiceResponse.reject();
	return response(voiceResponse);
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

		res
			.type('appication/json')
			.status(200)
			.send({ status: 'OK', message: 'Token generated', token });
	} catch (err) {
		res.status(err?.status || 500).send({
			status: 'FAILED',
			message: err?.message || 'Internal Server Error',
			data: null,
		});
	}
};

const answerCall = (req, res) => {
	client
		.calls(req.body.id)

		.update({
			twiml: '<Response><Dial><Client>watercooler</Client></Dial></Response>',
		})

		.then((call) => console.log(call))

		.catch((err) => {
			console.log(err);
		});
};

const declineCall = (req, res) => {
	client.calls(req.body.id).reject;
};

module.exports = {
	sendSMS,
	getCallToken,
	incomingCall,
	answerCall,
};
