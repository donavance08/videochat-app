const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./src/v1/routes/userRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

mongoose
	.connect(`${process.env.MONGO_SERVER}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('MongoDB server online'))
	.catch((err) =>
		console.error('Error encountered when connecting with MongoDB server', err.message)
	);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/users', userRoutes);

app.listen(port, () => console.log(`API running at localhost:${port}`));
