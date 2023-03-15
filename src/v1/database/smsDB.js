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

module.exports = {
	addSMS,
};
