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
								.insertOne({ ...author, password: hash }, (err, result) => {
									if (err) throw err;
									else {
										db.close();
										res.send({ status: 'success', message: 'success' });
										mailer.SendMail({
											to: author.mail,
											subject: 'תודה שנרשמת לlienet',
											content:
												'הרובוטים שלנו סורקים ברגעים אלו את חשבון הפייסבוק, הטוויטר והמייל שלך! במידה ולא נמצא שום דבר קוהרנטי, אתה בפנים!'
										});
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
								jwt.sign(
									{ mail, access: 'authenticated' },
									process.env.JWT_SECRET,
									{ expiresIn: '2 hours' },
									(err, token) => {
										let now = new Date();
										var expDate = now.setHours(now.getHours() + 2);
										res.cookie('token', token, {
											sameSite: true,
											maxAge: expDate,
											httpOnly: true,
											secure: process.env.NODE_ENV == 'production'
										});
										res.send({ status: 'success', message: 'success' });
									}
								);
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
app.post('/postArticle', utils.ensureToken, (req, res, next) => {
	MongoClient.connect(dbUrl, (err, db) => {
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
	});
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
