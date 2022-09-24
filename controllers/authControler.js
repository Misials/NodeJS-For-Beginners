const bcrypt = require('bcrypt');
const path = require('path');
const fsPromises = require('fs').promises;
const users = require('./../model/users.json');

const usersDB = {
	users: users,
	setUsers: function (data) {
		this.users = data;
	},
};

exports.handleLogin = async (req, res) => {
	const { user, pwd } = req.body;
	// Check if username and password were provided
	if (!user || !pwd) {
		return res.status(400).json({ message: 'Username and password are required!' });
	}
	const foundUser = usersDB.users.find(usr => usr.username === user);
	if (!foundUser) return res.sendStatus(401); // Unauthorized

	// Evaluate password
	const match = await bcrypt.compare(pwd, foundUser.password);
	if (match) {
		// create JWTs ?
		res.json({ message: `User ${user} is logged in!` });
	} else {
		res.sendStatus(401);
	}
};
