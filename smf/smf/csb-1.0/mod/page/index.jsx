var util = require('../common/util'),
    ajax = require('../common/ajax'),
	platform = sessionStorage.getItem('userAgent'),
	businessInformation = JSON.parse(sessionStorage.getItem('businessInformation'));
module.exports = React.createClass({
	getInitialState: function () {
		return {
			moneyNumber: '',
			branchName:businessInformation.branchName,
			platform:"",
			isWeixin: "0",
			isZhifubao: "0"
		}
	},
	componentDidMount:function(){
		let _this = this;
		if(platform == "WX") {
			this.setState({
				isWeixin: 1,
				isZhifubao: 0
			})
		}else if(platform == "ALIPAY"){
			this.setState({
				isZhifubao: 1,
				isWeixin: 0
			})
		}
		app.keypad({
			value:"¥",
			input: '#number',
			inputReadOnly:true,
			onChange: function(pad,val){
				_this.setState({
				moneyNumber:val
			})
				var doma = $$(pad.container[0].childNodes[0].children[7])
				if((val.length >=2)&&(platform=="WX")&&(parseFloat(val.substring(1))!=0)) {
					doma.removeClass('btn-ok-disabled-wx');
					doma.addClass("btn-ok-weixin");
				} else if((val.length >=2)&&(platform=="ALIPAY")&&(parseFloat(val.substring(1))!=0)){
					doma.removeClass('btn-ok-disabled-alipay');
					doma.addClass("btn-ok-alipay");
				}else if((val.length >=2)&&(platform=="GENERAL_BROWSER")&&(parseFloat(val.substring(1))!=0)){
					doma.removeClass('btn-ok-disabled');
					doma.addClass("btn-ok-general");
				}else{
					if(platform=="WX"){
						doma.addClass('btn-ok-disabled-wx');
					}else if(platform=="ALIPAY"){
						doma.addClass('btn-ok-disabled-alipay');
					}else{
						doma.addClass('btn-ok-disabled');
					}
				}
			},
			onOpen : function(obj) {
				$$("#blink").show();
				$$(".bottom").addClass("bottom-top");
				if(obj.value == undefined || obj.value == "") {
					var doma = $$(obj.container[0].childNodes[0].children[7])
					doma.addClass('btn-ok-disabled');
				}
			},
			onClose:function(){
				$$("#blink").hide();
				$$(".bottom").removeClass("bottom-top")
			}
      });
	},
	render: function () {
		return (
			<div className="navbar-fixed home">
				<div className="page wx-pay pay">
						<div className="list-block">
							<div className="shop-name">
							{this.state.isZhifubao==1?
								<img className="shop-icon" 
									src={__uri('/csb-1.0/res/images/ico_shop_alipay@3x.png') } alt="" />
									:""}
							{this.state.isWeixin==1?
								<img className="shop-icon"  
									src={__uri('/csb-1.0/res/images/ico_shop_wechat@3x.png')} alt="" />
									:""}
									{this.state.branchName}
							</div>
						</div>
						<div className="list-block">
							<div id="moneyInput"  className="money-input" >
								<div className="left money-text">
									<span className="num-title">金额</span>
								</div> 
								<div className="left number" id="numberRight">
									<input type="text" 
											id="number" 
											className="num-text number-common left" 
											value={this.state.moneyNumber} 
									/>
								</div> 
								<div className="blink" id="blink"></div>
							</div>
						</div>
						<div id="bottom" className="bottom">由 
							<img className="bottom-icon" src={__uri('/csb-1.0/res/images/bottom-logo@2x.png')} alt="" />
							提供服务支持
						</div>
				</div>
			</div>
		)
	}
})