/* eslint-disable */
var CryptoJS = require('./tripledes.js').CryptoJS
CryptoJS.mode.ECB = (function () {
  var ECB = CryptoJS.lib.BlockCipherMode.extend();

  ECB.Encryptor = ECB.extend({
    processBlock: function (words, offset) {
      this._cipher.encryptBlock(words, offset);
    }
  });

  ECB.Decryptor = ECB.extend({
    processBlock: function (words, offset) {
      this._cipher.decryptBlock(words, offset);
    }
  });

  return ECB;
}());
/**加密（请求用） */
function encryptByDES(message) {
  if (!message){
    console.log(' msg is empty')
    return ''
  }
  message = message.toString()
 
  let key = sessionStorage.getItem('FINANCIAL_LOGINTOKEN');
  // let key = '99bill99bill';
  if (typeof loginToken != "undefined" && loginToken != null && loginToken != "") {
    key = '99bill99bill';
  }
  return encryptPost(message, key)
}
/**解密 （请求用）*/
function decryptByDES(message) {
  if (!message) {
    console.log(' msg is empty')
    return ''
  }
  // let key = '99bill99bill';
  // let loginToken = wx.getStorageSync('loginToken');
  // if (typeof loginToken != "undefined" && loginToken != null && loginToken != "") {
  //   key = loginToken
  // }
  let key = sessionStorage.getItem('FINANCIAL_LOGINTOKEN');
  if (typeof loginToken != "undefined" && loginToken != null && loginToken != "") {
    key = '99bill99bill';
  }
  return decryptionPost(message, key)
}

function encryptGet(message, key) {

  var keyHex = CryptoJS.enc.Utf8.parse(key);

  var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encodeURIComponent(encrypted.toString());
}

function encryptPost(message, key) {

  var keyHex = CryptoJS.enc.Utf8.parse(key);

  var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });

  return encodeURIComponent(encodeURIComponent(encrypted.toString()));
}



function decryptionPost(message, key) {
  //先转码
  var valueMessage = decodeURIComponent(decodeURIComponent(message.toString()));
  //对key进行处理
  var keyHex = CryptoJS.enc.Utf8.parse(key);
  var decrypted = CryptoJS.DES.decrypt(valueMessage, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  var decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
  //经过CryptoJS解密后，依然是一个对象，将其变成明文就需要按照Utf8格式转为字符串。
  // 解密后，需要按照Utf8的方式将明文转位字符串
  return decryptedStr;
}
function decryptionGet(message, key) {
  //先解码
  var valueMessage = decodeURIComponent(message.toString());
  //对key进行处理
  var keyHex = CryptoJS.enc.Utf8.parse(key);
  var decrypted = CryptoJS.DES.decrypt(valueMessage, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  var decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
  //经过CryptoJS解密后，依然是一个对象，将其变成明文就需要按照Utf8格式转为字符串。
  // 解密后，需要按照Utf8的方式将明文转位字符串
  return decryptedStr;
} 

module.exports = {
  encryptByDES: encryptByDES,
  decryptByDES: decryptByDES,
  //其余加解密方法暂时不需要export出来，已注释
  // encryptGet: encryptGet,
  // encryptPost: encryptPost,
  // decryptionPost: decryptionPost,
  // decryptionGet: decryptionGet,
}
