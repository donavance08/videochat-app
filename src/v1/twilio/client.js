let client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKEN);
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const ClientCapability = require('twilio').jwt.ClientCapability;
const io = require('../../../io');
const customError = require('../utils/customError');

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

// <Client statusCallback=\'${process.env.REACT_APP_API_URL}/api/call/callback'>

const answerCall = (callSid) => {
	client
		.calls(callSid)
		.update({
			twiml: `<Response>
					<Dial>
						<Client>

						<Identity>watercooler</Identity>
						</Client>
					</Dial>
				</Response>`,
		})

		.catch((err) => {
			console.log(err.message);
			throw err;
		});
};

const declineCall = (callSid) => {
	client
		.calls(callSid)

		.update({ twiml: '<Response><Reject></Reject></Response>' })

		.catch((err) => console.log(err.message));
};

const endCall = async (callSid) => {
	client
		.calls(callSid)

		.update({ twiml: '<Response><Hangup/></Response>' })

		.catch((err) => console.log(err.message));
};
module.exports = {
	sendSMS,
	getCallToken,
	incomingCall,
	answerCall,
	declineCall,
	endCall,
};
