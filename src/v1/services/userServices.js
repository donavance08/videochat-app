const UserDB = require('../database/UserDB');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const auth = require('../../../auth.js');
const customError = require('../utils/customError');
const ObjectId = require('mongoose').Types.ObjectId;

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

/**
 * @param data - contains username, nickname, phoneNumber and password of the new registrant
 * Tasks are to check if username and phoneNumber is already in use, create a new model object from the data, and let UserDB save the data.
 */
const registerNewUser = async (data) => {
	const { password, username, phoneNumber } = data;

	const existingUser = await UserDB.findExistingUserByName(username);

	if (existingUser) {
		customError.throwCustomError(403, 'Username already exists');
	}

	const existingPhoneNumber = await UserDB.findExistingPhoneNumber(phoneNumber);

	if (existingPhoneNumber) {
		customError.throwCustomError(403, 'phoneNumber already registered');
	}

	const userDataFromClient = new User({
		...data,
		password: bcrypt.hashSync(password, 10),
		contacts: [],
		dateCreated: new Date(),
	});

	return UserDB.registerNewUser(userDataFromClient)
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
			return result;
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

const updateUser = async (contactId, userId) => {
	// const contactDetails = await UserDB.findExistingUserById(newContactId);

	newContactId = new ObjectId(contactId);

	return UserDB.updateUser(newContactId, userId)
		.then((result) => result)
		.catch((err) => {
			throw err;
		});
};

module.exports = {
	loginUser,
	registerNewUser,
	getUserContacts,
	findAllUsersByName,
	updateUser,
};
