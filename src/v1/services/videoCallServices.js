const client = require('../twilio/client');

const getTurnCredentials = () => {
	return client
		.getTurnCredentials()
		.then((token) => token)
		.catch((error) => {
			throw error;
		});
};

module.exports = { getTurnCredentials };
