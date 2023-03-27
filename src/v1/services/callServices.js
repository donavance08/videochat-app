const UserDB = require('../database/UserDB');
const client = require('../twilio/client');

const incomingCall = async (data, from, accountSid) => {
	const userId = await UserDB.findUserByAccountSid(accountSid);
	const fromName = await UserDB.findExistingPhoneNumber(from);
	if (userId) {
		return client.incomingCall(data, fromName, userId);
	}
};

const getCallToken = (req, res) => {
	client.getCallToken(req, res);
};

const routeCall = (req, res) => {
	client.routeCall(req, res);
};

const answerCall = (req, res) => {
	client.answerCall(req, res);
};

module.exports = {
	incomingCall,
	getCallToken,
	routeCall,
	answerCall,
};
