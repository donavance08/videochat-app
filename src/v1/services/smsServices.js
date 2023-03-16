const smsDB = require('../database/smsDB');
const UserDB = require('../database/UserDB');
const SMS = require('../models/SMS');
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

const addSMS = async ({ senderPhoneNumber, receiverId, message }) => {
	console.log('senderPhoneNumber', senderPhoneNumber);
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
			sender: senderPhoneNumber,
			receiver: receiverData.phoneNumber,
			message: message,
			dateCreated: sentSMS.dateCreated,
		});

		const savedMessage = await smsDB.addSMS(newSMSDocument);

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

module.exports = {
	addSMS,
	getSMSHistory,
};
