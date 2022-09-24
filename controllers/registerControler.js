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

exports.handleNewUser = async (req, res) => {
	const { user, pwd } = req.body;
	// Check if username and password were provided
	if (!user || !pwd) {
		return res.status(400).json({ message: 'Username and password are required!' });
	}
	// Check if username is not duplicated
	const duplicate = usersDB.users.find(usr => usr.username === user);
	if (duplicate) return res.sendStatus(409);
	try {
		// Encrypt password
		const hashedPwd = await bcrypt.hash(pwd, 10);
		// Store new user
		const newUser = {
			username: user,
			password: hashedPwd,
		};
		usersDB.setUsers([...usersDB.users, newUser]);
		await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.users));
		res.status(201).json({ message: `New user ${user} was created!` });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
