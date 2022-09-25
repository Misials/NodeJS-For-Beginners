const jwt = require('jsonwebtoken');
const users = require('../model/users.json');

const usersDB = {
	users: users,
	setUsers: function (data) {
		this.users = data;
	},
};

exports.handleRefreshToken = (req, res) => {
	const cookies = req.cookies;
	// Check if cookies were provided
	if (!cookies?.jwt) return res.sendStatus(401);
	console.log(cookies.jwt);
	const refreshToken = cookies.jwt;

	const foundUser = usersDB.users.find(usr => usr.refreshToken === refreshToken);
	if (!foundUser) return res.sendStatus(403); // Forbidden

	// Evaluate JWT
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
		if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
		const roles = Object.values(foundUser.roles);
		const accessToken = jwt.sign(
			{
				UserInfo: {
					username: decoded.username,
					roles: roles,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '30s' }
		);
		res.json({ accessToken });
	});
};
