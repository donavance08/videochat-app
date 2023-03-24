const express = require('express');
const mongoose = require('mongoose');
const socket = require('socket.io');
const cors = require('cors');
const userRoutes = require('./src/v1/routes/userRoutes');
const messageRoutes = require('./src/v1/routes/messageRoutes');
const smsRoutes = require('./src/v1/routes/smsRoutes');
const callRoutes = require('./src/v1/routes/callRoutes');
const path = require('path');
require('dotenv').config();

const port = process.env.PORT || 8000;

const app = express();

app.use(express.json());

const home = path.join(__dirname, 'watercooler-videochat-app/build/index.html');
app.use(
	express.static(path.join(__dirname, 'watercooler-videochat-app', 'build'))
);

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
app.use('/api/chat', messageRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/call', callRoutes);

app.use('*', (req, res) => {
	res.sendFile(home);
});

const server = app.listen(port, () =>
	console.log(`API running at localhost:${port}`)
);

const io = require('./io').initialize(server);

module.exports = { MongoClient };
