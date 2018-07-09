/**
 * pre-pay1
 * @author zishuai.xu.coc
 * @time:2017/8/21;
 */
const OrderList = require('../component/OrderList');
const PayType = require('../component/PayType');
const ajax = require('../common/ajax');
const payment = require('../common/payment');
const util = require('../common/util');

module.exports = React.createClass({
	getInitialState: function () {
		return {
			cHeight: 600,
			isOnWeixin: window.sessionStorage.getItem('userAgent') == "WX"?true:false,
			isOnZhifubao: window.sessionStorage.getItem('userAgent') == "ALIPAY"?true:false,
			orderList: [],
			totalAmt: '',
			totalItem: '',
			unitInfo: '',
			payTypeList: [],
			erpInfo: '',
			merchantName: '',
		}
	},

	handleAjaxMenuList: function () {
		let _this = this;
		let erpMessage = JSON.parse(sessionStorage.getItem('businessInformation'));

		let params = {
			appId: 'coc-bill-api',
			merchantCode: erpMessage.merchantCode
		};

		let option = {
			url:'https://ebd.99bill.com/coc-bill-api/msf/erp/query',
			contentType:'application/json',
			data:params
		}

		ajax.post(option).then(function (data) {

			

			let unitInfo = "";
			if(erpMessage.unitInfo == "{}") {
				unitInfo = "";
			}else {
        let zhuohao = JSON.parse(erpMessage.unitInfo).unitNo;
        if(zhuohao == undefined) {
          unitInfo = JSON.parse(erpMessage.unitInfo).unitName;
        } else {
          unitInfo = JSON.parse(erpMessage.unitInfo).unitNo + JSON.parse(erpMessage.unitInfo).unitName;
        }
				// unitInfo = JSON.parse(erpMessage.unitInfo).unitNo + JSON.parse(erpMessage.unitInfo).unitName;
			}

			_this.setState({
				orderList: data.items,
				totalAmt: data.totalAmt,
				totalItem: data.totalItem,
				unitInfo: unitInfo,
				erpInfo:　JSON.stringify(data)
			})
		})
	},


	handleAjaxPayType: function () {
		let _this = this;
		//let erpMessage = JSON.parse(sessionStorage.getItem('businessInformation'));

		let params = {
			appId: 'coc-bill-api',
			traceId: util.generateUUID(),
			requestTime: util.getNowFormatDate(),
			appType: window.sessionStorage.getItem('userAgent')
		};

		let option = {

			url:'https://ebd.99bill.com/coc-bill-api/csb/useragent/available',
			contentType:'application/json',
			data:params
		}

		ajax.post(option).then(function (data) {
			_this.setState({
				payTypeList: data.list
			})
		})

	},


	handleSubmit: function () {
		let _this = this;

		let code = "";
		console.log(window.sessionStorage.getItem('userAgent'))

		// if(window.sessionStorage.getItem('userAgent') == "WX") {
			if(window.sessionStorage.getItem('userAgent') == "ALIPAY") {
				code = util.GetQueryString('auth_code');
			}else if(window.sessionStorage.getItem('userAgent') == "WX"){
				code = util.GetQueryString('code');
			} else {
				code = "";//其他点三方取code
			}
			
			let openId = sessionStorage.getItem('openId');
			if(openId == null) { //没有openId
				let params = {
					appId: 'coc-bill-api',
					requestTime: util.getNowFormatDate(),
					traceId: util.generateUUID(),
					code: code,
	          		userAgent: window.sessionStorage.getItem('userAgent'),	
				};

				let option = {
					url:'https://ebd.99bill.com/coc-bill-api/csb/useragent/queryOpenId',
					contentType:'application/json',
					data:params
				}

				ajax.post(option).then(function (data) {
					if(data.openId) {
						sessionStorage.setItem('openId',data.openId);
						_this.handleGetOpenId(data.openId);
					}
				})
			}else {
				_this.handleGetOpenId(openId);
			}

		// } else {
		// 	_this.handleGetOpenId('');
		// }
		

		
	},


	handleGetOpenId: function (openId) {
		let erpMessage = JSON.parse(sessionStorage.getItem('businessInformation'));

		

		let params = {
			  appId: 'coc-bill-api', //hard code
	          requestTime: util.getNowFormatDate(),
	          traceId: util.generateUUID(),
	          externalTraceNo: util.generateUUID(),
	          userAgent: window.sessionStorage.getItem('userAgent'),
			  "qrCode": window.sessionStorage.getItem('qrCode'),
			  "merchantCode": erpMessage.merchantCode,
			  "merchantName": erpMessage.merchantName,
			  "merchantId": erpMessage.merchantId,
			  "terminalId": erpMessage.terminalId,
			  "branchId": erpMessage.branchId,
			  "branchName": erpMessage.branchName,
			  "unitInfo": erpMessage.unitInfo,
			  "erpInfo": this.state.erpInfo,
			  "amt": this.state.totalAmt,
			  "openId":  openId,
			  "returnUrl": "",
			  "bizType": parseInt(erpMessage.bizType),
			}

		localStorage.setItem('externalTraceNo',params.externalTraceNo);

		payment.pay(
			params,
			(arg) => {
				try {
					if(arg.code == 0 || arg.code == -1) {
						localStorage.setItem('codeStatus',arg.code);
					
						localStorage.setItem('appType',arg.appType);

						localStorage.setItem('businessInformation',sessionStorage.getItem('businessInformation'));

						app.mainView.router.load({
							url: 'p/pay-result.html',
							animatePages: false,
							pushState: false
						})
						
					}else {
						//app.alert('下单失败!,用户取消操作！')
					}

				} catch(e) {
					

				} 

				
			},
			(err) => {
				
				app.alert(err.rspMsg)
				// app.mainView.router.load({
				// 	url: 'p/pay-result.html',
				// 	animatePages: false,
				// 	pushState: false
				// })
			});
	},

	componentDidMount () {
		const platform = sessionStorage.getItem('userAgent');
		

		if(platform == "WX") {
			this.setState({
				isOnWeixin: true,
				isOnZhifubao: false,
			})

		}else {
			this.setState({
				isOnZhifubao: true,
				isOnWeixin: false
			})
		}

		this.handleAjaxMenuList();
		this.handleAjaxPayType();

		let bHeight = document.documentElement.clientHeight;
		this.setState({
			cHeight: bHeight - 65
		})

		let erpMessage = JSON.parse(sessionStorage.getItem('businessInformation'));
		let storeName = erpMessage.branchName || erpMessage.merchantName
		this.setState({
			merchantName: storeName
		})
	
	},


	render: function () {
		let btn_bg;

		if(this.state.isOnWeixin) {
			
			btn_bg = '#1AAD19';
		} else if(this.state.isOnZhifubao) {
			
			btn_bg = '#1E82D2';
		}
		return (
		  <div>
			  <div className="pay-pre page-content" style={{height: this.state.cHeight + 'px',overflow: 'auto'}}  data-title={this.state.merchantName}>
			  	<div className="good-info">{this.state.unitInfo}</div>
			  	<div className="good-price">{this.state.totalAmt}<span>元</span></div>
			  	<OrderList orderItems={this.state.orderList} totalItem={this.state.totalItem} totalAmt={this.state.totalAmt}/>
			  	<PayType payTypeList={this.state.payTypeList} isOnWeixin={this.state.isOnWeixin} isOnZhifubao={this.state.isOnZhifubao}/>
			  </div>
			  <div className="btn-wrapper">
			  	<button style={{backgroundColor: btn_bg,zIndex: '999'}} className="btn-submits" onClick={() => this.handleSubmit()}>¥{this.state.totalAmt} 确认买单</button>
			  </div>
		  </div>
		)
	}
})