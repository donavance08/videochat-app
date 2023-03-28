const UserDB = require('../database/UserDB');
const client = require('../twilio/client');
const customError = require('../utils/customError');
const io = require('../../../io');

const incomingCall = async (data, numberFrom, accountSid) => {
	try {
		const toUserId = await UserDB.findUserByAccountSid(accountSid);

		if (!toUserId) {
			customError.throwCustomError(404, 'User not found');
		}

		// Determine if the caller belongs to the logged in users contact and show the name
		const contacts = await UserDB.getUserContacts(toUserId);

		let callerName =
			contacts.filter((contact) => {
				return contact.phoneNumber === numberFrom;
			})[0]?.nickname || numberFrom;

		return client.incomingCall(data, callerName, toUserId);
	} catch (err) {
		console.log(err.message);
		return null;
	}
};

const getCallToken = (req, res) => {
	client.getCallToken(req, res);
};

const callResponse = (callSid, response) => {
	switch (response) {
		case 'accept':
			client.answerCall(callSid);
			break;

		case 'reject':
			client.declineCall(callSid);
			break;

		case 'drop':
			client.endCall(callSid);
			break;

		default:
			return;
	}
};

const outboundCall = async (to, userId) => {
	const user = await UserDB.findExistingUserById(userId);

	if (!user) {
		customError.throwCustomError(404, 'User not found');
	}

	const from = '+' + user.phoneNumber;

	client.outboundCall(to, from);
};

module.exports = {
	incomingCall,
	getCallToken,
	callResponse,
	outboundCall,
};
