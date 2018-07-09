let ajax = function (params) {
	let app = app || new Framework7();
    //params: url, method, headers, postJSON, data, callback, timeout, invalidation
    return new Promise((resolve, reject) => {
        let ajaxOpt = {
            url: params.url,
            method: params.method,
            success: function (data) {
                window.app.smfCustomLoadClose();
                data = JSON.parse(data);
                // console.log(params.url, data);
                /* 请求通过 */
                if (data.rspCode === "0000" || data.errCode === "0000") {
                    params.callback && params.callback(data);
                    return resolve(data);
                }
                /* loginToken过期 跳转登录 */
                else if (data.errCode === "03" || data.errCode === "0013") {
                    app.session.del("loginToken");
                    app.session.del("payToken");
                    params.invalidation && params.invalidation();
                    return reject(data)
                }
                /* 非以上情况 执行error方法提示请求异常 */
                else if (params.error) {
                    params.error(data);
                    return reject(data);
                }

                else if (params.isReject) {
                    return reject(data)
                }
                /* 此处好像走不到... */
                else if (data.errMsg) {
                    app.alert(data.errMsg);
                    return reject(data);
                }
            },
            error: function (xhr, status) {
                window.app.smfCustomLoadClose();
                if (status === "timeout" && params.timeout) {
                    return params.timeout();
                } else {
                    return app.alert("请求异常: " + params.url + "[" + status + "]");
                }
            }
        };
        if (typeof params.postJSON == "undefined") {
            params.postJSON = true;
        }
        if (params.postJSON) {
            ajaxOpt.contentType = "application/json;charset=UTF-8";
        }
        if (params.headers) {
            ajaxOpt.headers = params.headers;
        }
        if (!params.invalidation) {
            params.invalidation = app.login;
        }
        params.data = params.data || {};
        ajaxOpt.data = params.postJSON ? JSON.stringify(params.data) : params.data;
        window.app.smfCustomLoadOpen();
        return setTimeout(function () {
            $$.ajax(ajaxOpt);
        }, 100);
    });
};
module.exports = {
    get: function (params) {
        params = params || {};
        params.method = "GET";
        return ajax(params);
    },
    post: function (params) {
        params = params || {};
        params.method = "POST";
        return ajax(params);
    }
};