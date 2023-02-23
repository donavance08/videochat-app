const UserDB = require('../database/UserDB');
const User = require('../models/User');

module.exports.loginUser = (username, password) => {
	return UserDB.loginUser(username, password)
		.then((result) => {
			return result;
		})
		.catch((err) => {
			throw err;
		});
};

module.exports.registerNewUser = (data) => {
	const newUserData = new User({
		...data,
		contacts: [],
		dateCreated: new Date(),
	});

	return UserDB.registerNewUser(newUserData);
};
