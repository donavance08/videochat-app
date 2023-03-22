const client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKEN);
const VoiceResponse = require('twilio').twiml.VoiceResponse;

const sendSMS = async (senderPhoneNumber, receiverPhoneNumber, message) => {
	return await client.messages
		.create({
			body: message,
			to: `+${receiverPhoneNumber}`,
			from: `+${senderPhoneNumber}`,
		})
		.then((result) => {
			console.log('goest rhough result');
			return result;
		})
		.catch((err) => {
			throw err;
		});
};

const callNumber = async (from, to) => {
	return await client.calls
		.create({
			url: 'http://demo.twilio.com/docs/voice.xml',
			to: `+${to}`,
			from: `+${from}`,
		})
		.then((call) => console.log(call.sid));
};

module.exports = {
	sendSMS,
	callNumber,
};
