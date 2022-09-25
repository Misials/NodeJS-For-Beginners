const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const fsPromises = require('fs').promises;
const users = require('../model/users.json');

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
		const roles = Object.values(foundUser.roles);
		// create JWTs
		const accessToken = jwt.sign(
			{
				UserInfo: {
					username: foundUser.username,
					roles: roles,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{
				expiresIn: '30s',
			}
		);
		const refreshToken = jwt.sign({ username: foundUser.username }, process.env.REFRESH_TOKEN_SECRET, {
			expiresIn: '1d',
		});
		// Saving refreshToken with current user
		const otherUsers = usersDB.users.filter(usr => usr.username !== foundUser.username);
		const currentUser = { ...foundUser, refreshToken };
		usersDB.setUsers([...otherUsers, currentUser]);
		await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.users));

		res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
		res.json({ accessToken });
	} else {
		res.sendStatus(401);
	}
};
