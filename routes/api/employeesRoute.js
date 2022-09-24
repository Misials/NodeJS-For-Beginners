const express = require('express');
const employessData = require('./../../data/employees.json');

const router = express.Router();

const data = {};
data.employess = employessData;

router
	.route('/')
	.get((req, res) => {
		res.json(data.employess);
	})
	.post((req, res) => {
		res.json({
			firstname: req.body.firstname,
			lastname: req.body.lastname,
		});
	})
	.put((req, res) => {
		res.json({
			firstname: req.body.firstname,
			lastname: req.body.lastname,
		});
	})
	.delete((req, res) => {
		res.json({
			id: req.body.id,
		});
	});

router.route('/:id').get((req, res) => {
	res.json({
		id: req.params.id,
	});
});

module.exports = router;
