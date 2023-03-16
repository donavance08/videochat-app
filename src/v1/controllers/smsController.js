const smsServices = require('../services/smsServices');
const auth = require('../../../auth');

const addSMS = async (req, res) => {
	//extract the data
	const {
		params: { receiverId },
		body: { message },
	} = req;
	const senderPhoneNumber = auth.decode(req.headers.authorization).phoneNumber;

	// verify length of sms,
	try {
		const result = await smsServices.addSMS({
			senderPhoneNumber,
			receiverId,
			message,
		});

		res.status(200).send({
			status: 'OK',
			message: 'message sent',
			data: result,
		});
	} catch (err) {
		res.status(err?.status || 500).send({
			status: 'FAILED',
			message: err?.message || 'Internal Server Error',
		});
	}
};

const getSMSHistory = (req, res) => {
	// extract phone number of sender and the id of receiver from req.body
	const senderPhoneNumber = auth.decode(req.headers.authorization).phoneNumber;

	// call services to download sms history
	smsServices
		.getSMSHistory(senderPhoneNumber, req.params.receiverId)
		.then((result) => {
			res.status(200).send({
				status: 'OK',
				message: 'SMS successfully retrieved',
				data: result,
			});
		})
		.catch((err) => {
			res.status(err?.status || 500).send({
				status: 'FAILED',
				message: err?.message || 'Internal server error',
			});
		});
};

module.exports = {
	addSMS,
	getSMSHistory,
};
