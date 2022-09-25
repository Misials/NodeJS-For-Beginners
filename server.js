require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const rootRoute = require('./routes/rootRoute');
const employessRoute = require('./routes/api/employeesRoute');
const registerRoute = require('./routes/registerRoute');
const authRoute = require('./routes/authRoute');
const verifyJWT = require('./middleware/verifyJWT');
const refreshRoute = require('./routes/refreshRoute');
const logoutRoute = require('./routes/logoutRoute');
const credentials = require('./middleware/credentials');
const connectDB = require('./config/dbConn');

const PORT = process.env.PORT || 3500;
const app = express();

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// Built-in middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware for cookie
app.use(cookieParser());

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// Routes
app.use('/', rootRoute);
app.use('/register', registerRoute);
app.use('/auth', authRoute);
app.use('/refresh', refreshRoute);
app.use('/logout', logoutRoute);

app.use(verifyJWT);
app.use('/employees', employessRoute);

// 404 Route
app.all('*', (req, res) => {
	res.status(404);
	if (req.accepts('html')) {
		res.sendFile(path.join(__dirname, 'views', '404.html'));
	} else if (req.accepts('json')) {
		res.json({
			error: '404 Not Found',
		});
	} else {
		res.type('txt').send('404 Not Found');
	}
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
	console.log('Connected to MongoDB');
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
});
