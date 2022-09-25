const bcrypt = require('bcrypt');
const User = require('./../model/userModel');

exports.handleNewUser = async (req, res) => {
	const { user, pwd } = req.body;
	// Check if username and password were provided
	if (!user || !pwd) {
		return res.status(400).json({ message: 'Username and password are required!' });
	}

	// Check if username is not duplicated
	const duplicate = await User.findOne({ username: user }).exec();
	if (duplicate) return res.sendStatus(409);
	try {
		// Encrypt password
		const hashedPwd = await bcrypt.hash(pwd, 10);
		// Create and store new user
		const result = await User.create({
			username: user,
			password: hashedPwd,
		});

		console.log(result);

		res.status(201).json({ message: `New user ${user} was created!` });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
