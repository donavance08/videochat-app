const smsServices = require('../services/smsServices');
const auth = require('../../../auth');

const sendSMS = async (req, res) => {
	//extract the data
	const {
		params: { receiverId },
		body: { message },
	} = req;
	const sender = auth.decode(req.headers.authorization);

	// verify length of sms,
	try {
		const result = await smsServices.sendSMS({
			senderPhoneNumber: sender.phoneNumber,
			senderId: sender.id,
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
				data: [],
			});
		});
};

const receiveSMS = (req, res) => {
	const from = req.body.From.slice(1, req.body.From.length);
	const to = req.body.To.slice(1, req.body.To.length);

	smsServices.receiveSMS(from, to, req.body).then((result) => {
		res.type('text/xml').send(result?.twiml || '');
	});
};

module.exports = {
	sendSMS,
	getSMSHistory,
	receiveSMS,
	receiveSMS,
};
