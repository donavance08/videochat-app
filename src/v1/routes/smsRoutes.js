const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');

router.post('/:receiverId', smsController.addSMS);
router.get('/:receiverId', smsController.getSMSHistory);

module.exports = router;
