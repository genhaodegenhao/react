import { smfCustomLoadOpen, smfCustomLoadClose } from './mod/common/smfCustomLoad';

var createApp = require('./mod/createApp');

var ajax = require('./mod/common/ajax'),
    api = require('./mod/common/api');

var padPlugin = require('./mod/common/keypad2');

var isConsole = false; //是否需要打印日志

if(isConsole ) {
	require('../vconsole.min.js');
}

padPlugin();


window.$$ = Dom7;

window.globalParams = {};


var router = {
    'p/pay-result.html': {
        mod: require('./mod/page/pay-result')
    },
    'p/pre1': {
		mod: require('./mod/page/pay-pre1'),
		title: 'pre1'
	},
	'p/pre2': {
		mod: require('./mod/page/pay-pre2'),
		title: 'pre2'
	}
}

window.app = createApp(router);
app.mainView = app.addView('.view-main');

window.app.smfCustomLoadOpen = smfCustomLoadOpen;

window.app.smfCustomLoadClose = smfCustomLoadClose;

let erpMessage = JSON.parse(sessionStorage.getItem('businessInformation'));
console.log(erpMessage);

//erpMessage.erpSupport = 0;

if(erpMessage.erpSupport == '1') {
	app.mainView.router.load({
		url: 'p/pre1',
		animatePages: false,
		pushState: false
	})
} else {
	app.mainView.router.load({
		url: 'p/pre2',
		animatePages: false,
		pushState: false
	})
}

if (location.hash == '#/pay-result.html') {
	app.mainView.router.load({
		url: 'p/pay-result.html',
		animatePages: false,
		pushState: false
	})
}