/**************node modules************************/
require('dotenv').config();
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const dbUrl = process.env.MONGOLAB_URI;
const app = express();
const port = process.env.PORT || 6969;
let REDIS_URI = process.env.REDIS_URL;
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const fs = require('fs');
let Queue = require('bull');
/**************app modules************************/
const utils = require('./utils');
const Mailer = require('./mailer');
let ScarperQueue = new Queue('scraper', REDIS_URI);
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
						else if (author == null) {
							res.send({
								...articleObj,
								author: { firstName: 'מערכת', lastName: 'Lienet', mail: 'lienetmail@protonmail.com' }
							});
						} else {
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
				.find({}, { projection: { title: 1, id: 1, photoUrl: 1 } })
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
function SendMail() {
	fs.readFile(path.join(__dirname, 'verificationMail.html'), 'utf8', (err, content) => {
		if (err) throw err;
		else {
			utils.generateTokenCookie(author.mail, res, (token) => {
				let server =
					process.env.NODE_ENV == 'production' ? 'https://lieneteu.herokuapp.com' : 'http://localhost:6969';
				let params = {
					verification_id: verification_id.toString(),
					origin: server,
					token
				};
				mailer.SendMail({
					to: author.mail,
					subject: 'תודה שנרשמת לlienet',
					content,
					params: params
				});
				res.send({ status: 'success', message: 'success' });
			});
		}
	});
}
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
							//when the user verify thourgh email, verification_id becomes -1
							let verification_id = Math.floor(Math.random() * 1000000) + 1;
							db.db('lienet').collection('authors').insertOne({
								...author,
								password: hash,
								verification_id
							}, (err, result) => {
								if (err) throw err;
								else {
									db.close();
									SendMail();
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
app.get('/verifyMail', utils.ensureToken, (req, res) => {
	let mail = utils.sanitize(req.mail);
	MongoClient.connect(dbUrl, (err, db) => {
		if (err) throw err;
		else {
			db.db('lienet').collection('authors').findOne({ mail }, (err, author) => {
				if (err) throw err;
				else {
					const reqVerificationId = req.query.verification_id;
					if (author.verification_id == reqVerificationId) {
						const setParams = { $set: { verification_id: -1 } }; //-1 means user verified

						db.db('lienet').collection('authors').updateOne({ mail }, setParams, (err, result) => {
							if (err) throw err;
							else {
								db.close();
								res.status(200).send('המייל אומת בהצלחה!');
							}
						});
					}
				}
			});
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
								utils.generateTokenCookie(mail, res, () => {
									res.send({ status: 'success', message: 'success' });
								});
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
	try {
		conn = await MongoClient.connect(dbUrl);
		const db = conn.db('lienet');
		let authorsCollection = db.collection('authors');
		let articlesCollection = db.collection('articles');
		let user = await authorsCollection.findOne({ mail: req.mail });
		if (user.verification_id == -1) {
			let userWithMaxId = await articlesCollection.find().sort({ id: -1 }).limit(1).toArray();
			let maxId = parseInt(userWithMaxId[0].id);
			article.id = maxId + 1;
			let callback = async (jobId, data) => {
				console.log('got to callback: ');
				data = JSON.parse(data);
				conn = await MongoClient.connect(dbUrl);
				console.log(`opening db...`);
				const db = conn.db('lienet');
				let articlesCollection = db.collection('articles');
				articlesCollection.updateOne(
					{ id: parseInt(data['id']) },
					{ $set: { photoUrl: data['suitablePhotoURL'] } }
				);
			};
			console.log('adding to mission queue');
			await ScarperQueue.add({
				article
			});
			ScarperQueue.on('global:completed', callback);
			await articlesCollection.insertOne({
				photoUrl: 'https://lieneteu.herokuapp.com/logo_transparent.png',
				...article
				//temporary image until suitalbe image will be found... change this
			});
			res.send({ status: 'success', message: 'published', id: maxId + 1 });
		} else {
			res.send({ status: 'failed', message: 'mail not verified' });
		}
	} catch (err) {
		console.error(err);
	} finally {
		// catch any mongo error here
		conn.close();
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
app.listen(port, () => console.log(`lienet webapp running on port ${port}`));
