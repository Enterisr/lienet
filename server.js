/**************node modules************************/
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const dbUrl = process.env.MONGOLAB_URI;
const app = express();
const port = process.env.PORT || 6969;
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');

/**************app modules************************/
const utils = require('./utils');
const Mailer = require('./mailer');

require('dotenv').config();
const saltRounds = 10;

mailer = new Mailer('lienetmail@gmail.com');

app.use(cookieParser());
app.use(compression());
app.use(cors());
app.use(express.json());

app.get('/article', (req, res) => {
	MongoClient.connect(dbUrl, function(err, db) {
		if (!isNaN(req.query.num)) {
			const dbo = db.db('lienet');
			let requestedArticle = parseInt(req.query.num);
			dbo.collection('articles').findOne({ id: requestedArticle }, (err, articleObj) => {
				if (err) throw err;
				if (articleObj) {
					//saves in the articles colletion only the mail of the author,this is the identifier per author.
					dbo.collection('authors').findOne({ mail: articleObj.author }, (err, author) => {
						if (err) throw err;
						else {
							res.send({ ...articleObj, author });
							db.close();
						}
					});
				} else {
					res.send({ id: '-1', text: '404' });
				}
			});
		} else {
			res.send(new Error('500'));
		}
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
				.sort({ id: -1 })
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
					db.db('lienet').collection('authors').findOne({ mail: author.mail }, (err, matchedUser) => {
						if (err) throw err;
						else if (matchedUser !== null) {
							db.close();
							res.send({ status: 'failed', message: 'mail already registered' });
						} else {
							db
								.db('lienet')
								.collection('authors')
								.insertOne({ ...author, password: hash, isVerifiedMail: false }, (err, result) => {
									if (err) throw err;
									else {
										db.close();
										fs.readFile(
											path.join(__dirname, 'verificationMail.html'),
											'utf8',
											(err, content) => {
												if (err) throw err;
												else {
													mailer.SendMail({
														to: author.mail,
														subject: 'תודה שנרשמת לlienet',
														content
													});
													res.clearCookie('token');
													utils.generateTokenCookie(mail, res);
													res.send({ status: 'success', message: 'success' });
												}
											}
										);
									}
								});
						}
					});
				}
			});
		});
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.send({ status: 'failed', error: "server error :( try again later, maybe we'll fix it. maybe not" });
	}
});
app.get('verifyMail', utils.ensureToken, (req, res) => {
	let mail = utile.sanitize(req.mail);
	var setParams = { $set: { isVerifiedMail: true } };
	db.db('lienet').collection('authors').UpdateOne({ mail }, setParams, (err, result) => {
		if (err) throw err;
		else {
			db.close();
			res.status(200).send(result);
		}
	});
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
								utils.generateTokenCookie(mail, res);
								res.send({ status: 'success', message: 'success' });
							} else {
								res.send({ isSinged: 'failed', message: 'wrong password' });
							}
						});
					}
				});
			}
		});
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.send({ status: 'failed', message: 'the signIn failed :( maybe you should go cry in the corner, alone' });
	}
});
app.get('/adminDetails', utils.ensureToken, (req, res, next) => {
	MongoClient.connect(dbUrl, (err, db) => {
		if (err) console.log(err);
		else {
			let mail = utils.sanitize(req.mail);
			db.db('lienet').collection('authors').findOne({ mail }, { projection: { password: 0 } }, (err, result) => {
				if (err) throw err;
				else {
					db.close();
					res.status(200).send(result);
				}
			});
		}
	});
});
app.post('/postArticle', utils.ensureToken, async (req, res, next) => {
	let article = utils.sanitize(req.body);

	/*	MongoClient.connect(dbUrl, (err, db) => {
		if (err) console.log(err);
		else {
			let article = utils.sanitize(req.body);
			db.db('lienet').collection('articles').find().sort({ id: -1 }).limit(1).toArray((err, articleWithMaxId) => {
				const newId = articleWithMaxId[0].id + 1;
				db.db('lienet').collection('articles').insertOne({ id: newId, ...article }, (err, result) => {
					if (err) throw err;
					else {
						db.close();
						res.status(200).send(result);
					}
				});
			});
		}
	});*/
	try {
		client = await MongoClient.connect(dbUrl);
		const db = db('lienet');
		let authorsCollection = db.collection('authors');
		let articlesCollection = db.collection('articles');
		//  let result = await authorsCollection.find();
		let isVerified = await authorsCollection.findOne({ mail: article.mail }).isVerifiedMail;
		if (isVerified) {
			let maxId = await articlesCollection.find().sort({ id: -1 }).limit(1).toArray()[0];
			let res = await articlesCollection.insertOne({ id: maxId + 1, ...article });
			res.send({ status: 'success', message: 'the article published' });
		} else {
			res.send({ status: 'failed', message: 'you have to validate your email in the mail we sent you' });
		}
		return result.toArray();
	} catch (err) {
		console.error(err);
	} finally {
		// catch any mongo error here
		client.close();
	} // make sure to close your connection after
});
app.get('/admin', utils.ensureToken, (req, res, next) => {
	res.sendFile(path.resolve('admin', 'public', 'index.html'));
});

app.get('/', (req, res) => {
	res.sendFile(path.resolve('client', 'public', 'index.html'));
});
app.use('/admin', express.static(path.join(__dirname, 'admin/public')));
app.use('/admin', express.static(path.join(__dirname, 'admin/public/build')));

app.use(express.static(path.join(__dirname, 'client/public')));
app.use(express.static(path.join(__dirname, 'client/public/build')));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
