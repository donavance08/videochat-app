const UserDB = require('./UserDB');
const User = require('../models/User');
const ObjectId = require('mongoose').Types.ObjectId;
const Message = require('../models/Message');

const addMessage = async (newMessage) => {
	try {
		const savedMessage = await newMessage.save();

		return savedMessage;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

const getConversationHistory = async (sender, receiver) => {
	try {
		const messages = await Message.find({
			$or: [
				{
					$and: [
						{ sender: sender },
						{
							receiver: receiver,
						},
					],
				},
				{
					$and: [
						{ sender: receiver },
						{
							receiver: sender,
						},
					],
				},
			],
		}).sort({ dateCreated: 1 });
		return messages;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

module.exports = {
	addMessage,
	getConversationHistory,
};
