const util = require('util');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const dbConfig = require('../configs/db');
require('dotenv').config();
const mongoose = require('mongoose');

const promise = mongoose.connect(`${process.env.MONGO_SERVER}`, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const storage = new GridFsStorage({
	db: promise,
	options: { useNewUrlParser: true, useUnifiedTopology: true },
	file: (req, file) => {
		const match = ['image/png', 'image/jpeg'];
		if (match.indexOf(file.mimetype) === -1) {
			const filename = `${Date.now()}-${file.originalname}`;
			return filename;
		}

		return {
			bucketName: dbConfig.imgBucket,
			filename: `${Date.now()}-${file.originalname}`,
		};
	},
});

const uploadFiles = multer({ storage }).single('file');
const uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
