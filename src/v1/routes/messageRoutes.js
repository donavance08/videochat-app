const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const auth = require('../../../auth');
const messageController = require('../controllers/messageController');

router.post('/', auth.verify, messageController.addMessage);

router.get('/', auth.verify, messageController.getConversationHistory);

module.exports = router;
