const express = require('express');
const {
	getEmployees,
	postCreateEmployee,
	updateEmployee,
	deleteEmployee,
	getEmployee,
} = require('./../../controllers/employeesControler');

const router = express.Router();

router.route('/').get(getEmployees).post(postCreateEmployee).put(updateEmployee).delete(deleteEmployee);

router.route('/:id').get(getEmployee);

module.exports = router;
