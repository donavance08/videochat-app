const UserDB = require('./UserDB');
const User = require('../models/User');
const ObjectId = require('mongoose').Types.ObjectId;
const Message = require('../models/Message');

// To link the new message _id to the sender
async function linkMessageToSender(newMessage) {
	const { sender, receiver, _id: messageId } = newMessage;

	try {
		const user = await UserDB.findExistingUserById(sender);

		let filteredReceiver = user.contactsList.filter((contact) => {
			if (contact._id.toString() === receiver.toString()) {
				return contact;
			}
		});

		if (filteredReceiver.length === 0) {
			throw {
				status: 401,
				message: 'Specified receiver is not saved as contact',
			};

			return;
		}

		const conversationHistory = filteredReceiver[0].conversationHistory;

		conversationHistory.push(messageId);

		return await user.save();
	} catch (err) {
		console.log(err);
		throw err;
	}
}

async function linkMessageToReceiver(newMessage) {}

module.exports.addMessage = async (newMessage) => {
	try {
		const savedMessage = await newMessage.save();

		return savedMessage;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

module.exports.getConversationHistory = async (sender, receiver) => {
	try {
		const messages = await Message.find({
			$or: [
				{ sender, receiver },
				{
					sender: receiver,
					reciever: sender,
				},
			],
		}).sort({ dateCreated: 1 });
		return messages;
	} catch (err) {
		console.log(err);
		throw err;
	}
};
