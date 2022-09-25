const User = require('./../model/userModel');

exports.handleLogout = async (req, res) => {
	// On client, also delete the accessToken

	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204); // No content
	const refreshToken = cookies.jwt;

	// Is refresh in DB?
	const foundUser = await User.findOne({ refreshToken }).exec();
	if (!foundUser) {
		res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
		return res.sendStatus(204);
	}

	// Delete refreshToken in DB
	foundUser.refreshToken = '';
	const result = await foundUser.save();

	console.log(result);

	res.clearCookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
	res.sendStatus(204);
};
