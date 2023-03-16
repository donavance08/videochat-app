const smsDB = require('../database/smsDB');
const UserDB = require('../database/UserDB');
const SMS = require('../models/SMS');
const ObjectId = require('mongoose').Types.ObjectId;
const customError = require('../utils/customError');

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
	const receiverData = await getReceiverData(receiverId);

	if (!receiverData) {
		customError.throwCustomError(404, 'Receiver not found');
	}

	const newSMS = new SMS({
		sender: senderPhoneNumber,
		receiver: receiverData.phoneNumber,
		message,
		dateCreated: new Date(),
	});

	try {
		const savedMessage = await smsDB.addSMS(newSMS);

		return savedMessage;
	} catch (err) {
		throw err;
	}
};

const getSMSHistory = async (senderPhoneNumber, receiverId) => {
	// ADD a cleaner or sanitizer for reciever id?
	// console.log(receiver);
	// receiver = new ObjectId(receiver);
	// console.log(receiver);
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
