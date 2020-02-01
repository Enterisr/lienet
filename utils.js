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
	}
};
module.exports = utils;
