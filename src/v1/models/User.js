const mongoose = require('mongoose');
const Message = require('./Message');

const userSchema = new mongoose.Schema({
	nickname: {
		type: String,
		required: true,
		index: true,
		min: 3,
		max: 60,
	},
	username: {
		type: String,
		required: true,
		index: { unique: true },
		min: 12,
		lowercase: true,
	},
	password: {
		type: String,
		min: 8,
		max: 50,
		required: true,
	},
	contactsList: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		default: [],
	},
	phoneNumber: {
		type: String,
		min: 7,
		max: 15,
		index: { unique: true },
		required: true,
	},
	twilioAccountSid: {
		type: String,
		index: { unique: true },
	},
	dateCreated: {
		type: Date,
		default: new Date(),
		required: true,
	},
});

userSchema.pre('save', function (next) {
	this.nickname =
		this.nickname.trim()[0].toUpperCase() +
		this.nickname.slice(1).toLowerCase();
	next();
});

module.exports = mongoose.model('User', userSchema);
