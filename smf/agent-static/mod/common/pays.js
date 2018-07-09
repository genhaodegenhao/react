var payment = require('./payment'),
    util = require('../common/util'),
    ajax = require('../common/ajax'),
    platform = window.sessionStorage.getItem('userAgent');

var handleSubmit = function (openId) {
        payment.pay(
            {
                appId: 'coc-bill-api', //hard code
                traceId: util.generateUUID(),
                userAgent: window.sessionStorage.getItem('userAgent'),
                requestTime: sessionStorage.getItem("requestTime"),
                externalTraceNo: sessionStorage.getItem("externalTraceNo"),
                merchantCode:sessionStorage.getItem("merchantCode"),
                merchantId:sessionStorage.getItem("merchantId"),
                terminalId:sessionStorage.getItem("terminalId"),
                amt:sessionStorage.getItem("amt"),
                secretInfo:sessionStorage.getItem("secretInfo"),
                branchName:sessionStorage.getItem("branchName"),
                branchId:sessionStorage.getItem("branchId"),
                productInfo:sessionStorage.getItem("productInfo"),
                returnUrl:sessionStorage.getItem("returnUrl"),
                notifyUrl: sessionStorage.getItem("notifyUrl"),
                openId:openId,
                bizType: 3,
            },
            data=>{
                //console.log("成功",data);
                var returnUrl = sessionStorage.getItem("returnUrl")
                if(data.code == 0) {
                    if((returnUrl == "")|| (returnUrl == null)||(returnUrl == undefined)){
                        if(platform=="WX"){
                            WeixinJSBridge.call('closeWindow');
                        }else if(platform=="ALIPAY"){
                            AlipayJSBridge.call('closeWebview');
                        }
                    }else{
                        window.location.href = returnUrl
                    }
                }else{
                    if(platform=="WX"){
                        WeixinJSBridge.call('closeWindow');
                    }else if(platform=="ALIPAY"){
                        AlipayJSBridge.call('closeWebview');
                    }
                }
            },
            err=>{
                console.log("失败",err);
                var myApp = new Framework7();
                myApp.alert(err.rspMsg);
            }
        )

    };

module.exports = {
    pay:function(){
       var commonUrl = 'https://ebd.99bill.com/coc-bill-api/csb/useragent/queryOpenId';
       if(location.href.indexOf("sandbox")!=-1){
            commonUrl = 'https://ebd-sandbox.99bill.com/coc-bill-api/csb/useragent/queryOpenId';
        }
        let openId = '';
        // if(window.sessionStorage.getItem('userAgent') == "WX") {
            openId = sessionStorage.getItem('openId');
            if(openId == null) { //没有openId
                var code = "";
                var platform1 = window.sessionStorage.getItem('userAgent');
                if(platform1 == "WX"){
                    code = util.GetQueryString('code');
                }else if(platform1 == "ALIPAY"){
                    code = util.GetQueryString('auth_code');
                }else{
                    code = "";
                }

                let params = {
                    appId: 'coc-bill-api',
                    requestTime: util.getNowFormatDate(),
                    traceId: util.generateUUID(),
                    code: code,
                    userAgent:window.sessionStorage.getItem('userAgent')
                };

                let option = {
                    url:commonUrl,
                    contentType:'application/json',
                    data:params
                }

                ajax.post(option).then(function (data) {
                    openId = data.openId;
                    window.sessionStorage.setItem('openId', openId); //openId

                    handleSubmit(openId);
                    console.log(openId);
                })  
            }else {
                   handleSubmit(openId);
            }

        // } else {
        //    handleSubmit(openId);

        // }
        
    },

    

};