const express = require('express');
const mongoose = require('mongoose');
const socket = require('socket.io');
const cors = require('cors');
const userRoutes = require('./src/v1/routes/userRoutes');
const messageRoutes = require('./src/v1/routes/messageRoutes');
const smsRoutes = require('./src/v1/routes/smsRoutes');
require('dotenv').config();
const client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKEN);

const port = process.env.PORT || 8000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const mongo = mongoose
	.connect(`${process.env.MONGO_SERVER}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('MongoDB server online'))
	.catch((err) =>
		console.error(
			'Error encountered when connecting with MongoDB server',
			err.message
		)
	);

const MongoClient = mongo.MongoClient;

/* ROUTES */
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/sms', smsRoutes);

const server = app.listen(port, () =>
	console.log(`API running at localhost:${port}`)
);

const io = require('./io.js').initialize(server);

module.exports = { MongoClient };
