const fs = require('fs');
const path = require('path');

if (!fs.existsSync(path.join(__dirname, 'new'))) {
	fs.mkdir(path.join(__dirname, 'new'), err => {
		if (err) throw err;
		console.log('Created Directory');
	});
}

if (fs.existsSync(path.join(__dirname, 'new'))) {
	fs.rmdir(path.join(__dirname, 'new'), err => {
		if (err) throw err;
		console.log('Removed Directory');
	});
}
