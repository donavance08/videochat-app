const { mongo } = require('mongoose');
const upload = require('../middlewares/upload');
const dbConfig = require('../configs/db');
const io = require('../../../io');
const messageController = require('./messageController');

const MongoClient = require('mongodb').MongoClient;
const GridFSBucket = require('mongodb').GridFSBucket;

const url = dbConfig.url;

const baseUrl = `${process.env.REACT_APP_API_URL}/api/messages/files/`;

const mongoClient = new MongoClient(url);

const uploadFiles = async (req, res, next) => {
	try {
		await upload(req, res);

		if (req.file == undefined) {
			return res.send({
				message: 'You must select a file.',
			});
		}

		next();
	} catch (err) {
		console.log(err);

		return res.send({
			message: `Error when trying to upload image: ${err}`,
		});
	}
};

const getListFiles = async (req, res) => {
	try {
		await mongoClient.connect();

		const database = mongoClient.db(dbConfig.database);
		const images = database.collection(dbConfig.imgBucket + '.files');

		const cursor = images.find({});

		if ((await cursor.count()) === 0) {
			return res.status(500).send({
				message: 'No files found!',
			});
		}

		let fileInfos = [];
		await cursor.forEach((doc) => {
			fileInfos.push({
				name: doc.filename,
				url: baseUrl + doc.filename,
			});
		});

		return res.status(200).send(fileInfos);
	} catch (err) {
		return res.status(err?.status || 500).send({
			message: err.message,
		});
	}
};

const download = async (req, res) => {
	try {
		await mongoClient.connect();

		const database = mongoClient.db(dbConfig.database);
		const bucket = new GridFSBucket(database, {
			bucketName: dbConfig.imgBucket,
		});

		let downloadStream = bucket.openDownloadStreamByName(req.params.name);

		downloadStream.on('data', function (data) {
			return res.status(200).write(data);
		});

		downloadStream.on('error', function (err) {
			return res.status(err.status || 404).send({
				status: 'FAILED',
				message: 'Cannot download the Image!',
			});
		});

		downloadStream.on('end', () => {
			return res.send();
		});
	} catch (err) {
		return res.status(err.status || 500).send({
			status: 'FAILED',
			message: err.message,
		});
	}
};

module.exports = {
	uploadFiles,
	getListFiles,
	download,
};
