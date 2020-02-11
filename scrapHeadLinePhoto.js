const utils = require('./utils');
const puppeteer = require('puppeteer-extra');
const scraper = {
	FindMatchingPhoto: async function FindMatchingPhoto(whatToSearch) {
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
			let bigImgSrc = await page.$eval('img', (elm) => {
				return elm.src;
			});

			return bigImgSrc;
		} catch (ex) {
			console.error(ex);
			console.log('trying again...');
			FindMatchingPhoto(whatToSearch);
		} finally {
			browser.close();
		}
	},
	FindMostUsedWord: function FindMostUsedWord(article) {
		let words = article.split(' ');
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
			if (wordsMap[word] > mostUsedWord.count || !mostUsedWord.count) {
				mostUsedWord = { wordString: word, count: wordsMap[word] };
			}
		}
		return mostUsedWord;
	},
	ExtractWordsWithDefiniteness: function ExtractWordsWithDefiniteness(article) {
		//TOOD:
	}
};
console.log(scraper.FindMostUsedWord(' אני אוהב שוקולד ועוגות גבינה למרות שלגבי החלק של ה גבינה אני לא בטוח גבינה !'));
