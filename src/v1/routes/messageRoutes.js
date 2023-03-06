const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const auth = require('../../../auth');
const messageController = require('../controllers/messageController');
const uploadController = require('../controllers/uploadController');

router.post('/', auth.verify, messageController.addMessage);
router.get('/:receiver', auth.verify, messageController.getConversationHistory);
router.post('/upload', uploadController.uploadFiles);
// router.get('files', uploadController.getListFiles);
// router.get('/files/:name', uploadController.download);

module.exports = router;
