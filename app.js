const express = require('express');
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');
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
const sound = path.join(
	__dirname,
	'watercooler-videochat-app/build/sound/phone.mp3'
);
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

app.use('/sound', (req, res) => {
	res.sendFile(sound);
});
app.use('*', (req, res) => {
	res.sendFile(home);
});

const httpsOptions = {
	key: fs.readFileSync(process.env.SSL_KEY),
	cert: fs.readFileSync(process.env.SSL_CERT),
};

const server = https
	.createServer(httpsOptions, app)
	.listen(port, () => console.log(`Server running at port:${port}`));

const io = require('./io').initialize(server);

module.exports = { MongoClient };
