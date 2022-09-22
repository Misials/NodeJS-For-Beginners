const fsPromises = require('fs').promises;
const path = require('path');

const fileOps = async () => {
	try {
		const data = await fsPromises.readFile(path.join(__dirname, 'data', 'starter.txt'), 'utf-8');
		console.log(data);
		await fsPromises.unlink(path.join(__dirname, 'data', 'starter.txt'));
		await fsPromises.writeFile(path.join(__dirname, 'data', 'promiseWrite.txt'), data);
		await fsPromises.appendFile(path.join(__dirname, 'data', 'promiseWrite.txt'), '\n\nNice to meet you!');
		await fsPromises.rename(
			path.join(__dirname, 'data', 'promiseWrite.txt'),
			path.join(__dirname, 'data', 'promiseComplete.txt')
		);
		const newData = await fsPromises.readFile(path.join(__dirname, 'data', 'promiseComplete.txt'), 'utf-8');
		console.log(newData);
	} catch (err) {
		console.error(err);
	}
};

fileOps();

// fs.writeFile(path.join(__dirname, 'data', 'reply.txt'), 'Nice to meet you Mikołaj', err => {
// 	if (err) throw err;
// 	console.log('Write complete');

// 	fs.appendFile(path.join(__dirname, 'data', 'reply.txt'), '\n\nYeeeess - Hello!', err => {
// 		if (err) throw err;
// 		console.log('Append complete');

// 		fs.rename(path.join(__dirname, 'data', 'reply.txt'), path.join(__dirname, 'data', 'newReplay.txt'), err => {
// 			if (err) throw err;
// 			console.log('Rename complete');
// 		});
// 	});
// });

process.on('uncaughtException', err => {
	console.error(`There was an uncaught error: ${err}`);
	process.exit(1);
});
