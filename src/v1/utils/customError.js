module.exports.throwCustomError = (status, message) => {
	throw new CustomError(status, message);
};

class CustomError extends Error {
	constructor(status, message) {
		super(message);
		this.status = status;
	}
}
