const utils = require('./utils');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const defaultViewport = {
	height: 1920,
	width: 1280
};

async function run() {
	//TODO: fix this
	try {
		const browser = await puppeteer.launch({
			headless: true,
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
		await page.goto(
			'https://www.google.com/search?tbs=sur:fm&tbm=isch&sxsrf=ACYBGNR-ziUa_ieA6zX59jHlkGtzDSTj7Q:1580555617726&q=%D7%91%D7%99%D7%91%D7%99+%D7%A0%D7%AA%D7%A0%D7%99%D7%94%D7%95&chips=q:%D7%91%D7%99%D7%91%D7%99+%D7%A0%D7%AA%D7%A0%D7%99%D7%94%D7%95,online_chips:benyamin+netanyahu&sa=X&ved=0ahUKEwjksZHBnLDnAhXGY1AKHUjUDxUQ4lYIMCgF&biw=1920&bih=973&dpr=1'
		);

		await page.waitForSelector('img');
		let img = await page.evaluateHandle(() => document.querySelector('img[alt="תוצאת תמונה עבור ביבי נתניהו"]'));
		await ChangeViewport(page);
		await page.waitFor(10000);
		await img.click();
		let Bigimg = await page.evaluateHandle(() => document.querySelector('.n3VNCb'));
		await page.waitFor(10000);

		await Bigimg.screenshot({ path: 'headlinePhoto.png' });
		console.log('scraped image');
		browser.close();
		return;
	} catch (ex) {
		console.error(ex);
		console.log('trying again...');
		run();
	}
}
run();
async function ChangeViewport(page) {
	const bodyHandle = await page.$('body');
	const boundingBox = await bodyHandle.boundingBox();
	const newViewport = {
		width: Math.max(defaultViewport.width, Math.ceil(boundingBox.width)),
		height: Math.max(defaultViewport.height, Math.ceil(boundingBox.height))
	};
	await page.setViewport(Object.assign({}, defaultViewport, newViewport));
}
