const secret = require('dotenv').config();
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const dbUrl = process.env.MONGOLAB_URI;
const app = express();
const port = process.env.PORT || 6969;
const querystring = require('querystring');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const bcrypt = require('bcrypt');
const utils = require('./utils');
var jwt = require('jsonwebtoken');

const saltRounds = 10;

app.use(compression());
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
	MongoClient.connect(dbUrl, (err, db) => {
		if (err) console.log(err);
		else {
			let comment = utils.sanitize(req.body);
			let commentArticleParsed = { ...comment, article: parseInt(comment.article) };
			db.db('lienet').collection('comments').insertOne(commentArticleParsed, (err, result) => {
				if (err) throw err;
				else {
					db.close();
					res.status(200).send(req.body);
				}
			});
		}
	});
});
app.post('/Register', (req, res) => {
	//TODO://callback hell
	try {
		let author = utils.sanitize(req.body);
		bcrypt.hash(author.password, saltRounds, (err, hash) => {
			if (err) throw err;
			MongoClient.connect(dbUrl, (err, db) => {
				if (err) throw err;
				else {
					db.db('lienet').collection('authors').insertOne({ ...author, password: hash }, (err, result) => {
						if (err) throw err;
						else {
							db.close();
							res.send(true);
						}
					});
				}
			});
		});
	} catch (err) {
		console.error(err);
		res.status(500).send('the registretion failed :( maybe you should go cry in the corner, alone');
	}
});
app.post('/signIn', (req, res) => {
	//TODO://callback hell

	try {
		let { mail, password: enteredPassword } = utils.sanitize(req.body);
		MongoClient.connect(dbUrl, (err, db) => {
			if (err) throw err;
			else {
				db.db('lienet').collection('authors').findOne({ mail }, (err, userFromDb) => {
					if (err) throw err;
					else if (userFromDb == null) {
						res.send({ isSinged: false, token: null });
					} else {
						bcrypt.compare(enteredPassword, userFromDb.password, function(err, HashCompareRes) {
							if (HashCompareRes) {
								jwt.sign({ mail }, process.env.JWT_SECRET, { expiresIn: 60 * 60 }, (err, token) => {
									res.send({ isSinged: true, token });
								});
							} else {
								res.send({ isSinged: false, token: null });
							}
						});
					}
				});
			}
		});
	} catch (err) {
		console.error(err);
		res.status(500).send('the signIn failed :( maybe you should go cry in the corner, alone');
	}
});

if (process.env.NODE_ENV === 'production') {
	app.get('/admin', utils.ensureToken, (req, res, next) => {
		//todo:this.
		app.use(express.static(path.join(__dirname, 'client/adminPage'))).use(cors());
		app.use(express.static(path.join(__dirname, 'client/adminPage')));

		app.use(express.static('client/adminPage'));
		res.sendFile(path.resolve('client', 'adminPage', 'admin.html'));
	});
	// Serve any static files
	app.use(express.static(path.join(__dirname, 'client/public/build'))).use(cors());
	app.use(express.static('client/public/build'));
	app.use(express.static(path.join(__dirname, 'client/public')));

	// Express serve up index.html file if it doesn't recognize route

	app.get('*', (req, res) => {
		console.log('***************');
		res.sendFile(path.resolve('client', 'public', 'index.html'));
	});
}
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
//TODO: change this to prod mode..
