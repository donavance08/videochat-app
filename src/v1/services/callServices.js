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

	return await client.outboundCall(to, from);
};

const callUpdate = async (callData) => {
	const user = await UserDB.findUserByAccountSid(callData.AccountSid);

	if (!user) {
		return;
	}

	switch (callData.CallStatus) {
		case 'busy':
			io.emit('call declined', { status: 'Call Declined', userId: user._id });
			break;
		case 'no-answer':
			io.emit('call declined', { status: 'No Answer', userId: user._id });
			break;
		case 'failed':
			io.emit('call declined', { status: 'Call Failed', userId: user._id });
			break;
		case 'completed':
			io.emit('call status', { status: 'Call Completed', userId: user._id });
			break;
		case 'ringing':
			io.emit('call status', { status: 'Ringing', userId: user._id });
			break;
		case 'answered':
			io.emit('call status', { status: 'Call in progress', userId: user._id });
			break;
		case 'in-progress':
			io.emit('call status', { status: 'Call in progress', userId: user._id });
			break;
		default:
			return;
	}
};

module.exports = {
	incomingCall,
	getCallToken,
	callResponse,
	outboundCall,
	callUpdate,
};
