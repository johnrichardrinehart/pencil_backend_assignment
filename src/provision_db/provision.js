const parse = require('csv-parse');
const fs = require('fs');

async function provisionMongo() {
	mc = {}; // mongo client placeholder
	await Promise.all([
		provisionQuestionsDB(mc),
		provisionTopicsDB(mc),
	]);
}

// provision questionsDB
async function provisionQuestionsDB(mongoClient, fname="test.csv") {
	// set up the parser
	const parser = parse();
	parser.on('readable', function(){
		let record
		while (record = parser.read()) {
			console.log(record);
		};
	});
	parser.on('end', () => {});

	let readStream = fs.createReadStream(fname);
	readStream.on('end', chunk => {
		parser.end()
	});
	readStream.on('data', buf => {
			parser.write(buf);
	});
	console.log("parsing questions file");
}

// provision topicsDB
async function provisionTopicsDB(mongoClient) {
	console.log("parsing topics file");
}

module.exports = provisionMongo
