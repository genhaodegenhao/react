/* eslint-disable */
import ua from './userAgent';

module.exports = {
  redirectHrefUrl: function (url) {
    if (ua.userAgent === 'WX') {
      let appid = process.env.FETCH_ENV.wxAppId;
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + encodeURIComponent(url) + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
    } else if (ua.userAgent === 'ALIPAY') {
      let appid = process.env.FETCH_ENV.zfbAppId;
      window.location.href = 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=' + appid + '&scope=auth_base&redirect_uri=' + encodeURIComponent(url);
    } else {
      window.location.href = url;
    }
  },
};
