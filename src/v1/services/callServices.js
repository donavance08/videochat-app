const UserDB = require('../database/UserDB');
const client = require('../twilio/client');

const incomingCall = (req, res, phoneNumber) => {
	// call services will find user id using the number
	// use client to generate response and emit to user if user is online together with io
	const userId = '63f8ec0ef8c8ef29f63ae169'; //nick
	client.incomingCall(req, res, userId);
};

const getCallToken = (req, res) => {
	client.getCallToken(req, res);
};

module.exports = {
	incomingCall,
	getCallToken,
};
