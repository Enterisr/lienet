const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/lienet';
const app = express();
const port = 6969;
var cors = require('cors');
app.use(cors());
app.use(express.json());
app.get('/connect', (req, res) => {
	MongoClient.connect(url, function(err, db) {
		if (!isNaN(req.query.num)) {
			const dbo = db.db('lienet');
			let requestedArticle = parseInt(req.query.num);
			dbo.collection('articles').find({ id: requestedArticle }).toArray((err, resule) => {
				if (err) throw err;
				if (resule[0]) {
					res.send(resule[0]);
				} else {
					res.send({ id: '-1', text: '404' });
				}
			});
		} else {
			res.send(new Error('500'));
		}
		db.close();
	});
});
app.get('/titles', (req, res) => {
	MongoClient.connect(url, (err, db) => {
		if (err) throw err;
		else {
			db
				.db('lienet')
				.collection('articles')
				.find({}, { projection: { title: 1, id: 1 } })
				.toArray((err, result) => {
					if (result) res.send(result);
					else {
						res.sendStatus(500);
						console.timeLog(err);
						throw err;
					}
				});
		}
	});
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
