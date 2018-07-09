module.exports = function (reactComponent) {
	var app = new Framework7({
		pushState: true,
		reactComponent: reactComponent || {},
		preprocess: function(content, url, next) {
			return content;
		},
		material:true
	});
	app.session = require('./common/storage').session;
	return app;
}