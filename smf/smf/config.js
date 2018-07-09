/**
 * author:shimin.chen;
 * time:2017/8/31;
 * description:配置文件;
 */

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
  var commonUrl = 'https://pay.99bill.com/stage2/html/smf';
  var config = {
    // wxAppId:'wx7a7dd5f3fdc4bfdc', //微信appid
    wxAppId:'wxae9267e08251c228',
    zfbAppId:'2017090608586834', //支付宝appid
    appId:'coc-bill-api',//应用appid
    msfRedirectUrl:commonUrl + '/msf-1.0/default.html',//码上付重定向地址
    csbRedirectUrl:commonUrl + '/csb-1.0/default.html'//c扫b重定向地址
  }
} else if (str === '/prod') {
  // prod环境下的生产配置
  var commonUrl = 'https://pay.99bill.com/prod/html/smf';
  var config = {
    wxAppId:'wxae9267e08251c228',
    zfbAppId:'2017090608586834',
    appId:'coc-bill-api',
    msfRedirectUrl:commonUrl + '/msf-1.0/default.html',
    csbRedirectUrl:commonUrl + '/csb-1.0/default.html'
  }
} else {
  var commonUrl = 'https://pay.99bill.com/stage2/html/smf';
  var config = {
    wxAppId:'wxae9267e08251c228',
    zfbAppId:'2017090608586834', //支付宝appid
    appId:'coc-bill-api',//应用appid
    msfRedirectUrl:commonUrl + '/msf-1.0/default.html',//码上付重定向地址
    csbRedirectUrl:commonUrl + '/csb-1.0/default.html'//c扫b重定向地址
  }
}
