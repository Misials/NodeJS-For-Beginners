const express = require('express');
const path = require('path');

const router = express.Router();

router.get('^/$|/index(.html)?', (req, res, next) => {
	// res.sendFile('./views/index.html', { root: __dirname });
	res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.get('/new-page(.html)?', (req, res, next) => {
	res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
});

router.get('/old-page(.html)?', (req, res, next) => {
	res.redirect(301, '/new-page');
});

module.exports = router;
