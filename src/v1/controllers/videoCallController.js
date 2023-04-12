const videoCallServices = require('../services/videoCallServices');
const { sendResponse } = require('../utils/utilFunctions');

const getTurnCredentials = (req, res) => {
	videoCallServices
		.getTurnCredentials()
		.then((token) =>
			sendResponse(res, 200, {
				status: 200,
				message: 'Successfully retrieved TURN credentials',
				data: { token },
			})
		)
		.catch((error) => {
			sendResponse(res, error.status, { error });
		});
};

module.exports = {
	getTurnCredentials,
};
