const express = require('express');
const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');
const socket = require('socket.io');
// const http = require('http');
const cors = require('cors');
const userRoutes = require('./src/v1/routes/userRoutes');
const messageRoutes = require('./src/v1/routes/messageRoutes');
require('dotenv').config();

const port = process.env.PORT || 8000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose
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

/* ROUTES */
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

const server = app.listen(port, () =>
	console.log(`API running at localhost:${port}`)
);

const io = require('./io.js').initialize(server);
