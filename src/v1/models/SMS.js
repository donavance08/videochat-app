const mongoose = require('mongoose');

const smsSchema = new mongoose.Schema({
	sender: {
		type: Number,
		required: true,
		index: true,
	},
	receiver: {
		type: Number,
		required: true,
		index: true,
	},
	message: {
		type: String,
		min: 1,
		max: 160,
	},
	dateCreated: {
		type: Date,
		default: new Date(),
	},
});

module.exports = mongoose.model('SMS', smsSchema);
