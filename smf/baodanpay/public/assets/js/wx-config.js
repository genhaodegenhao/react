var bindSourceType = '';
var stageSource = 'H5test';
// var prodSource = 'feikuaifu';
var prodSource = '99bill';
var sandSource = '99bill001';
var url = document.location.toString();
var arrUrl = url.split("//");

var start = arrUrl[1].indexOf("/");
var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符

if(relUrl.indexOf("?") != -1){
  relUrl = relUrl.split("?")[0];
}
var str = relUrl.substring(0,5);

switch (str) {
  case '/stag':
    bindSourceType = stageSource;
    break;
  case '/prod':
    bindSourceType = prodSource;
    break;
  case '/sand':
    bindSourceType = sandSource;
    break;
  default:
    bindSourceType = stageSource;
}
window.$$ = Dom7; //eslint-disable-line
var baseCommonUrl = 'https://ebd.99bill.com/coc-bill-api/wx/3.0/wxResource/wxConfig';
if (str === '/sand') {
  baseCommonUrl = 'https://ebd-sandbox.99bill.com/coc-bill-api/wx/3.0/wxResource/wxConfig';
}
// window.alert(baseCommonUrl);
window.$$.ajax({
  method: 'GET',
  url: baseCommonUrl,
  dataType: 'json',
  data: {
    bindSource: bindSourceType,
    url: encodeURIComponent(window.location.href.split('#')[0]),
  },
  contentType: 'application/json;charset=UTF-8',
  headers: {
    pubData: JSON.stringify({ c: 'H5', b: 'MKT', id: '998', t: new Date() / 1 }),
  },
  success: function(res) {
    // window.alert('config');
    if(res.errCode === '00') {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: res.appId, // 必填，公众号的唯一标识
        timestamp: res.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.noncestr, // 必填，生成签名的随机串
        signature: res.signature,// 必填，签名，见附录1
        jsApiList: ['scanQRCode', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });

      wx.error(function(res){
        console.log('wexinERo'+res);
      });
      wx.ready(function(res){
      });
    }
  }
});