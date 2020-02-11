const Utils = {
	GetServerAdress: function GetServerAdress() {
		if (window.location.href.includes('localhost')) {
			const uri = new URL(window.location.href);
			uri.port = '6969';
			return uri.origin;
		} else {
			return document.location.origin;
		}
	}
};
export default Utils;
