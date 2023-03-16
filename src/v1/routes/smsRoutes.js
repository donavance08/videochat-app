const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');

router.post('/', smsController.addSMS);
router.get('/:receiver', smsController.getSMSHistory);

module.exports = router;
