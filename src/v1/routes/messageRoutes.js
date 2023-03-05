const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const auth = require('../../../auth');
const messageController = require('../controllers/messageController');

router.post(
	'/',
	(req, res, next) => {
		console.log(req.params.receiver);
		next();
	},
	auth.verify,
	messageController.addMessage
);

router.get('/:receiver', auth.verify, messageController.getConversationHistory);

module.exports = router;
