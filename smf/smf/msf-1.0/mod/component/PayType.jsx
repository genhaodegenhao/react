/**
 * 支付配置项公共组件
 * @author zishuai.xu.coc
 * @time:2017/8/21;
 */
module.exports = React.createClass({
	getInitialState: function () {
		return {
			isWeixin: true,
			isZhifubao: false,
			isKuaiqian: false,
			isZhifubaoActive: true,
		}
	},

	getDefaultProps: function () {
		return {
			isOnWeixin: true,
			isOnZhifubao: false,
			payTypeList: [],
		}
	},

	handleWeixinClick () {
		this.setState({
			isWeixin: this.state.isWeixin?this.state.isWeixin:!this.state.isWeixin,
			isZhifubao: false,
			isKuaiqian: false
		})
	},

	handleKuaiqianClick () {
		this.setState({
			isWeixin: false,
			isZhifubao: false,
			isKuaiqian: this.state.isKuaiqian?this.state.isKuaiqian:!this.state.isKuaiqian
		})
	},

	handleZhifubaoClick () {
		if(this.state.isZhifubaoActive) {
			this.setState({
				isWeixin: false,
				isZhifubao: this.state.isZhifubao?this.state.isZhifubao:!this.state.isZhifubao,
				isKuaiqian: false
			})
		}
	},

	componentDidMount: function () {
		if(this.props.isOnWeixin) {
			console.log('zou le a')
			this.setState({
				isWeixin: true,
				isZhifubao: false,
				isKuaiqian: false
			})
		}else {
			console.log('zou le b')
			this.setState({
				isWeixin: false,
				isZhifubao: true,
				isKuaiqian: false
			})

		}
	},

	render: function () {
		// let isWeixin,isZhifubao,isKuaiqian;

		// if(this.props.isOnWeixin) {
		// 	isWeixin = true;
		// 	isZhifubao = false;
		// 	isKuaiqian = false;
		// } else {
		// 	isWeixin = false;
		// 	isZhifubao = true;
		// 	isKuaiqian = false;
		// }

		let payTypeOpo = {};

		this.props.payTypeList.forEach((v,i) => {
			payTypeOpo[v.payTypeCode] = v;
		})

		let wxEnabled = payTypeOpo.WX?payTypeOpo.WX.enabled:1;
		//let wxEnabled = 0;
		let zfEnabled = payTypeOpo.ALIPAY?payTypeOpo.ALIPAY.enabled:1;
		//let zfEnabled = 0
		let ftEnabled = payTypeOpo.FFT?payTypeOpo.FFT.enabled:1;

		console.log(payTypeOpo)

		let select_active,select_disabled,btn_bg;

		if(this.props.isOnWeixin) {
			select_active = __uri('../msf-1.0/res/images/Float_gouxuan@2x.png?__inline');
			select_disabled = __uri('../msf-1.0/res/images/Float@2x.png?__inline');
			btn_bg = '#1AAD19';
		} else if(this.props.isOnZhifubao) {
			select_active = __uri('../msf-1.0/res/images/blue_gouxuans@2x.png');
			select_disabled = __uri('../msf-1.0/res/images/blue@2x.png?__inline');
			btn_bg = '#1E82D2';
		}

		console.log(select_active)
		console.log(this.state.isWeixin)
		console.log(this.props.isOnWeixin)

		let disabledTextTop = {
			fontFamily: "PingFangSC-Regular",
			fontSize: "15px",
			color: "#999999",
			letterSpacing: "-0.36px",
			lineHeight: "14px",
		}

		let disabledTextBottom = {
			fontFamily: "PingFangSC-Regular",
			fontSize: "12px",
			color: "#999999",
			letterSpacing: "0",
			lineHeight: "10px",
		}

		let disabledTextInfoWX = "暂不支持，请使用微信扫描二维码";
		let disabledTextInfoAL = "暂不支持，请使用支付宝扫描二维码";
		let disabledTextInfoFT = "暂不支持";


		const dom_zhifubao = <li className="pay-menu-item" onClick={() => {
		  			console.log(zfEnabled)
		  			if(zfEnabled == 0) {
		  				return;
		  			}else {
		  				this.handleZhifubaoClick();

		  			}
		  		}}>
			  		<img className="pay-img" title="" src={zfEnabled == 1?__uri('../msf-1.0/res/images/zhifubao@2x.png?__inline'):__uri('../msf-1.0/res/images/zhifubao_hui@2x.png?__inline')}/>
		  			<div className="pay-menu-item-tips">
		  				<p className="pay-menu-item-name" style={zfEnabled == 0?disabledTextTop:null}>支付宝客户端支付</p>
		  				<p className="pay-menu-item-des-hot">{ zfEnabled == 1?(payTypeOpo.ALIPAY?payTypeOpo.ALIPAY.memo:''):''}</p>
		  				<p className="pay-menu-item-des-hot" style={disabledTextBottom}>{zfEnabled == 0?disabledTextInfoAL:''}</p>
		  			</div>
		  			<img className="pay-select" src={zfEnabled == 1?(this.state.isZhifubao?select_active:select_disabled):__uri('../msf-1.0/res/images/Float_zhihui@2x.png?__inline')} />
		  		</li>;


		const dom_wx = <li className="pay-menu-item" onClick={() => {
		  			if(wxEnabled == 0) {
		  				return;
		  			}else {
		  				this.handleWeixinClick();
		  			}
		  		}}>
			  		<img className="pay-img" title="" src={ wxEnabled == 1?__uri("../msf-1.0/res/images/weixin@2x.png?__inline"):__uri('../msf-1.0/res/images/wx_hui@2x.png?__inline')}/>
		  			<div className="pay-menu-item-tips">
		  				<p className="pay-menu-item-name" style={wxEnabled == 0?disabledTextTop:null}>微信支付</p>
		  				<p className="pay-menu-item-des-hot">{wxEnabled == 1?(payTypeOpo.WX?payTypeOpo.WX.memo:''):''}</p>
		  				<p className="pay-menu-item-des-hot" style={disabledTextBottom}>{wxEnabled == 0?disabledTextInfoWX:''}</p>
		  			</div>
		  			<img className="pay-select" src={wxEnabled == 1?(this.state.isWeixin?select_active:select_disabled):__uri('../msf-1.0/res/images/Float_zhihui@2x.png?__inline')} />
		  		</li>;
		return (
		  <div className="pay">
		  	<h3 className="pay-title">请选择支付方式</h3>
		  	<ul className="pay-menu-items">
		  		{
		  			this.props.payTypeList.map((v,i) => {
		  				if(v.payTypeCode == "WX") {
		  					return dom_wx;
		  				} else if(v.payTypeCode == "ALIPAY") {
		  					return dom_zhifubao;
		  				}
		  			})
		  		}
		  	</ul>
		  </div>
		)
	}
})