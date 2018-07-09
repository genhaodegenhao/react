import 'assets/css/global.less';
import 'assets/css/mod_css/commom.css';
import createApp from '../../utils/createApp';
import router from '../../routes/route';
import util from '../../utils/util';
import hrefUrl from '../../utils/authHref';
import ua from '../../utils/userAgent';
import padPlugin from '../../backend/keypad2';
import '../../assets/css/mod_css/keypad.less';
import { smfCustomLoadOpen, smfCustomLoadClose } from '../../backend/smfCustomLoad';

if (process.env.NODE_ENV === 'stage' && process.env.DEBUG) {
  const eruda = require('eruda');
  // open debug mode
  eruda.init();
}

padPlugin();

window.$$ = Dom7; //eslint-disable-line

window.globalParams = {};

window.app = createApp(router);

window.app.mainView = window.app.addView('.view-main', { domCache: true });

/* eslint-disable */

window.app.smfCustomLoadOpen = smfCustomLoadOpen;

window.app.smfCustomLoadClose = smfCustomLoadClose;

const url = window.location.href;
const value = util.GetQueryStringUrl(url);
const qrcode = value.qrCode;
sessionStorage.setItem('userAgent', ua.userAgent); // app容器类型

if(value.code || value.auth_code) {
  sessionStorage.setItem('authCode', JSON.stringify(value));
}

if (qrcode) {
  sessionStorage.setItem('transQrcode', qrcode);
  let redirectUrl = process.env.FETCH_ENV.redirectUrl;
  hrefUrl.redirectHrefUrl(redirectUrl);
  if (ua.userAgent === 'GENERAL_BROWSER') {
    let strUrl = util.handleShareBaseUrl();
    let baseStrUrl = '';
    if (strUrl === '/stag') {
      baseStrUrl = 'https://pay.99bill.com/stage2/html/smf/other.html';
    } else if (strUrl === '/prod') {
      baseStrUrl = 'https://pay.99bill.com/prod/html/smf/other.html';
    } else if (strUrl === '/sand'){
      baseStrUrl = 'https://pay.99bill.com/sandbox/html/smf/other.html';
    } else {
      baseStrUrl = 'https://pay.99bill.com/stage2/html/smf/other.html';
    }
    window.location.href = baseStrUrl;
  }
}
