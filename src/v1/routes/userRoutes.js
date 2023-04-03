const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../../../auth');
const {
	registrationValidations,
	searchValidations,
	validateMongoId,
} = require('../utils/validations');

module.exports = router;

router.post('/login', userController.loginUser);

router.post('/', registrationValidations, userController.registerNewUser);

router.get('/contacts', auth.verify, userController.getUserContacts);

router.get(
	'/search/:name',
	auth.verify,
	searchValidations,
	userController.findAllUsersByName
);

router.put(
	'/contacts/:contactId',
	auth.verify,
	validateMongoId,
	userController.addContact
);
