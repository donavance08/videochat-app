const smsDB = require('../database/smsDB');
const UserDB = require('../database/UserDB');
const SMS = require('../models/SMS');
const io = require('../../../io');
const customError = require('../utils/customError');
const twilioClient = require('../twilio/client');

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
		return;
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

module.exports = {
	sendSMS,
	getSMSHistory,
};
