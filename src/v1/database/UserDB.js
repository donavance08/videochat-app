const User = require('../models/User');
const customError = require('../utils/customError');

const findExistingUserByName = (username) => {
	return User.findOne({ username }, { username: 1 })
		.then((result) => {
			if (result) {
				return result;
			}

			return null;
		})
		.catch((err) => {
			console.log(err);
			return null;
		});
};

//projection is for values to be excluded
const findExistingUserById = async (id, projection = {}) => {
	projection = {
		...projection,
		password: 0,
	};

	return User.findOne({ _id: id }, projection)
		.then((result) => {
			if (result) {
				return result;
			}

			return null;
		})
		.catch((err) => {
			console.log(err);
			return null;
		});
};

const findExistingPhoneNumber = (phoneNumber) => {
	return User.findOne({ phoneNumber })
		.then((result) => {
			if (result) {
				return result;
			}

			return null;
		})
		.catch((err) => {
			console.log(err);
			return null;
		});
};

const loginUser = async (username, password) => {
	return await User.findOne({ username }, {})
		.then((result) => {
			if (!result) {
				customError.throwCustomError(403, 'Invalid username or password');
			}
			return result;
		})
		.catch((err) => {
			customError.throwCustomError(500, err.message);
		});
};

const registerNewUser = (newUserData) => {
	return newUserData
		.save()
		.then((result) => {
			if (result) {
				return result;
			}

			customError.throwCustomError(500, 'Registration failed');
		})
		.catch((err) => {
			throw err;
		});
};

const getUserContacts = async (id) => {
	const user = await findExistingUserById(id, {})
		.then((result) => {
			if (result) {
				return result;
			}
			customError.throwCustomError(204, `cannot find user with Id: ${id}`);
		})
		.catch((err) => {
			customError.throwCustomError(500, err.message);
		});

	return user;
};

const findAllUsersByName = async (name) => {
	return await User.find({ nickname: { $regex: `${name}`, $options: 'i' } })
		.then((result) => {
			if (result.length > 0) {
				return result;
			}

			customError.throwCustomError(404, 'No user found with the given name');
		})
		.catch((err) => {
			throw err;
		});
};

module.exports = {
	findExistingUserByName,
	findExistingUserById,
	loginUser,
	getUserContacts,
	registerNewUser,
	findAllUsersByName,
	findExistingPhoneNumber,
};
