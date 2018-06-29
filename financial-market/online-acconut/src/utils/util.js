/* eslint-disable */

module.exports = {
  joinUrl: function (baseUrl, suffixUrl) {
    let newUrl = {};
    for (let k in suffixUrl) {
      if (suffixUrl.hasOwnProperty(k)) {
        newUrl[k] = baseUrl + suffixUrl[k];
      }
    }
    return newUrl;
  },
  formatNum: function (num, shift, decimal, signed, unit, fstr) {
    //num, decimal, shift 均为Number
    let arr, sign;
    if (!num && num !== 0) {
      return fstr || "--";
    }
    sign = (signed && num > 0) ? "+" : "";
    unit = unit || "";
    if (shift > 0) {
      num *= Math.pow(10, Math.abs(shift));
    } else if (shift < 0) {
      num /= Math.pow(10, Math.abs(shift));
    }
    //整数隔3位加","---保留小数点后"decimal"位(-1小数点不做处理)
    if (decimal >= 0) {
      num = parseFloat(num).toFixed(decimal);
    }
    arr = String(num).split(".");
    arr[0] = arr[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    return sign + (arr[0] + (arr[1] ? ("." + arr[1]) : "")) + unit;
  },
  formatDate: function (d, s, r1, r2) {
    //r取值示例: r1:"1-3", r2:"1-3"
    let a, a1, a2, i, len, rr1, rr2;
    if (typeof d == 'number') {
      d = new Date(d);
    } else if (typeof d == 'string') {
      d = new Date(d.replace(/-/g, "/"));
    } else {
      return "--";
    }
    a = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
    i = 1;
    len = a.length;
    for (; i < len; i++) {
      a[i] = a[i] < 10 ? "0" + a[i] : a[i];
    }
    if (r1) {
      rr1 = r1.split("-");
      a1 = a.slice(Number(rr1[0]) - 1, Number(rr1[1])).join(s);
    }
    if (r2) {
      rr2 = r2.split("-");
      a2 = a.slice(Number(rr2[0]) + 2, Number(rr2[1]) + 3).join(":");
    }
    if (r1 && r2) {
      a1 += " ";
    }
    return (a1 || "") + (a2 || "");
  },
  tenMillion: function (money) {
    //'千', '万' 格式转换, 用于限额
    let result;
    if (money >= 1000) {
      result = money >= 10000 ? parseInt(money / 10000) + "万" : parseInt(money / 1000) + "千";
    }
    else if (money >= 0) {
      result = money;
    }
    else {
      result = "无限额";
    }
    return result;
  },
  valiIntNum: function (str) {
    //验证数字,正整数
    return /^[1-9]\d*$/.test(str);
  },
  valiEmail: function (str) {
    return /^([\w\-\.])+@([\w\-])+((\.[\w\-]{2,3}){1,2})$/.test(str);
  },
  movePoint: function (num, scale) {
    if (scale == 0) {
      return num;
    }
    //补位
    function pad(str, scale) {
      let len = str.length,
          abs = Math.abs(scale);
      while (len < abs) {
        str = scale < 0 ? ("0" + str) : (str + "0");
        len++;
      }
      return str;
    }

    //拼接
    let str = String(num),
        ch = ".",
        sn = "",
        abs = Math.abs(scale),
        ps = str.split('.'),
        s1 = ps[0] ? ps[0] : "",
        s2 = ps[1] ? ps[1] : "",
        re = "";
    if (s1.slice(0, 1) == '-') {
      s1 = s1.slice(1);
      sn = '-';
    }
    if (scale < 0) {
      if (s1.length <= abs) {
        ch = "0.";
        s1 = pad(s1, scale);
      }
      re = sn + s1.slice(0, -abs) + ch + s1.slice(-abs) + s2;
    }
    else {
      if (s2.length <= abs) {
        ch = '';
        s2 = pad(s2, scale);
      }
      re = sn + s1 + s2.slice(0, abs) + ch + s2.slice(abs);
    }
    return Number(re);
  },

  /**
   * [getNowFormatDate 生成当前时间]
   */
  getNowFormatDate: function () {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getMinutes();

    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (hours >= 0 && hours <= 9) {
      hours = "0" + hours;
    }
    if (minutes >= 0 && minutes <= 9) {
      minutes = "0" + minutes;
    }
    if (seconds >= 0 && seconds <= 9) {
      seconds = "0" + seconds;
    }

    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + hours + seperator2 + minutes + seperator2 + seconds;
    return currentdate;
  },

  /**
   * [GetQueryString 获取url参数]
   * @param {[type]} name [description]
   */
  GetQueryString: function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
  },
  /**
   * [GetQueryStringUrl 获取url参数]
   * @param {[type]} name [description]
   */
  GetQueryStringUrl: function(url) {
    var queryObj={};
    var reg=/[?&]([^=&#]+)=([^&#]*)/g;
    var querys=url.match(reg);
    if(querys){
      for(var i in querys){
        var query=querys[i].split('=');
        var key=query[0].substr(1),
            value=decodeURIComponent(query[1]);
        queryObj[key]?queryObj[key]=[].concat(queryObj[key],value):queryObj[key]=value;
      }
    }
    return queryObj;
  },
  /**
   * [handleChangeString 字符串替换*]
   * @param {[type]} name [description]
   */
  handleChangeString: function(str, frontLen, endLen) {
    let len = str.length - frontLen - endLen;
    let xing = '';
    for (var i=0; i<len; i++) {
      xing+='*';
    }
    return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
  },
  /**
   * [handleChangeString 字符串替换*]
   * @param {[type]} name [description]
   */
  handleShareBaseUrl: function() {
    let url = document.location.toString();
    let arrUrl = url.split("//");
    let start = arrUrl[1].indexOf("/");
    let relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符
    if (relUrl.indexOf("?") != -1) {
      relUrl = relUrl.split("?")[0];
    }
    let str = relUrl.substring(0, 5);
    return str;
  },
  /**
   * [addPreZero 补0]
   */
  addPreZero: function (num){
    if (num < 10) {
      num = "0" + num;
    }
    return num;
  },
  changeFormatDate: function(dateString) {
    let pattern = /(\d{4})(\d{2})(\d{2})/;
    let formatedDate = dateString.replace(pattern, '$1/$2/$3');
    return formatedDate;
  },
  toDecimal2(x) {
    let f = parseFloat(x);
    if (isNaN(f)) {
      return false;
    }
    f = Math.round(x*100)/100;
    let s = f.toString();
    let rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + 2) {
      s += '0';
    }
    return s;
  }
};
