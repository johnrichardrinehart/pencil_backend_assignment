const parse = require('csv-parse');
const fs = require('fs');

async function provisionMongo() {
	mc = {}; // mongo client placeholder
	provisionTopics(mc);
	provisionQuestionsDB(mc);
}

// provision questionsDB
async function provisionQuestionsDB(mongoClient, fname="../data/Questions and Topics - Questions.csv") {
	// set up the parser
	const parser = parse();
	parser.on('readable', function(){
		let record
		while (row = parser.read()) {
			const qn = row[0]
			for (let i=1; i<row.length; i++) {
				q = row[i]
				if (q) {
					console.log(q);
				}
			}
		};

	});
	parser.on('end', () => {});

	// start reading the file
	let readStream = fs.createReadStream(fname);
	// set up the event to end the parser as soon as we're done reading
	readStream.on('end', chunk => {
		parser.end()
	});
	// give the parser the data
	readStream.on('data', buf => {
		parser.write(buf);
	});
}

// provision topicsDB
async function provisionTopicsDB(mongoClient) {
	console.log("parsing topics file");
}

module.exports = provisionMongo
