const router = require('express').Router();
const callController = require('../controllers/callController');
const auth = require('../../../auth');

router.post('/', callController.incomingCall);
router.get('/token', callController.getCallToken);
router.post('/callResponse/:response', callController.callResponse);
router.post('/:phoneNumber', auth.verify, callController.outboundCall);

module.exports = router;
