const MongoClient = require('mongodb').MongoClient;
const dbUrl = 'mongodb://DrunkTolstoyAdMatay:I38MwVBQkb#l@ds233198.mlab.com:33198/lienet';
const Scarper = require('./scrapHeadLinePhoto');
const { promisify } = require('util');

/*MongoClient.connect(dbUrl, (err, db) => {
	if (err) console.log(err);
	else {
		db.db('lienet').collection('articles').find({}).sort({ id: -1 }).toArray((err, articles) => {
			if (err) throw err;
			else {
				articles = [ articles[0] ];
				articles.forEach(async (article) => {
					let text = article.text || 'bibi';
					let photoUrl = await Scarper.ScrapPhotoForArticle(text);
					db
						.db('lienet')
						.collection('articles')
						.updateOne({ id: article.id }, { $set: { photoUrl } }, (err, result) => {
							if (err) throw err;
						});
				});
			}
		});
	}
});*/
MongoClient.connect(dbUrl, (err, db) => {
	if (err) console.log(err);
	else {
		db.db('lienet').collection('articles').deleteMany({
			timestamp: {
				$gte: new Date(new Date().setHours(00, 00, 00)),
				$lt: new Date(new Date().setHours(23, 59, 59))
			}
		});
	}
});
