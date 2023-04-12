const express = require('express');
const router = express.Router();
const videoCallController = require('../controllers/videoCallController');
const auth = require('../../../auth');

module.exports = router;

router.post(
	'/turnCredential',
	auth.verify,
	videoCallController.getTurnCredentials
);
