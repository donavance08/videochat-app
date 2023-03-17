const mongoose = require('mongoose');

const smsSchema = new mongoose.Schema({
	senderPhone: {
		type: Number,
		required: true,
		index: true,
	},
	receiverPhone: {
		type: Number,
		required: true,
		index: true,
	},
	sender: { type: mongoose.ObjectId, index: true },
	receiver: { type: mongoose.ObjectId, index: true },
	message: {
		type: String,
		min: 1,
		max: 160,
	},
	dateCreated: {
		type: Date,
		default: new Date(),
	},
	header: { type: String, required: true, default: 'sms' },
});

module.exports = mongoose.model('SMS', smsSchema);
