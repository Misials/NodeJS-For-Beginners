const bcrypt = require('bcrypt');
const User = require('./../model/userModel');

exports.getAllUsers = async (req, res) => {
	const allUsers = await User.find().exec();

	if (!allUsers) return res.status(204).json({ message: "There aren't any users there." });

	res.status(200).json({ allUsers });
};

exports.postCreateUser = async (req, res) => {
	if (!req?.body?.username || !req?.body?.password)
		return res.status(400).json({ message: 'Username and password are required!' });

	const duplicate = await User.findOne({ username: req.body.username });
	if (duplicate) return res.status(409).json({ message: 'Username already exisits in DB' });

	const hashedPassword = await bcrypt.hash(req.body.password, 10);

	const newUser = await User.create({
		username: req.body.username,
		password: hashedPassword,
	});

	res.status(201).json({ newUser });
};

exports.updateUser = async (req, res) => {
	if (!req?.body?._id) return res.status(400).json({ message: 'ID param is required!' });

	const user = await User.findOne({ _id: req.body._id }).exec();

	if (!user) return res.status(400).json({ message: `There isn't any user with ID ${req.params._id}` });

	if (req.body.username) user.username = req.body.username;
	if (req.body.password) {
		const hashedPassword = await bcrypt.hash(req.body.password);
		user.password = hashedPassword;
	}

	const updateUser = await user.save();

	res.status(200).json({ updateUser });
};

exports.deleteUser = async (req, res) => {
	if (!req?.body?._id) return res.status(400).json({ message: 'ID param is required!' });

	const user = await User.findOne({ _id: req.body._id }).exec();

	if (!user) return res.status(400).json({ message: `There isn't any user with ID ${req.params._id}` });

	const result = await user.delete();

	res.status(200).json({ message: `User ${user.username} deleted` });
};

exports.getUser = async (req, res) => {
	if (!req?.params?._id) return res.status(400).json({ message: 'ID param is required!' });

	const user = await User.findOne({ _id: req.params._id }).exec();

	if (!user) return res.status(400).json({ message: `There isn't any user with ID ${req.params._id}` });

	res.status(200).json({ user });
};
