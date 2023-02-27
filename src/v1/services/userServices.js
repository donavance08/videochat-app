const UserDB = require('../database/UserDB');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const auth = require('../../../auth.js');

module.exports.loginUser = (username, password) => {
	return UserDB.loginUser(username)
		.then((result) => {
			if (bcrypt.compareSync(password, result.password)) {
				const token = auth.createAccessToken({
					nickname: result.nickname,
					username: result.username,
					phoneNumber: result.phoneNumber,
				});

				return token;
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

module.exports.registerNewUser = async (data) => {
	const { password } = data;
	const userDataFromClient = new User({
		...data,
		password: bcrypt.hashSync(password, 10),
		contacts: [],
		dateCreated: new Date(),
	});

	const newUserData = await UserDB.registerNewUser(userDataFromClient);

	const token = auth.createAccessToken({
		nickname: newUserData.nickname,
		username: newUserData.username,
		phoneNumber: newUserData.phoneNumber,
	});

	return token;
};
