const router = require('express').Router();
const callController = require('../controllers/callController');

router.post('/', callController.incomingCall);
router.get('/token', callController.getCallToken);
router.post('/answer', callController.answerCall);

module.exports = router;
