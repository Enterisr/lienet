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
		var bearerHeader = req.headers['authorization'];
		if (typeof bearerHeader !== 'undefined') {
			const bearer = bearerHeader.split(' ');
			const bearerToken = bearer[1];
			jwt.verify(bearerToken, process.env.JWT_SECRET, (err, result) => {
				if (err) {
					res.status(403).send('not authed!');
				} else {
					next();
				}
			});
		} else {
			res.send(403).send('not authed!');
		}
	}
};
module.exports = utils;
