module.exports = function (reactComponent) {
	var app = new Framework7({
		pushState: true,
		reactComponent: reactComponent || {},
		preprocess: function(content, url, next) {
			return content;
		},
    	onPageAfterAnimation: function (app, page) {
    		document.title = $$(page.container).find('.page-content').data('title');
    	},
		material:true
	});

	app.session = require('./common/storage').session;
	return app;
}