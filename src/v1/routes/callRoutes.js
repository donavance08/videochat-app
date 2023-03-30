const router = require('express').Router();
const callController = require('../controllers/callController');
const auth = require('../../../auth');
const { header } = require('express-validator');

const phoneNumberValidator = [
	header('phoneNumber')
		.trim()
		.isMobilePhone()
		.withMessage('Invalid Phone Number! Number must start with a "+" sign '),
];

router.post('/', callController.incomingCall);
router.get('/token', callController.getCallToken);
router.post('/callResponse/:response', callController.callResponse);
router.post('/:phoneNumber', auth.verify, callController.outboundCall);

module.exports = router;
