const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const dbUrl = process.env.MONGOLAB_URI;

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
			id: { $gt: 26 }
		});
	}
});
