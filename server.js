const secret = require('dotenv').config();
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const dbUrl = process.env.MONGOLAB_URI;
const app = express();
const port = process.env.PORT || 6969;
const querystring = require('querystring');
const cors = require('cors');
const path = require('path');
app.use(cors());
app.use(express.json());

app.get('/article', (req, res) => {
	MongoClient.connect(dbUrl, function(err, db) {
		if (!isNaN(req.query.num)) {
			const dbo = db.db('lienet');
			let requestedArticle = parseInt(req.query.num);
			dbo.collection('articles').findOne({ id: requestedArticle }, (err, resule) => {
				if (err) throw err;
				if (resule) {
					res.send(resule);
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
	MongoClient.connect(dbUrl, (err, db) => {
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

app.get('/comments', (req, res) => {
	let article = parseInt(req.query.article);
	if (!isNaN(article)) {
		MongoClient.connect(dbUrl, (err, db) => {
			if (err) throw err;
			else {
				db
					.db('lienet')
					.collection('comments')
					.find({ article: article }, { projection: { id: 1, userName: 1, text: 1 } })
					.sort({ _id: -1 })
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
	}
});
app.post('/postComment', (req, res) => {
	console.log(res);
	MongoClient.connect(dbUrl, (err, db) => {
		if (err) console.log(err);
		else {
			let comment = sanitize(req.body);

			db.db('lienet').collection('comments').insertOne(comment, (err, result) => {
				if (err) throw err;
				else {
					db.close();
					res.status(200).send(req.body);
				}
			});
		}
	});
});
if (process.env.NODE_ENV === 'production') {
	// Serve any static files
	app.use(express.static(path.join(__dirname, 'client/public/build'))).use(cors());
	app.use(express.static('client/public/build'));
	app.use(express.static('client/public'));
	app.use(express.static(path.join(__dirname, 'client/public')));

	// Express serve up index.html file if it doesn't recognize route
	app.get('*', (req, res) => {
		res.sendFile(path.resolve('client', 'public', 'index.html'));
	});
}
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
//TODO: change this to prod mode..

function sanitize(v) {
	if (v instanceof Object) {
		for (var key in v) {
			if (/^\$/.test(key)) {
				delete v[key];
			} else {
				sanitize(v[key]);
			}
		}
	}
	return v;
}
