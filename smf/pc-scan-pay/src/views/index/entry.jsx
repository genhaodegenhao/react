import 'assets/css/global.less';
import 'assets/css/mod_css/commom.css';
import createApp from '../../utils/createApp';
import router from '../../routes/route';
import { smfCustomLoadOpen, smfCustomLoadClose } from '../../backend/smfCustomLoad';
/* eslint-disable */
if (process.env.NODE_ENV === 'stage' && process.env.DEBUG) {
  const eruda = require('eruda');
  // open debug mode
  eruda.init();
}

window.$$ = Dom7; //eslint-disable-line

window.globalParams = {};

window.app = createApp(router);

window.app.mainView = window.app.addView('.view-main', { domCache: true });

window.app.smfCustomLoadOpen = smfCustomLoadOpen;

window.app.smfCustomLoadClose = smfCustomLoadClose;

const handleFetchData = () => {
    const _this = this;
    let payCode = '';
    if (window.sessionStorage.getItem('payCode') !== null && window.sessionStorage.getItem('payCode') !== undefined) {
      payCode = window.sessionStorage.getItem('payCode');
    }
    const option = {
      payCode: payCode,
    }
    let url = 'https://ebd.99bill.com/coc-bill-api/mam/3.0/scan/qrcode/scan';
    if (process.env.NODE_ENV !== 'development') {
      url = 'https://ebd.99bill.com/coc-bill-api/mam/3.0/scan/qrcode/scan';
    }

    if (process.env.NODE_ENV === 'sandbox') {
      url = 'https://ebd-sandbox.99bill.com/coc-bill-api/mam/3.0/scan/qrcode/scan'
    }
    window.$$.ajax({
      url: url,
      method: 'POST',
      data: JSON.stringify(option),
      contentType: 'application/json;charset=UTF-8',
      headers: {
        pubData: JSON.stringify({ 'c': 'H5', 'b': 'MKT', 'id': '102', 't': new Date() / 1 })
      },
      success: function (res) {
        const result = JSON.parse(res);
        const media = JSON.parse(result.media);
        window.media = media;
        window.orderAmount = media.orderAmount;
        window.payAmount = media.orderAmount;
        window.merchantorderNum = media.merchantorderNum;
        window.txnBeginTime = media.timer;
        window.innerOrderNo = media.innerOrderNo;
        console.log(JSON.parse(result.media));

        window.app.mainView.router.load({
          url: 'p/confirmorder.html',
          animatePages: false,
          pushState: false,
        });
        if (result.errCode === '00' || result.errCode === '10102' || result.errCode === '10101') {
          console.log(result);
          if (result.media === '' || result.media === 'null' || result.media === null) {
            window.app.mainView.router.load({
              url: 'p/order404.html',
              animatePages: false,
              pushState: false,
            });
            return;
          }
          const media = JSON.parse(result.media);
          window.media = media;
          window.orderAmount = media.orderAmount;
          window.payAmount = media.orderAmount;
          window.merchantorderNum = media.merchantorderNum;
          window.txnBeginTime = media.timer;
          window.innerOrderNo = media.innerOrderNo;
          console.log(JSON.parse(result.media));

          window.app.mainView.router.load({
            url: 'p/confirmorder.html',
            animatePages: false,
            pushState: true,
          });
        } else if (result.errCode === '10208' || result.errCode === '10226' || result.errCode === '10100' || result.errCode === '10103' || result.errCode === '03') {
          window.app.mainView.router.load({
            url: 'p/order404.html',
            animatePages: false,
            pushState: true,
          });
        } else {
          window.app.alert(result.errMsg);
          return;
        }
      },
      error: function (err) {
        console.log(err);
      },
    });
  }

handleFetchData();
