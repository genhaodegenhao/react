var url = document.location.toString();
var arrUrl = url.split("//");
var start = arrUrl[1].indexOf("/");
var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符
if (relUrl.indexOf("?") != -1) {
  relUrl = relUrl.split("?")[0];
}
var str = relUrl.substring(0, 5);
if (str === '/stag') {
  // stage2环境下的生产配置
  var commonUrl = 'https://pay.99bill.com/stage2/html/smf/hat.html';
  var config = {
    wxAppId: 'wxae9267e08251c228', //微信appid
    zfbAppId: '2017090608586834', //支付宝appid
    appId: 'coc-bill-api',//应用appid
    redirectUrl: commonUrl,
    wsRedirectUrl: commonUrl
  }
} else if (str === '/prod') {
  // prod环境下的生产配置
  var commonUrl = 'https://pay.99bill.com/prod/html/smf/hat.html';
  var config = {
    wxAppId: 'wxae9267e08251c228',
    zfbAppId: '2017090608586834',
    appId: 'coc-bill-api',
    redirectUrl: commonUrl,
    wsRedirectUrl: commonUrl
  }
} else if (str === '/sand') {
  // prod环境下的生产配置
  var commonUrl = 'https://pay.99bill.com/sandbox/html/smf/hat.html';
  var config = {
    wxAppId: 'wxae9267e08251c228',
    zfbAppId: '2017090608586834',
    appId: 'coc-bill-api',
    redirectUrl: commonUrl,
    wsRedirectUrl: commonUrl
  }
} else {
  var commonUrl = 'http://127.0.0.1:3000/hat.html';
  var config = {
    wxAppId: 'wx7a7dd5f3fdc4bfdc', //微信appid
    zfbAppId: '2017090608586834', //支付宝appid
    appId: 'coc-bill-api',//应用appid
    redirectUrl: commonUrl,
    wsRedirectUrl: commonUrl
  }
}
