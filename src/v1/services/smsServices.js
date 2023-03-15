const smsDB = require('../database/smsDB');
const UserDB = require('../database/UserDB');
const SMS = require('../models/SMS');

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

module.exports = {
	addSMS,
};
