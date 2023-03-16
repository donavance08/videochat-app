const SMS = require('../models/SMS');

const addSMS = async (newSMS) => {
	try {
		const savedMessage = await newSMS.save();

		return savedMessage;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

const getSMSHistory = async (sender, receiver) => {
	try {
		const messages = await SMS.find({
			$or: [
				{ sender, receiver },
				{
					sender: receiver,
					receiver: sender,
				},
			],
		}).sort({ dateCreated: 1 });

		return messages || [];
	} catch (err) {
		console.log(err);
		throw err;
	}
};

module.exports = {
	addSMS,
	getSMSHistory,
};
