const { mongo } = require('mongoose');
const upload = require('../middlewares/upload');
const dbConfig = require('../configs/db');

//update this if error
// const { MongoClient } = require('../../../app');
const MongoClient = require('mongodb').MongoClient;
const GridFsBucket = require('mongodb').GridFsBucket;

const url = dbConfig.url;

// const baseUrl = 'http://localhost:8080/files/'

const mongoClient = new MongoClient(url);

const uploadFiles = async (req, res) => {
	try {
		await upload(req, res);
		console.log('req.file', req.file);

		if (req.file == undefined) {
			return res.send({
				message: 'You must select a file.',
			});
		}

		return res.send({
			message: 'File has been uploaded.',
		});
	} catch (err) {
		console.log('caught error ');
		console.log(err);

		return res.send({
			message: `Error when trying to upload image: ${err}`,
		});
	}
};

// const getListFiles = async (req, res) => {
// 	try {
// 		await mongoClient.connect();

// 		const database = mongoClient.db(dbConfig.database);
// 		const images = database.collection(dbConfig.imgBucket + '.files');

// 		const cursor = images.find({});

// 		if ((await cursor.count()) === 0) {
// 			return res.status(500).send({
// 				message: 'No files found!',
// 			});
// 		}

// 		let fileInfos = [];
// 		await cursor.forEach((doc) => {
// 			fileInfos.push({
// 				name: doc.filename,
// 				url: baseUrl + doc.filename,
// 			});
// 		});

// 		return res.status(200).send(fileInfos);
// 	} catch (err) {
// 		return res.status(err?.status || 500).send({
// 			message: error.message,
// 		});
// 	}
// };

// const download = async (req, res) => {
// 	try {
// 		await mongoClient.connect();

// 		const database = mongoClient.db(dbConfig.database);
// 		const bucket = new GridFsBucket(database, {
// 			bucketName: dbConfig.imgBucket,
// 		});

// 		let downloadStream = bucket.openDownloadStreamByName(req.params.name);

// 		downloadStream.on('error', function (err) {
// 			return res.send(err.status || 404).send({
// 				message: 'Cannot download the Image!',
// 			});
// 		});

// 		downloadStream.on('end', () => {
// 			return res.send();
// 		});
// 	} catch (err) {
// 		return res.status(err.status || 500).send({
// 			message: err.message,
// 		});
// 	}
// };

module.exports = {
	uploadFiles,
	// getListFiles,
	// download,
};
