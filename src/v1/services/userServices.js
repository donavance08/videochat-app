const UserDB = require('../database/UserDB');
const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports.loginUser = (username, password) => {
	return UserDB.loginUser(username)
		.then((result) => {
			if (bcrypt.compareSync(password, result.password)) {
				// ADD ** token
				return result.username;
			}

			throw {
				status: 403,
				message: 'Invalid username or password',
			};
		})
		.catch((err) => {
			throw err;
		});
};

module.exports.registerNewUser = (data) => {
	const { password } = data;
	const newUserData = new User({
		...data,
		password: bcrypt.hashSync(password, 10),
		contacts: [],
		dateCreated: new Date(),
	});

	return UserDB.registerNewUser(newUserData);
};
