'use strict';

const { ArgumentParser } = require('argparse');
const { version } = require('../package.json');


// main
(function() {
	let args = getArgs()
	switch (args.mode) {
		case "http":
			runServer();
			break;
		case "provision":
			provisionDB();
			break;
		default:
			console.log("invalid -m/--mode flag")
	}
}())


function runServer() {
	const express = require('express');

	// Constants
	const PORT = 8080;
	const HOST = '0.0.0.0';

	// App
	const app = express();
	app.get('/', (req, res) => {
			res.send('Hello Marina!');
			});

	app.listen(PORT, HOST);
	console.log(`Running on http://${HOST}:${PORT}`);
}

function getArgs() {
	const parser = new ArgumentParser({
		description: 'Argparse example'
	})
	parser.add_argument('-v', '--version', {action: 'version', version});
	parser.add_argument('-m', '--mode');
	parser.add_argument('file')
	return parser.parse_args()
}
