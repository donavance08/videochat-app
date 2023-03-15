const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');

router.post('/', smsController.addSMS);

module.exports = router;
