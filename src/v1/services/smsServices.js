const smsDB = require('../database/smsDB');
const UserDB = require('../database/UserDB');
const SMS = require('../models/SMS');
const ObjectId = require('mongoose').Types.ObjectId;

const addSMS = async ({ sender, receiver, message }) => {
	const newSMS = new SMS({
		sender,
		receiver,
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

const getSMSHistory = async (sender, receiver) => {
	// ADD a cleaner or sanitizer for reciever id?
	// console.log(receiver);
	// receiver = new ObjectId(receiver);
	// console.log(receiver);
	let receiverData;
	try {
		receiverData = await UserDB.findExistingUserById(receiver);
		// console.log('reciever found', receiverData.phoneNumber);
	} catch (err) {
		console.log(err);
		throw err;
	}

	return smsDB
		.getSMSHistory(sender, receiverData.phoneNumber)
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
