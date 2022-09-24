const fsPromises = require('fs').promises;
const path = require('path');
const users = require('../model/users.json');

const usersDB = {
	users: users,
	setUsers: function (data) {
		this.users = data;
	},
};

exports.handleLogout = async (req, res) => {
	// On client, also delete the accessToken

	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204); // No content
	const refreshToken = cookies.jwt;

	// Is refresh in DB?
	const foundUser = usersDB.users.find(usr => usr.refreshToken === refreshToken);
	if (!foundUser) {
		res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
		return res.sendStatus(204);
	}

	// Delete refreshToken in DB
	const otherUsers = usersDB.users.filter(usr => usr.refreshToken !== foundUser.refreshToken);
	const currentUser = { ...foundUser, refreshToken: '' };
	usersDB.setUsers([...otherUsers, currentUser]);
	await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.users));

	res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true, maxAge: 24 * 60 * 60 * 1000 });
	res.sendStatus(204);
};
