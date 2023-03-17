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

const getSMSHistory = async (senderPhoneNumber, receiverPhoneNumber) => {
	try {
		const messages = await SMS.find({
			$and: [
				{ senderPhone: { $in: [senderPhoneNumber, receiverPhoneNumber] } },
				{
					receiverPhone: { $in: [senderPhoneNumber, receiverPhoneNumber] },
				},
			],
		}).sort({ dateCreated: 1 });

		return messages || [];
	} catch (err) {
		throw err;
	}
};

module.exports = {
	addSMS,
	getSMSHistory,
};
