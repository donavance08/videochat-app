require('dotenv').config();

module.exports = {
	url: `${process.env.MONGO_SERVER}/`,
	database: 'files_db',
	imgBucket: 'photos',
};
