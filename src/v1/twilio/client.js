const client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKEN);

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

module.exports = {
	sendSMS,
};
