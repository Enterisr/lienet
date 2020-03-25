let throng = require('throng');
let Queue = require('bull');
let Scarper = require('./scrapHeadLinePhoto');
let MongoClient = require('mongodb').MongoClient;
require('net').createServer().listen(); //keep alive... probably horrible way to do that...
const dbUrl = process.env.MONGOLAB_URI;
let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
let workers = process.env.WEB_CONCURRENCY || 2;

let maxJobsPerWorker = 20;

module.exports.Process = Process;
function Process(article) {
	function start() {
		let scarpQueue = new Queue('scraper', REDIS_URL);
		scarpQueue.process(maxJobsPerWorker, async (article) => {
			let suitablePhotoURL = await Scarper.ScrapPhotoForArticle(article.text);
			conn = await MongoClient.connect(dbUrl);
			console.log(`opening db...`);
			const db = conn.db('lienet');
			let articlesCollection = db.collection('articles');
			articlesCollection.updateOne({ id: article.id }, { $set: { photoUrl: suitablePhotoURL } });
		});
	}
	throng({ workers, start });
}
