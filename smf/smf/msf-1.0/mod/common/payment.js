/**
 * @author jinhailiang
 * @date 2017-08-22
 * 支付功能
 */
module.exports = (() => {

    let isMock = false
    let successCb = () => {}
    let failureCb = () => {}

    //创建订单(预下单)
    const createOrder = (params) => {
        const ajax = require('./ajax.js')
        // //模拟入参
        // let params = {
        //     qrCode: "992565356485350975",
        //     merchantCode: "10012310536",
        //     merchantName: "测试企业单位",
        //     merchantId: "812011145110001",
        //     terminalId: "55555549",
        //     branchId: "",
        //     branchName: "",
        //     unitInfo: "",
        //     erpInfo: "",
        //     amt: "1.10",
        //     openId: "",
        //     returnUrl: ""
        // }
        let ajaxParam = {
            url: 'https://ebd.99bill.com/coc-bill-api/csb/order/create',
            data: params,
            isReject: true
        }
        if (!isMock) {
            return ajax.post(ajaxParam)
        } else {
            return new Promise((resolve, reject)=>{
                let mockData = {
                    appType: "ALIPAYCSB",
                    externalTraceNo: "d1a6b9dd-66a6-4e65-8c13-dba8876c0760",
                    merchantId: "812011145110001",
                    payUrl: "https://qr.alipay.com/bax006484xmoqblfqfsg000a",
                    rspCode: "0000",
                    rspMsg: "成功",
                    terminalId: "55555549",
                    userAgent: "ALIPAY"
                }
                resolve(mockData)
            })
        }
    }

    //检查app类型
    const checkAppType = () => {
        let appType = 'GENERAL_BROWSER'
        if (/MicroMessenger/.test(window.navigator.userAgent)) {
            appType = 'WX'
        } else if (/AlipayClient/.test(window.navigator.userAgent)) {
            appType = 'ALIPAY'
        }
        return appType
    }

    //调用支付宝/微信支付功能
    const nativePay = (payParams) => {
        return new Promise((resolve, reject)=> {
            let userAgent = checkAppType()
            //应保证支付宝客户端中使用支付宝支付，微信客户端使用微信支付(但目前appType是根据预下单接口的userAgent来决定的)
            //而前端限制了客户端只能选择合适的支付类型，所以这里只需要根据userAgent或是接口返回的appType来选择支付方式
            if ('ALIPAY' == userAgent && ('ALIPAYCSB' == payParams.appType || 'ALIPAYSW' == payParams.appType)) {
                aliPay(payParams, resolve, reject)
            } else if ('WX' == userAgent && 'WECHATOA' == payParams.appType) {
                wxPay(payParams, resolve, reject)
            } else {
                reject({code: -2, msg: '当前客户端与支付类型不符'})
            }
        })
    }

    //微信支付
    const wxPay = (payParams, resolve, reject) => {
        if (window.WeixinJSBridge) {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest',
                {
                    "appId": payParams.appId, //公众号名称，由商户传入
                    "timeStamp": payParams.timeStamp, //时间戳，自1970年以来的秒数
                    "nonceStr": payParams.nonceStr, //随机串
                    "package": payParams.orderInfo, //订单详情扩展字符串
                    "signType": payParams.signType, //微信签名方式：
                    "paySign": payParams.paySign //微信签名
                },
                res => {
                    //app.alert(JSON.stringify(res));
                    if (res.err_msg == "get_brand_wcpay_request:ok") { //使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                        resolve({...{code: 0, msg: '微信支付成功', appType: payParams.appType}, ...res})
                    } else if (res.err_msg == "get_brand_wcpay_request:cancel"){
                        resolve({...{code: -4, msg: '支付过程中用户取消', appType: payParams.appType}, ...res})
                    } else {
                        resolve({...{code: -1, msg: '微信支付失败', appType: payParams.appType}, ...res})
                    }
                }
            )
        } else {
            reject({code: -3, msg: 'WeixinJsbridge未定义', appType: payParams.appType})
        }
    }

    //支付宝支付
    const aliPay = (payParams, resolve, reject) => {
        if (window.AlipayJSBridge) {
            AlipayJSBridge.call("tradePay", {
                tradeNO: payParams.tradeNo
            }, res => {
                if (res.resultCode == '9000') {
                    resolve({...{code: 0, msg: '支付宝支付成功', appType: payParams.appType}, ...res})
                } else if (res.resultCode == '6001') {
                    resolve({...{code: -4, msg: '支付过程中用户取消', appType: payParams.appType}, ...res})
                } else if (res.resultCode == '6004' || res.resultCode == '8000') {
                    //包含支付过程中网络出错， 暂时未拿到支付结果；和后台获取支付结果超时，暂时未拿到支付结果
                    resolve({...{code: -5, msg: '支付结果未可知', appType: payParams.appType}, ...res})
                } else {
                    //包含普通网络出错、客户端-钱包中止快捷支付、订单支付失败、用户点击忘记密码快捷界面退出等
                    resolve({...{code: -1, msg: '支付宝支付失败', appType: payParams.appType}, ...res})
                }
            })
        } else {
            reject({code: -3, msg: 'AlipayJSBridge未定义', appType: payParams.appType})
        }

    }

    //创建订单并支付
    const createOrderAndPay = async (params) => {
        try {
            let orderData = await createOrder(params) //创建订单
            return await nativePay(orderData) //订单支付
        } catch (e) {
            failureCb(e)
        }
    }

    return {
        /**
         * 调用微信/支付宝支付
         * @param params 业务入参
         * @param successCallback 成功回调
         * 成功回调入参为以下三种: (code为-5，只在支付宝支付中返回，微信不)
         * {code: 0, msg: '支付成功'}，附加预下单接口的appType, 并附加微信/支付宝的返回信息
         * {code: -1, msg: '支付失败'}，附加预下单接口的appType，并附加微信/支付宝的返回信息
         * {code: -4, msg: '支付过程中用户取消'}，附加预下单接口的appType，并附加微信/支付宝的返回信息
         * {code: -5, msg: '支付结果未可知'}，附加预下单接口的appType，并附加支付宝的返回信息
         *  @param failureCallback 失败回调
         * 失败回调入参为以下两种:
         * {code: -2, msg: '当前客户端与支付类型不符'}
         * {code: -3, msg: 'WeixinJsbridge未定义'}
         */
        pay(params, successCallback, failureCallback) {
            //初始化回调
            successCb = successCallback
            failureCb = failureCallback
            //预下单，并支付
            createOrderAndPay(params).then(data => {
                data && successCb(data)
            })
        }

    }

})()