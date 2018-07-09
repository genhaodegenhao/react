import { smfCustomLoadOpen, smfCustomLoadClose } from './mod/common/smfCustomLoad';

var createApp = require('./mod/createApp');
var ajax = require('./mod/common/ajax');
var padPlugin = require('./mod/common/keypad');

padPlugin();

var isConsole = false; //是否需要打印日志

if(isConsole ) {
	require('../vconsole.min.js');
}
window.$$ = Dom7;

window.globalParams = {};


var router = {
	'p/default.html': {
		mod: require('./mod/page/index'),
		title: '向商家付款'
	}
}

window.app = createApp(router);
app.mainView = app.addView('.view-main',{domCache: true});

window.app.smfCustomLoadOpen = smfCustomLoadOpen;

window.app.smfCustomLoadClose = smfCustomLoadClose;

if (location.hash == '') {
	app.mainView.router.load({
		url: 'p/default.html',
		animatePages: false,
		pushState: false
	})
};





