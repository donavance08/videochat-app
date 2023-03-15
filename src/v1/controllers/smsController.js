const smsServices = require('../services/smsServices');
const auth = require('../../../auth');

const addSMS = async (req, res) => {
	//extract the data
	const { receiver, message } = req.body;
	const sender = auth.decode(req.headers.authorization).phoneNumber;

	// verify length of sms,
	try {
		const result = await smsServices.addSMS({ sender, receiver, message });

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

module.exports = {
	addSMS,
};
