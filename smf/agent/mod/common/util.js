import {session} from './storage';

module.exports = {
    joinUrl       : function (baseUrl, suffixUrl) {
        let newUrl = {};
        for (let k in suffixUrl) {
            if (suffixUrl.hasOwnProperty(k)) {
                newUrl[k] = baseUrl + suffixUrl[k];
            }
        }
        return newUrl;
    },
    formatNum     : function (num, shift, decimal, signed, unit, fstr) {
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
    formatDate    : function (d, s, r1, r2) {
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
    tenMillion    : function (money) {
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
    valiIntNum    : function (str) {
        //验证数字,正整数
        return /^[1-9]\d*$/.test(str);
    },
    valiEmail     : function (str) {
        return /^([\w\-\.])+@([\w\-])+((\.[\w\-]{2,3}){1,2})$/.test(str);
    },
    // setTitle  : function (title, container) {
    //     if (!title) {
    //         return false;
    //     }
    //     document.title = title;
    //     KQB.native("setPageTitle", {title: title});
    //     container && container.data("title", title);
    //     //
    //     if (KQB.Env.FeiFan && ffanSDK) {
    //         if (ffanSDK.setTitle) {
    //             ffanSDK.setTitle({
    //                 "data": {
    //                     "title": title
    //                 }
    //             });
    //         }
    //         else {
    //             ffanSDK.ready(function () {
    //                 ffanSDK.setTitle({
    //                     "data": {
    //                         "title": title
    //                     }
    //                 });
    //             });
    //         }
    //     }
    // },
    openPage      : function (url, next) {
        //当前页面新开一个流程(url)，并指定新开流程完毕之后的回跳链接（如没有传入回跳链接，默认回到当前页面）
        let hash      = (url.match(/#.*/) || [""])[0],
            modSearch = (url.indexOf("?") == -1 ? "?" : "&") + "nextPage=" + encodeURIComponent(next || location.href) + hash;
        KQB.Env.KQ ? KQB.native("openNewPage", {"targetUrl": url}) : location.assign((hash ? url.replace(hash, "") : url) + modSearch);
    },
    closePage     : function (direct, prev) {
        //关闭当前流程，回到前一个流程(prev)，如没有传入回到nextPage或者当前流程的首页
        let search   = location.search,
            nextPage = decodeURIComponent((search.match(/nextPage=[^&]*/) || [""])[0].replace(/nextPage=/, "")),
            curLink  = location.href.replace(/[#].*/, ""),
            link     = prev || nextPage || curLink;
        direct = direct || (search.match(/direct=[^&]*/) || [""])[0].replace(/direct=/, "");
        KQB.Env.KQ && !nextPage && !direct && KQB.native("openNewPage", {"targetUrl": link});
        (KQB.Env.KQ && !nextPage) ? KQB.native("goback", {}) : location.assign(link);
    },
    movePoint     : function (num, scale) {
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
            ch  = ".",
            sn  = "",
            abs = Math.abs(scale),
            ps  = str.split('.'),
            s1  = ps[0] ? ps[0] : "",
            s2  = ps[1] ? ps[1] : "",
            re  = "";
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
    bindViewUpdate: function (callback) {
        if (!KQB.Env.KQ) {
            return false;
        }
        //打开新view后，通过local数据刷新页面
        app.local.set("view_update", false);
        let timer = setInterval(function () {
            if (app.local.get("view_update")) {
                app.local.set("view_update", false);
                callback && callback();
            }
        }, 1000);

        function clear() {
            clearInterval(timer);
            $$("body").off("touchstart", clear);
        }

        $$("body").on("touchstart", clear);
    },
    getLoginToken(){
        const loginToken = session.get("loginToken");

        if(!loginToken){
            throw new Error('loginToken is not set.')
        }

        return loginToken;
    },
    /**
     * 生成uuid
     */
    generateUUID(){
        let d = +new Date()
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0
            d = Math.floor(d/16)
            return (c=='x' ? r : (r&0x3|0x8)).toString(16)
        })
        return uuid
    },
    /**
     * [getNowFormatDate 生成当前时间]
     */
    getNowFormatDate:function() {
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
     GetQueryString : function(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
};