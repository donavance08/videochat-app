const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
	message: {
		type: String,
		minLength: 1,
		maxLength: 500,
	},
	filename: { type: String, index: 1 },
	sender: { type: mongoose.ObjectId, index: true },
	receiver: { type: mongoose.ObjectId, index: true },
	dateCreated: { type: Date, default: new Date() },
	header: { type: String, required: true, default: 'chat' },
});

module.exports = mongoose.model('Message', messageSchema);
