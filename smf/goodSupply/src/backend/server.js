let $$ = Dom7;
let urlA = '';

if (location.port !== "3000") {
  urlA = '';
} else {
  urlA = 'http://10.157.165.109:8888/';
  // urlA = 'http://192.168.1.24/sina/cur/exchange/rates';
}
function ajax(data) {
  console.log(data);
  let opts = Object.assign({
    method: 'GET',
    baseURL: urlA,
    headers: {},
    responseType: 'json',
    loader: true,
  }, data)
  opts.url = opts.baseURL + data.url;
  opts.success = (response) => {
    response = JSON.parse(response);
    if (opts.loader) {
      window.app.hidePreloader();
    }
    data.success(response);
  }
  if (opts.loader) {
    window.app.showPreloader();
  }
  $$.ajax(opts);
}
export default ajax;