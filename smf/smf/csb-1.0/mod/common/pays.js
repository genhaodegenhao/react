var payment = require('./payment'),
    util = require('../common/util'),
    ajax = require('../common/ajax'),
    businessInformation = JSON.parse(sessionStorage.getItem('businessInformation')),
    platform = window.sessionStorage.getItem('userAgent');

var handleSubmit = function (openId,numberMoney) {
        payment.pay(
            {
                appId: 'coc-bill-api', //hard code
                requestTime: util.getNowFormatDate(),
                traceId: util.generateUUID(),
                externalTraceNo: util.generateUUID(),
                userAgent: window.sessionStorage.getItem('userAgent'),
                qrCode:sessionStorage.getItem("qrCode"),
                merchantCode:businessInformation.merchantCode,
                merchantName:businessInformation.merchantName,
                merchantId:businessInformation.merchantId,
                terminalId:businessInformation.terminalId,
                branchName:businessInformation.branchName,
                amt:parseFloat(numberMoney),
                openId:openId,
                bizType: parseInt(businessInformation.bizType),

            },
            data=>{
                //console.log("成功",data);
                if(data.code == 0 || data.code == -1) {
                    if(platform=="WX"){
                        WeixinJSBridge.call('closeWindow');
                    }else if(platform=="ALIPAY"){
                        AlipayJSBridge.call('closeWebview');
                    }
                    
                }
                if(data.code == -4){
                    if(platform == "WX"){
                        $$(".picker-keypad-pay").addClass("btn-ok-weixin").removeClass("picker-keypad-weixin-paying").find("span").text("确认支付")
                    }else if(platform == "ALIPAY"){
                         $$(".picker-keypad-pay").addClass("btn-ok-alipay").removeClass("picker-keypad-alipay-paying").find("span").text("确认支付")
                    }else{     
                        $$(".picker-keypad-pay").addClass("btn-ok-general").removeClass("picker-keypad-general-paying").find("span").text("确认支付")
                    }
                }
            },
            err=>{
                console.log("失败",err);
                var myApp = new Framework7();
                if(platform == "WX"){
                    $$(".picker-keypad-pay").addClass("btn-ok-disabled-wx").removeClass("picker-keypad-weixin-paying").find("span").text("支付失败")
                }else if(platform == "ALIPAY"){
                     $$(".picker-keypad-pay").addClass("btn-ok-disabled-alipay").removeClass("picker-keypad-alipay-paying").find("span").text("支付失败")
                }else{     
                    $$(".picker-keypad-pay").addClass("btn-ok-disabled").removeClass("picker-keypad-general-paying").find("span").text("支付失败")
                }
                myApp.alert(err.rspMsg,function(){
                    if(platform == "WX"){
                        $$(".picker-keypad-pay").addClass("btn-ok-weixin").removeClass("btn-ok-disabled-wx").find("span").text("确认支付")
                    }else if(platform == "ALIPAY"){
                        $$(".picker-keypad-pay").addClass("btn-ok-alipay").removeClass("btn-ok-disabled-alipay").find("span").text("确认支付")
                    }else{     
                        $$(".picker-keypad-pay").addClass("btn-ok-general").removeClass("btn-ok-disabled").find("span").text("确认支付")
                    }
                });
            }
        )

    };

module.exports = {
    pay:function(numberMoney){
       
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
                    url:'https://ebd.99bill.com/coc-bill-api/csb/useragent/queryOpenId',
                    contentType:'application/json',
                    data:params
                }

                ajax.post(option).then(function (data) {
                    openId = data.openId;
                    window.sessionStorage.setItem('openId', openId); //openId

                    handleSubmit(openId,numberMoney);
                    console.log(openId);
                })  
            }else {
                   handleSubmit(openId,numberMoney);
            }

        // } else {
        //    handleSubmit(openId,numberMoney);

        // }
        
    },

    

};