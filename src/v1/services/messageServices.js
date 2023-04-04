const messageDB = require('../database/messageDB');
const Message = require('../models/Message');
const io = require('../../../io');
const ObjectId = require('mongoose').Types.ObjectId;

const addMessage = async ({ sender, receiver, message, filename }) => {
	const newMessage = new Message({
		filename,
		message,
		sender,
		receiver,
		dateCreated: new Date(),
		header: 'chat',
	});

	try {
		const savedMessage = await messageDB.addMessage(newMessage);

		io.emit('receive msg', {
			data: savedMessage,
			from: savedMessage.sender,
			userId: savedMessage.receiver,
		});

		return savedMessage;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

const getConversationHistory = async (sender, receiver) => {
	sender = new ObjectId(sender);
	receiver = new ObjectId(receiver);

	try {
		return await messageDB.getConversationHistory(sender, receiver);
	} catch (err) {
		console.log(err);
		throw err;
	}
};

module.exports = {
	addMessage,
	getConversationHistory,
};
