const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');

router.post('/:receiverId', smsController.sendSMS);
router.get('/:receiverId', smsController.getSMSHistory);
router.post('/', smsController.receiveSMS);

module.exports = router;
