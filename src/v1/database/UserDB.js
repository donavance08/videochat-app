const User = require('../models/User');

const findExistingUser = (username) => {
	return User.findOne({ username }, { username: 1 })
		.then((result) => {
			return result;
		})
		.catch((err) => {
			throw err;
		});
};

module.exports.loginUser = async (username, password) => {
	return await User.findOne({ username })
		.then((result) => {
			if (!result) {
				throw {
					status: 401,
					message: 'Invalid username or password',
				};
			}

			if (result.password === password) {
				return result.username;
			}

			throw {
				status: 401,
				message: 'Invalid username or password',
			};
		})
		.catch((err) => {
			throw {
				status: 500,
				message: err.message,
			};
		});
};

module.exports.registerNewUser = async (newUserData) => {
	const existingUser = await findExistingUser(newUserData.username);

	if (existingUser) {
		throw {
			status: 403,
			message: 'Username already exists',
		};
	}

	return newUserData
		.save()
		.then((result) => {
			if (result) {
				return result;
			}

			throw {
				status: 500,
				message: 'Registration failed',
			};
		})
		.catch((err) => {
			throw err;
		});
};
