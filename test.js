const MongoClient = require('mongodb').MongoClient;
const dbUrl = 'mongodb://DrunkTolstoyAdMatay:I38MwVBQkb#l@ds233198.mlab.com:33198/lienet';

MongoClient.connect(dbUrl, (err, db) => {
	if (err) console.log(err);
	else {
		const newValue = { $set: { author: 'רזי בר אשכנז - צמחוני' } };
		db.db('lienet').collection('articles').updateMany({}, newValue, (err, result) => {
			if (err) throw err;
			else {
				db.close();
			}
		});
	}
});
