const callServices = require('../services/callServices');

const incomingCall = (req, res) => {
	//extract data and phone number then forward to services
	console.log('hello', req.body);
	callServices.incomingCall(req, res);
};

const getCallToken = (req, res) => {
	console.log('calltoken');
	callServices.getCallToken(req, res);
};

module.exports = {
	incomingCall,
	getCallToken,
};
