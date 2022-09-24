const employeesData = require('../model/employees.json');
const data = {
	employees: employeesData,
	setEmployees: function (data) {
		this.employees = data;
	},
};

exports.getEmployees = (req, res) => {
	res.json(data.employees);
};

exports.postCreateEmployee = (req, res) => {
	const newEmployee = {
		id: data.employees[data.employees.length - 1].id + 1 || 1,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
	};

	if (!newEmployee.firstname || !newEmployee.lastname) {
		return res.status(400).json({
			ErrorMassage: 'First and last names are required!',
		});
	}

	data.setEmployees([...data.employees, newEmployee]);
	res.status(201).json(data.employees);
};

exports.updateEmployee = (req, res) => {
	const employeeID = req.body.id;
	const newFirstName = req.body.firstname;
	const newLastName = req.body.lastname;
	const employeeIndex = data.employees.findIndex(employee => employee.id === employeeID);
	const employee = data.employees[employeeIndex];

	if (newFirstName) employee.firstname = newFirstName;
	if (newLastName) employee.lastname = newLastName;

	if (!employee) {
		return res.status(400).json({ massage: 'There is no employee with that id' });
	}

	data.employees[employeeIndex] = employee;

	res.json({
		employee,
	});
};

exports.deleteEmployee = (req, res) => {
	const employeeID = req.body.id;
	const employeeIndex = data.employees.findIndex(employee => employee.id === employeeID);
	const employee = data.employees[employeeIndex];

	if (employeeIndex === -1) {
		return res.status(400).json({
			message: "There isn't any employee with that ID!",
		});
	}

	console.log(employeeIndex);
	data.employees.splice(employeeIndex, 1);
	console.log(data.employees);
	res.json({ employee });
};

exports.getEmployee = (req, res) => {
	const employeeID = +req.params.id;
	const employee = data.employees[data.employees.findIndex(employee => employee.id === employeeID)];

	if (!employee) {
		return res.status(400).json({ massage: 'There is no employee with that id' });
	}

	res.json({
		id: employee.id,
		firstname: employee.firstname,
		lastname: employee.lastname,
	});
};
