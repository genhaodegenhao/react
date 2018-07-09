/* eslint-disable */
let userAgent = 'GENERAL_BROWSER';
let ua = window.navigator.userAgent.toLowerCase();
if (ua.match(/MicroMessenger/i) == 'micromessenger') {
  userAgent = 'WX';
} else if (ua.match(/AlipayClient/i) == 'alipayclient') {
  userAgent = 'ALIPAY';
}
module.exports = {
  userAgent: userAgent
};
