const UserDB = require('../database/UserDB');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const auth = require('../../../auth.js');
const customError = require('../utils/customError');

const loginUser = (username, password) => {
	return UserDB.loginUser(username)
		.then((result) => {
			if (bcrypt.compareSync(password, result.password)) {
				const token = auth.createAccessToken({
					nickname: result.nickname,
					username: result.username,
					phoneNumber: result.phoneNumber,
					id: result._id,
				});

				return { id: result._id, nickname: result.nickname, token };
			}

			customError.throwCustomError(403, 'Invalid username or password');
		})
		.catch((err) => {
			throw err;
		});
};

const registerNewUser = async (data) => {
	const { password } = data;

	const userDataFromClient = new User({
		...data,
		password: bcrypt.hashSync(password, 10),
		contacts: [],
		dateCreated: new Date(),
	});

	UserDB.registerNewUser(userDataFromClient)
		.then((result) => {
			const token = auth.createAccessToken({
				nickname: result.nickname,
				username: result.username,
				phoneNumber: result.phoneNumber,
				id: result._id,
			});

			return {
				nickname: result.nickname,
				token,
			};
		})
		.catch((err) => {
			console.log(err);
			throw err;
		});
};

const getUserContacts = (userId) => {
	return UserDB.getUserContacts(userId)
		.then((result) => {
			if (result) {
				return result.contactsList;
			}
		})
		.catch((err) => {
			throw err;
		});
};

const findAllUsersByName = (name) => {
	return UserDB.findAllUsersByName(name)
		.then((result) => {
			return result;
		})
		.catch((err) => {
			throw err;
		});
};

module.exports = {
	loginUser,
	registerNewUser,
	getUserContacts,
	findAllUsersByName,
};
