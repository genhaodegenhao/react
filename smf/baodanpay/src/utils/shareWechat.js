/* eslint-disable */
import util from './util';
import shareIcon from '../assets/img/baodan/shareicon.png';

module.exports = {
  shareWechatLink: function (shareqrcode, merchantorderNum) {
    window.$$.ajax({
      method: 'GET',
      url: process.env.FETCH_ENV.fetchUrl + '/base/3.0/system/time',
      contentType: 'application/json;charset=UTF-8',
      headers: {
        pubData: JSON.stringify({ 'c': 'H5', 'b': 'MKT', 'id': '102', 't': new Date() / 1 })
      },
      success: function succ(resp) {
        const data = JSON.parse(resp);
        const mediaData = {
          qrCode: shareqrcode,
          merchantorderNum: merchantorderNum,
          timer: data.systemTime,
        };
        const option = {
          bizCode: 'sample',
          type: '1',
          deviceid: 'ffffffff-e3df-665a-ffff-ffffc4d418a1',
          media: JSON.stringify(mediaData),
        };
        window.$$.ajax({
          method: 'POST',
          url: process.env.FETCH_ENV.fetchUrl + '/mam/3.0/scan/qrcode/create',
          contentType: 'application/json;charset=UTF-8',
          data: JSON.stringify(option),
          headers: {
            pubData: JSON.stringify({ 'c': 'H5', 'b': 'MKT', 'id': '102', 't': new Date() / 1 })
          },
          success: function success(res) {
            const data = JSON.parse(res);
            if (data.errCode === '00') {
              sessionStorage.setItem('payCode', data.payCode);
              let str = util.handleShareBaseUrl();
              let baseShareUrl = '';
              if (str === '/stag') {
                baseShareUrl = 'https://pay.99bill.com/stage2/html/smf/baodanpay.html#!/?payCode=';
              } else if (str === '/prod') {
                baseShareUrl = 'https://pay.99bill.com/prod/html/smf/baodanpay.html#!/?payCode=';
              } else if(str === '/sand'){
                baseShareUrl = 'https://pay.99bill.com/sandbox/html/smf/baodanpay.html#!/?payCode=';
              }else {
                baseShareUrl = 'https://pay.99bill.com/stage2/html/smf/baodanpay.html#!/?payCode=';
              }
              let share = {
                title: '保单付费',
                desc: '请您完成保单付费',
                link: baseShareUrl + data.payCode,
                imgUrl: shareIcon,
              };
              window.wx.ready(function () {
                window.wx.onMenuShareAppMessage({
                  title: share.title,
                  desc: share.desc,
                  link: share.link,
                  imgUrl: share.imgUrl,
                  type: '', // 分享类型，music、video或link，不填默认为link
                  dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                  success: function ss() {
                  },
                  cancel: function cancel() {
                  },
                  fail: function fail() {
                  },
                });
              });
            }
          },
          error: function err(res) {
            window.app.alert(res);
          },
        });
      },
      error: function err(res) {
        window.app.alert(res);
      },
    });
  },
};
