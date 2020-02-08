const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const secret = require('dotenv').config();

class Mailer {
	/*
    generic handler I wrote so that i don't have to configure all this boilerplate everytime. 
    here is the tutorial about the configuration in the google cloud system.
    https://medium.com/@nickroach_50526/sending-emails-with-node-js-using-smtp-gmail-and-oauth2-316fe9c790a1 
    (currently only provide emailing thourgh gmail 
    */
	constructor(appAddress) {
		this.appAddress = appAddress;
		this.transporter = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
				type: 'OAuth2',
				user: appAddress,
				clientId: process.env.GMAIL_CLIENT_ID,
				clientSecret: process.env.GMAIL_CLIENT_SECRET,
				refreshToken: process.env.GMAIL_REFRESH_TOKEN,
				accessToken: this.SetGoogleAuth()
			}
		});
	}
	async SetGoogleAuth() {
		const oauth2Client = new OAuth2(
			process.env.GMAIL_CLIENT_ID, // ClientID
			process.env.GMAIL_CLIENT_SECRET, // Client Secret
			'https://developers.google.com/oauthplayground' // Redirect URL
		);
		oauth2Client.setCredentials({
			refresh_token: process.env.GMAIL_REFRESH_TOKEN
		});
		return await oauth2Client.getAccessToken();
	}
	SendMail({ to, subject, isHTML, content }) {
		this.transporter.sendMail({
			from: this.appAddress,
			to,
			subject,
			generateTextFromHTML: isHTML,
			html: content
		});
	}
}
module.exports = Mailer;
Mailer = new Mailer('lienetmail@gmail.com');
Mailer.SendMail({ to: 'drunktolstoy@gmail.com', subject: 'sup nigga', isHTML: true, content: '<b>ssssup</b>' });
