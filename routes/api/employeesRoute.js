const express = require('express');
const {
	getEmployees,
	postCreateEmployee,
	updateEmployee,
	deleteEmployee,
	getEmployee,
} = require('./../../controllers/employeesControler');
const ROLES_LIST = require('./../../config/roles_list');
const { verifyRoles } = require('./../../middleware/verifyRoles');

const router = express.Router();

router
	.route('/')
	.get(getEmployees)
	.post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), postCreateEmployee)
	.put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), updateEmployee)
	.delete(verifyRoles(ROLES_LIST.Admin), deleteEmployee);

router.route('/:id').get(getEmployee);

module.exports = router;
