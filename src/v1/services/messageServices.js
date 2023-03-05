const messageDB = require('../database/messageDB');
const Message = require('../models/Message');
const io = require('../../../io');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.addMessage = async (fromId, receiverId, message) => {
	const newMessage = new Message({
		message: message,
		sender: fromId,
		receiver: receiverId,
		dateCreated: new Date(),
	});

	try {
		const savedMessage = await messageDB.addMessage(newMessage);
		io.fireReceiveMsgEvent(savedMessage);
		return savedMessage;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

module.exports.getConversationHistory = async (sender, receiver) => {
	sender = new ObjectId(sender);
	receiver = new ObjectId(receiver);

	try {
		const messages = await messageDB.getConversationHistory(sender, receiver);
		return messages;
	} catch (err) {
		console.log(err);
		throw err;
	}
};
