const utils = require('./utils');
var url = require('url');
const puppeteer = require('puppeteer-extra');
let throng = require('throng');
let Queue = require('bull');
let Scarper = require('./scrapHeadLinePhoto');
let MongoClient = require('mongodb').MongoClient;
require('net').createServer().listen(); //keep alive... probably horrible way to do that...
const dbUrl = process.env.MONGOLAB_URI;
let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
let workers = process.env.WEB_CONCURRENCY || 2;
const scarpQueue = new Queue('scraper', REDIS_URL);

const scraper = {
	ScrapPhotoForArticle: async function ScrapPhotoForArticle(article) {
		console.log('*******" function ScrapPhotoForArticle"*******');
		let mostUsedWord = this.FindMostUsedWord(article.text);
		let url = await this.FindMatchingPhoto(mostUsedWord);
		return url;
	},
	FindMatchingPhoto: function FindMatchingPhoto(whatToSearch) {
		return new Promise(async (resolve, reject) => {
			console.log('*******opening browser.....*******');

			const browser = await puppeteer.launch({
				headless: false,
				slowMo: 0,
				ignoreHTTPSErrors: true,
				args: [
					/*'--proxy-server=213.6.225.134:61809',*/
					'--no-sandbox',

					'--disable-setuid-sandbox',
					' --disable-web-security',
					' -user-data-dir'
				]
			});
			var page = await browser.newPage();
			try {
				await page.setUserAgent(
					'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'
				);

				await page.goto(
					`https://www.bing.com/images/search?pq=benja&sc=8-5&cvid=86AB5949AF4B47A78E97801E933F04DC&sp=1&q=${whatToSearch}&qft=+filterui:license-L2_L3_L4&FORM=IRFLTR`
				);
				await page.waitForSelector('#b_content img');
				await page.click('#b_content img');
				/*await page.click('iframe');
				await page.waitForSelector('.imgContainer img');
				let bigImgSrc = await page.$eval('.imgContainer img', (elm) => {
					elm.focus();
					return elm.src;
				});
				console.log(bigImgSrc);*/
				let uri = await page.evaluate(() => location.href);

				var url_parts = url.parse(uri, true);
				var mediaurl = url_parts.query.mediaurl;
				resolve(mediaurl);
				console.log(`found url: ${mediaurl}`);
				return mediaurl;
			} catch (ex) {
				console.error(ex);
				console.log('trying again...');
				await FindMatchingPhoto(whatToSearch);
			} finally {
				browser.close();
			}
		});
	},
	FindMostUsedWord: function FindMostUsedWord(articleText) {
		let words = articleText.split(' ');
		let wordsMap = {};
		words.forEach((word) => {
			if (wordsMap.hasOwnProperty(word)) {
				wordsMap[word]++;
				return;
			}
			wordsMap[word] = 1;
		});
		let mostUsedWord = {};
		for (const word in wordsMap) {
			if ((wordsMap[word] > mostUsedWord.count || !mostUsedWord.count) && this.IsReallyWord(word)) {
				mostUsedWord = { wordString: word, count: wordsMap[word] };
			}
		}
		return mostUsedWord.wordString;
	},
	IsReallyWord: function IsReallyWord(word) {
		return word != 'את' && word != 'של' && word != 'על';
	}
};

scarpQueue.process(workers, async (job) => {
	const article = job.data;
	let suitablePhotoURL = await scraper.ScrapPhotoForArticle(article);
	conn = await MongoClient.connect(dbUrl);
	console.log(`opening db...`);
	const db = conn.db('lienet');
	let articlesCollection = db.collection('articles');
	articlesCollection.updateOne({ id: article.id }, { $set: { photoUrl: suitablePhotoURL } });
});

module.exports = scraper;
