import 'assets/css/global.less';
import 'assets/css/mod_css/commom.css';
import createApp from '../../utils/createApp';
import router from '../../routes/route';
import util from '../../utils/util';
import hrefUrl from '../../utils/authHref';
import ua from '../../utils/userAgent';
import { smfCustomLoadOpen, smfCustomLoadClose } from '../../backend/smfCustomLoad';

if (process.env.NODE_ENV === 'stage' && process.env.DEBUG) {
  const eruda = require('eruda');
  // open debug mode
  eruda.init();
}

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
const paycode = value.payCode;
sessionStorage.setItem('userAgent', ua.userAgent); // app容器类型

if(value.code || value.auth_code) {
  sessionStorage.setItem('authCode', JSON.stringify(value));
}

if (qrcode) {
  sessionStorage.setItem('transQrcode', qrcode);
  let redirectUrl = process.env.FETCH_ENV.redirectUrl;
  hrefUrl.redirectHrefUrl(redirectUrl);
  if (ua.userAgent === 'GENERAL_BROWSER') {
    window.app.mainView = window.app.addView('.view-main', { domCache: true });
    if (location.hash == '#!/p/queryordernum.html') {
      app.mainView.router.load({
        url: 'p/queryordernum.html',
        animatePages: false,
        pushState: false
      });
    }
  }
} else if (paycode) {
  sessionStorage.setItem('transPaycode', paycode);
  if (ua.userAgent === 'GENERAL_BROWSER') {
    let wsRedirectUrl = process.env.FETCH_ENV.createQrCodeRedirectUrl;
    hrefUrl.redirectHrefUrl(wsRedirectUrl);
    window.app.mainView = window.app.addView('.view-main', { domCache: true });
    if (location.hash == '#!/p/orderqrcode.html') {
      app.mainView.router.load({
        url: 'p/orderqrcode.html',
        animatePages: false,
        pushState: false
      });
    }
  } else {
    let wsRedirectUrl = process.env.FETCH_ENV.wsRedirectUrl;
    hrefUrl.redirectHrefUrl(wsRedirectUrl);
  }
}
