import 'assets/css/global.less';
import 'assets/css/mod_css/commom.css';
import createApp from '../../utils/createApp';
import router from '../../routes/route';
import { smfCustomLoadOpen, smfCustomLoadClose } from '../../backend/smfCustomLoad';
/* eslint-disable */
// if (process.env.NODE_ENV !== 'prod' && process.env.DEBUG) {
//   const eruda = require('eruda');
//   // open debug mode
//   eruda.init();
// } else {
//   const eruda = require('eruda');
//   eruda.init();
// }
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

var handleTxnTime = function(time) {
    time = time + '';
    const year= time.slice(0, 4);
    const month = time.slice(4, 6);
    const day = time.slice(6, 8);
    return year + '-' + month + '-' + day;
  }
console.log(0);
var handleFetchData = function() {
    const option = {
      billOrderNo: window.sessionStorage.getItem('billOrderNo'),
      merchantCode: window.sessionStorage.getItem('merchantCode'),
    }
    let url = 'http://localhost:9000/api';
    if (process.env.NODE_ENV !== 'development') {
      url = 'https://ebd.99bill.com/coc-bill-api/pay/3.0/hat/orderDetail';
      // url = 'http://192.168.47.40:8127/coc-bill-api/pay/3.0/hat/orderDetail';
    }
    url = 'https://ebd.99bill.com/coc-bill-api/pay/3.0/hat/orderDetail';
    if (process.env.NODE_ENV === 'sandbox') {
      url = 'https://ebd-sandbox.99bill.com/coc-bill-api/pay/3.0/hat/orderDetail'
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
        if (result.errCode !== '00') {
          window.app.alert(result.errMsg);
          return;
        }
        console.log(result);

        const nowTime = (new Date()).getTime();
        const expireTime = (new Date(result.txnExpireTime.slice(0, 4), parseInt(result.txnExpireTime.slice(4, 6)) - 1, result.txnExpireTime.slice(6, 8), result.txnExpireTime.slice(8, 10), result.txnExpireTime.slice(10, 12), result.txnExpireTime.slice(12))).getTime();
        const obj = {
          "orderStatus": result.orderStatus,
          "merchantName": result.merchantName,
          "merchantorderNum": result.outTradeNo,
          "paymoney": parseInt(result.payAmount)/100,
        };
        window.sessionStorage.setItem('resultDetail', JSON.stringify(obj));

        // 处理functionCode
        let isFunctionCodeError = false;
        window.sessionStorage.setItem('isFunctionCodeError', false);
        if (result.functionCode == '10') {
          window.sessionStorage.setItem('bizType', 1);
        } else if (result.functionCode == '14') {
          window.sessionStorage.setItem('bizType', 2);
        } else {
          isFunctionCodeError = true;
          window.sessionStorage.setItem('isFunctionCodeError', true);
        }

        if (result.orderStatus !== '0' || nowTime > expireTime || isFunctionCodeError) {
          // if (parseInt(result.merchantCode) !== parseInt(window.sessionStorage.getItem('merchantCode'))) {
          //   window.sessionStorage.setItem('hasMerchantCodeError', 'yes')
          // }

          if (nowTime > expireTime) {
            window.sessionStorage.setItem('hasExpireDate', 'yes')
          }

          if (result.orderStatus !== '0') {
            window.sessionStorage.setItem('orderStatus', result.orderStatus + '');
          }
          window.sessionStorage.setItem('hasPay', 'no');
          app.mainView.router.load({
            url: 'p/ordersuccess.html',
            animatePages: false,
            pushState: false
          });
        } else {
          console.log(1);
          window.inObj = {
            merchantName: result.merchantName,
            orderAmount: parseInt(result.orderAmount) / 100,
            outTradeNo: result.outTradeNo,
            payAmount: parseInt(result.payAmount) / 100,
            txnBeginTime: handleTxnTime(result.txnBeginTime),
            hatInfo: result,
          };
          console.log(window.inObj);
          app.mainView.router.load({
            url: 'p/confirmorder.html',
            animatePages: false,
            pushState: false
          });
          console.log(2);
        }
      },
      error: function (err) {
        console.log(-1);
        console.log(err);
      },
    });
  }

handleFetchData();

