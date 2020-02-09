const jwt = require('jsonwebtoken');
let utils = {
	//sanitize user input before tocuing the db..
	sanitize: function sanitize(v) {
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
	},
	selectRandomFromArray: function selectRandomFromArray(arr) {
		const rnd = Math.floor(Math.random() * arr.length);
		return arr[rnd];
	},
	ensureToken: function ensureToken(req, res, next) {
		const actualToken = req.cookies['token'];
		if (typeof actualToken !== 'undefined') {
			jwt.verify(actualToken, process.env.JWT_SECRET, (err, result) => {
				if (err || !result) {
					res.status(403).send('not authed!');
				} else if (result && (!result.access || result.access == 'unauthenticated')) {
					res.status(403).send('unauthenticated token');
				} else if (result && result.access == 'authenticated') {
					req.mail = result.mail;
					next();
				} else {
					res.status(500).send('this is weird...');
				}
			});
		} else {
			res.send(403).send('not authed!');
		}
	},
	generateTokenCookie: function generateToken(mail, res) {
		jwt.sign({ mail, access: 'authenticated' }, process.env.JWT_SECRET, { expiresIn: '2 hours' }, (err, token) => {
			let now = new Date();
			var expDate = now.setHours(now.getHours() + 2);
			res.cookie('token', token, {
				sameSite: true,
				maxAge: expDate,
				httpOnly: true,
				secure: process.env.NODE_ENV == 'production'
			});
		});
	},
	ValidateRegisterForm: function ValidateRegisterForm() {
		//validate same results an in the client
		statusMessage = '';
		const regexMailTest = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		const isNotReallyLong =
			Object.values(formInput).findIndex((elm) => {
				return elm.length > 100;
			}) == -1;
		const isEmailValid = regexMailTest.test(formInput.mail);
		const isPasswordValid = IsStrongPassword(formInput.password) && formInput.password.length >= 8;
		return isNotReallyLong && isEmailValid && isPasswordValid;
	}
};
module.exports = utils;
