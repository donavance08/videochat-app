const smsDB = require('../database/smsDB');
const UserDB = require('../database/UserDB');
const SMS = require('../models/SMS');
const io = require('../../../io');
const customError = require('../utils/customError');
const twilioClient = require('../twilio/client');
const ObjectId = require('mongoose').Types.ObjectId;

const genericObjectId = new ObjectId('64245815a08a6a4680183e44');

const getReceiverData = async (receiverId) => {
	try {
		const receiverData = await UserDB.findExistingUserById(receiverId);
		return receiverData;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

const sendSMS = async ({
	senderPhoneNumber,
	senderId,
	receiverId,
	message,
}) => {
	try {
		const receiverData = await getReceiverData(receiverId);

		if (!receiverData) {
			customError.throwCustomError(404, 'Receiver not found');
		}

		const sentSMS = await twilioClient.sendSMS(
			senderPhoneNumber,
			receiverData.phoneNumber,
			message
		);

		if (!sentSMS) {
			return;
		}

		const newSMSDocument = new SMS({
			sender: senderId,
			senderPhone: senderPhoneNumber,
			receiver: receiverId,
			receiverPhone: receiverData.phoneNumber,
			message: message,
			dateCreated: sentSMS.dateCreated,
			header: 'sms',
		});

		const savedMessage = await smsDB.sendSMS(newSMSDocument);

		io.fireReceiveMsgEvent({
			sender: senderId,
			receiver: receiverId,
			savedMessage,
		});

		return savedMessage;
	} catch (err) {
		throw err;
	}
};

const getSMSHistory = async (senderPhoneNumber, receiverId) => {
	// ADD a cleaner or sanitizer for reciever id?
	const receiverData = await getReceiverData(receiverId);

	if (!receiverData) {
		return [];
	}

	return smsDB
		.getSMSHistory(senderPhoneNumber, receiverData.phoneNumber)
		.then((result) => {
			return result;
		})
		.catch((err) => {
			console.log(err);
			throw err;
		});
};

const receiveSMS = async (from, to, body) => {
	try {
		const sender = await UserDB.findExistingPhoneNumber(from);
		const receiver = await UserDB.findExistingPhoneNumber(to);

		if (!sender || !receiver) {
			return {
				twiml: `<Response>
				<Message>
					<Body>We're sorry, the recipient does not accept messages if you are not a Contact. Please register and add recipient as Contact.</Body>
					<Redirect>${process.env.REACT_APP_API_URL}</Redirect>
					</Message>
			</Response>`,
			};
		}

		const newSMSDocument = new SMS({
			sender: sender?._id || genericObjectId,
			senderPhone: from,
			receiver: receiver?._id || genericObjectId,
			receiverPhone: to,
			message: body.Body,
			dateCreated: new Date(),
			header: 'sms',
		});

		const savedMessage = await smsDB.sendSMS(newSMSDocument);
		console.log(savedMessage);

		io.emit('receive msg', {
			data: savedMessage,
			from: savedMessage.sender,
			userId: savedMessage.receiver,
		});
	} catch (err) {
		console.log(err.message);
		throw err;
	}
};

module.exports = {
	sendSMS,
	getSMSHistory,
	receiveSMS,
};
