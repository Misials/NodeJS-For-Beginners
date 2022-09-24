const express = require('express');
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const rootRoute = require('./routes/rootRoute');
const employessRoute = require('./routes/api/employeesRoute');

const PORT = process.env.PORT || 3500;
const app = express();

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// Built-in middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// Routes
app.use('/', rootRoute);
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

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
