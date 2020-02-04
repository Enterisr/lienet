const MongoClient = require('mongodb').MongoClient;
const dbUrl = 'mongodb://DrunkTolstoyAdMatay:I38MwVBQkb#l@ds233198.mlab.com:33198/lienet';

MongoClient.connect(dbUrl, (err, db) => {
	if (err) console.log(err);
	else {
		db.db('lienet').collection('authors').remove({}, (err, result) => {
			if (err) throw err;
			else {
				db.close();
			}
		});
	}
});
