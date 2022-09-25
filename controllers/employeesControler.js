const Employee = require('./../model/employeeModel');

exports.getEmployees = async (req, res) => {
	const allEmployees = await Employee.find();
	if (!allEmployees) return res.status(204).json({ message: 'No employees found.' });
	res.json(allEmployees);
};

exports.postCreateEmployee = async (req, res) => {
	if (!req?.body?.firstname || !req?.body?.lastname) {
		return res.status(400).json({ message: 'First and last names are required!' });
	}
	try {
		const result = await Employee.create({
			firstname: req.body.firstname,
			lastname: req.body.lastname,
		});

		res.status(201).json(result);
	} catch (err) {
		console.log(err);
	}
};

exports.updateEmployee = async (req, res) => {
	if (!req?.body?._id) {
		return res.status(400).json({ massage: 'ID parameter is required' });
	}

	const employee = await Employee.findOne({ _id: req.body._id }).exec();

	if (!employee) return res.status(204).json({ message: `Employee with ID ${req.body._id} not found.` });

	if (req.body?.firstname) employee.firstname = req.body.firstname;
	if (req.body?.lastname) employee.lastname = req.body.lastname;

	const result = await employee.save();

	res.json({ result });
};

exports.deleteEmployee = async (req, res) => {
	if (!req?.body?._id) return res.status(400).json({ message: 'Employee ID required' });

	const employee = await Employee.findOne({ _id: req.body._id }).exec();

	if (!employee) return res.status(204).json({ message: `No employee with ID ${req.body._id}` });

	const result = await employee.deleteOne({ _id: req.body._id });

	res.json({ result });
};

exports.getEmployee = async (req, res) => {
	if (!req?.params?.id) return res.status(400).json({ message: 'Employee ID required' });

	const employee = await Employee.findOne({ _id: req.params.id }).exec();

	if (!employee) return res.status(400).json({ massage: 'There is no employee with that id' });

	res.json({ employee });
};
