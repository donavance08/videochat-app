const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	nickname: {
		type: String,
		required: true,
		index: true,
		min: 3,
		max: 15,
	},
	username: {
		type: String,
		required: true,
		index: { unique: true },
		min: 12,
	},
	password: {
		type: String,
		min: 8,
		max: 50,
		required: true,
	},
	contactsList: {
		type: Array,
		default: [],
	},
	phoneNumber: {
		type: String,
		min: 7,
		max: 15,
		index: true,
		required: true,
	},
	dateCreated: {
		type: Date,
		default: new Date(),
		required: true,
	},
});

module.exports = mongoose.model('User', userSchema);
