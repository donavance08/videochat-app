const UserDB = require('../database/UserDB');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const auth = require('../../../auth.js');
const customError = require('../utils/customError');
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * Function to handle extraction of info to be tokenized
 * @param {Object} userInfo
 * @returns {Object}
 */
const extractInfoToBeTokenized = (userInfo) => {
	if (!userInfo) {
		return;
	}

	const { nickname, username, phoneNumber } = userInfo;

	return { nickname, username, phoneNumber, id: userInfo._id };
};

const loginUser = (username, password) => {
	return UserDB.loginUser(username)
		.then((result) => {
			if (bcrypt.compareSync(password, result.password)) {
				const token = auth.createAccessToken(extractInfoToBeTokenized(result));

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
	const { password } = data;

	const newUserDetails = new User({
		...data,
		password: bcrypt.hashSync(password, 10),
		contacts: [],
		dateCreated: new Date(),
	});

	return UserDB.registerNewUser(newUserDetails)
		.then((result) => {
			const token = auth.createAccessToken(extractInfoToBeTokenized(result));

			return {
				nickname: result.nickname,
				token,
				id: result._id,
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
			return result.map((contact) => {
				return {
					nickname: contact.nickname,
					_id: contact._id,
					phoneNumber: contact.phoneNumber,
				};
			});
		})
		.catch((err) => {
			console.log(err.message);
			throw err;
		});
};

const removeContactsFromResult = (result, contacts, userId) => {
	return result.filter((item) => {
		if (
			item._id.toString() !== userId &&
			contacts.indexOf(item._id.toString()) < 0
		) {
			return item;
		}
	});
};

const findAllUsersByName = async (name, userId) => {
	try {
		const searchResult = await UserDB.findAllUsersByName(name).then((result) =>
			result.map((user) => {
				return {
					nickname: user.nickname,
					_id: user._id,
				};
			})
		);

		if (!searchResult) {
			return [];
		}

		const userContacts = await UserDB.getUserContacts(userId).then((result) =>
			result.map((contact) => contact._id.toString())
		);

		return removeContactsFromResult(searchResult, userContacts, userId);
	} catch (err) {}
};

const addContact = async (contactId, userId) => {
	// const contactDetails = await UserDB.findExistingUserById(newContactId);

	newContactId = new ObjectId(contactId);

	UserDB.addContact(userId, newContactId);

	return UserDB.addContact(newContactId, userId)

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
	addContact,
};
