const router = require('express').Router();
const callController = require('../controllers/callController');
const auth = require('../../../auth');
const { header } = require('express-validator');
const { phoneNumberValidator } = require('../utils/validations');

router.post('/', callController.incomingCall);
router.get('/token', callController.getCallToken);
router.post('/callUpdate', callController.callUpdate);
router.post('/outboundCall', callController.outboundCall);
router.post('/callResponse/:response', callController.callResponse);
router.post('/:phoneNumber', auth.verify, callController.outboundCall);

module.exports = router;
