import React from 'react';
import util from '../../utils/util';
import _h5t from '../../utils/h5t';
import payment from '../../backend/payment';
import PriceInput from './PriceInput';
import '../../assets/css/mod_css/supply.less';
import circleSelOnWx from '../../assets/img/Float_gouxuan@2x.png';
import circleDis from '../../assets/img/Float_zhihui@2x.png';
import circleSelOnAli from '../../assets/img/blue_gouxuans@2x.png';
import wechatIcon from '../../assets/img/weixin@2x.png';
import wechatIconDis from '../../assets/img/wx_hui@2x.png';
import alipayIcon from '../../assets/img/zhifubao@2x.png';
import alipayIconDis from '../../assets/img/zhifubao_hui@2x.png';
import scanIcon from '../../assets/img/barcode.svg';

class ConfirmOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserAgent: sessionStorage.getItem('userAgent'),
      payTypeListOne: [{ payTypeCode: 'WX' }, { payTypeCode: 'ALIPAY' }],
      payTypeListTwo: [{ payTypeCode: 'ALIPAY' }, { payTypeCode: 'WX' }],
      qrCode: sessionStorage.getItem('transQrcode'),
      payTypeLists: [],
      isOnWX: false,
      isOnAlipay: false,
      isChooseWX: false,
      isChooseAlipay: false,
      wxEnable: 1,
      zfbEnable: 1,
      merchantName: '',
      unitInfoTitle: '',
      totalAmt: '',
      merchantorderNum: '',
      orderDetailContent: '',
    };
  }
  /* eslint-disable */
  componentDidMount() {
    this.handleInitPage();
    this.handleInitData();
    window.$$('.order-input').focus(function(){
      window.keypads.close();
    });
    window.$$('.order-inputDetail').focus(function(){
      window.keypads.close();
    });
    let winHeight = $$(window).height(); //获取当前页面高度
    $$(window).resize(function() {
      let thisHeight = $$(this).height();
      if (winHeight - thisHeight > 50) {
        //当软键盘弹出，在这里面操作
        $$('body').css('height', winHeight + 'px');
      } else {
        //当软键盘收起，在此处操作
        $$('body').css('height', '100%');
      }
    });
  }
  handleInitPage = () => {
    const userAgent = this.state.isUserAgent;
    if (userAgent === 'WX') {
      this.setState({
        isOnWX: true,
        isChooseWX: true,
        wxEnable: 1,
        zfbEnable: 0,
        payTypeLists: this.state.payTypeListOne,
      });
    } else if (userAgent === 'ALIPAY') {
      this.setState({
        isOnAlipay: true,
        isChooseAlipay: true,
        zfbEnable: 1,
        wxEnable: 0,
        payTypeLists: this.state.payTypeListTwo,
      });
    } else if (userAgent === 'GENERAL_BROWSER') {
      this.setState({
        isOnAlipay: false,
        isOnWX: false,
        zfbEnable: 0,
        wxEnable: 0,
        payTypeLists: this.state.payTypeListOne,
      });
    }
  };
  handleInitData = () => {
    let qrcode = this.state.qrCode;
    let _this = this;
    let option = {
      appId: 'coc-bill-api',
      traceId: util.generateUUID(),
      requestTime: util.getNowFormatDate(),
      qrCode: qrcode,
    };
    window.$$.ajax({
      method: 'POST',
      url: process.env.FETCH_ENV.fetchUrl+'/csb/qrcode/validate',
      contentType: 'application/json;charset=UTF-8',
      data: JSON.stringify(option),
      headers: {
        pubData: JSON.stringify({'c': 'H5', 'b': 'MKT', 'id': '102', 't': new Date() / 1})
      },
      success: function succ(res) {
        sessionStorage.setItem('businessInformation', res);
        let data = JSON.parse(res);
        let unitInfo = JSON.parse(data.unitInfo);
        let showUnitNo = unitInfo.unitNo;
        let showUnitName = unitInfo.unitName;
        let unitInfotitle = '';
        if (!showUnitNo) {
          unitInfotitle = showUnitName;
        } else if (!showUnitName) {
          unitInfotitle = showUnitNo;
        } else if (showUnitNo && showUnitName) {
          unitInfotitle = showUnitNo + showUnitName;
        }
        document.title = data.branchName || data.merchantName;
        if (_this.state.isUserAgent === 'ALIPAY') {
          AlipayJSBridge.call('setTitle', {
            title: data.branchName || data.merchantName,
          });
        }
        _this.setState({
          unitInfoTitle: unitInfotitle,
        })
      },
      error: function err(res) {
        window.app.alert(res);
      }
    })
  };
  // 调起微信/支付宝扫描条形码
  handlePhoto = () => {
    let _this = this;
    if (this.state.isUserAgent === 'ALIPAY') {
      AlipayJSBridge.call('scan', {
        type: 'bar',
      }, function(result) {
        _this.setState({
          merchantorderNum: result.barCode,
        });
      });
    } else if (this.state.isUserAgent === 'WX') {
      window.wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ['barCode'], // 可以指定扫二维码还是一维码，默认二者都有
        success: function wxx(res) {
          const result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          let tempArray = result.split(',');
          let tempNum = tempArray[1];
          _this.setState({
            merchantorderNum: tempNum,
          });
        },
      });
    }
  };
  handleWX = () => {
    _h5t.track('trackevent', {
      eventId: 'H5_goodSupply_chooseWechat',
    });
    this.setState({
      isChooseWX: true,
      isChooseAlipay: false,
      isChooseDaifu: false,
    });
  };
  handleAlipay = () => {
    _h5t.track('trackevent', {
      eventId: 'H5_goodSupply_chooseAlipay',
    });
    this.setState({
      isChooseWX: false,
      isChooseAlipay: true,
      isChooseDaifu: false,
    });
  };
  //输入金额
  handleValueChange = (val) => {
    this.setState({
      totalAmt: val
    })
  };
  //输入单号
  handleOrderNumChange = (e) => {
    this.setState({
      merchantorderNum: e.target.value,
    });
  };
  //输入订单详情
  handleOrderDetailChange = (e) => {
    const codeLength = this.mbStringLength(e.target.value).split('&')[0];
    const index = parseInt(this.mbStringLength(e.target.value).split('&')[1]);
    const orderDetailContent = this.state.orderDetailContent;
    if (codeLength <= 128) { // 字节数小于128
      this.setState({
        orderDetailContent: e.target.value,
      })
    } else {
      this.setState({
        orderDetailContent: e.target.value.substring(0, index+1),
      })
      window.app.alert('输入长度过长，请重新输入！');
    }
  };
  // 计算字节的长度
  mbStringLength(str) { 
    let totalLength = 0; 
    let i; 
    let charCode;
    let index = str.length;
    let falg = true;
    for (i = 0; i < str.length; i++) { 
      charCode = str.charCodeAt(i); 
      if (charCode < 0x007f) { 
        totalLength = totalLength + 1; 
      } else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) { 
        totalLength += 2; 
      } else if ((0x0800 <= charCode) && (charCode <= 0xffff)) { 
        totalLength += 3; 
      }

      if(falg) {
        if (totalLength > 128) {
          index = i - 1;
          falg = false;
        }   
      }
    } ; 
    const obj = totalLength + '&' + index;
    return obj ; 
  } 
  handleChangeText = () => {
    window.$$('.order-inputDetail').focus();
  };
  handleSubmitPay = () => {
    _h5t.track('trackevent', {
      eventId: 'H5_goodSupply_submitPay',
    });
    let _this = this;
    let code = '';
    if (window.sessionStorage.getItem('userAgent') === 'ALIPAY') {
      code = JSON.parse(sessionStorage.getItem('authCode')).auth_code;
    } else if (window.sessionStorage.getItem('userAgent') === 'WX') {
      code = JSON.parse(sessionStorage.getItem('authCode')).code;
    } else {
      code = '';// 其他点三方取code
    }
    const openId = sessionStorage.getItem('openId');
    if (openId === null || openId === 'undefined') { // 没有openId
      const params = {
        appId: 'coc-bill-api',
        requestTime: util.getNowFormatDate(),
        traceId: util.generateUUID(),
        code: code,
        userAgent: sessionStorage.getItem('userAgent'),
      };
      window.$$.ajax({
        method: 'POST',
        url: process.env.FETCH_ENV.fetchUrl+'/csb/useragent/queryOpenId',
        contentType: 'application/json',
        data: JSON.stringify(params),
        headers: {
          pubData: JSON.stringify({ 'c': 'H5', 'b': 'MKT', 'id': '102', 't': new Date() / 1 })
        },
        success: function succ(res) {
          let data = JSON.parse(res);
          sessionStorage.setItem('openId', data.openId);
          _this.handleGetOpenId(data.openId);
        },
      });
    } else {
      _this.handleGetOpenId(openId);
    }
  };
  handleGetOpenId = (openId) => {
    let qrCode = this.state.qrCode;
    let orderDetailContent = this.state.orderDetailContent.trim();
    if (this.state.totalAmt === '') {
      window.app.alert('请输入金额！');
      return;
    }
    if (orderDetailContent.trim() === '') {
      window.app.alert('详情不能为空！');
      return;
    }
    let merchantorderNum = this.state.merchantorderNum;
    if (this.state.merchantorderNum === '') {
      merchantorderNum = util.generateUUID();
    }
    let erpMessage = JSON.parse(sessionStorage.getItem('businessInformation'));
    let showUnitNo = JSON.parse(erpMessage.unitInfo).unitNo;
    let showUnitName = JSON.parse(erpMessage.unitInfo).unitName;
    let showUnitInfo = '';
    if (!showUnitNo) {
      showUnitInfo = showUnitName;
    } else if (!showUnitName) {
      showUnitInfo = showUnitNo;
    } else if (showUnitNo && showUnitName) {
      showUnitInfo = showUnitNo + showUnitName;
    }
    let params = {
      appId: 'coc-bill-api', //hard code
      requestTime: util.getNowFormatDate(),
      traceId: util.generateUUID(),
      externalTraceNo: merchantorderNum,
      userAgent: sessionStorage.getItem('userAgent'),
      qrCode: qrCode,
      merchantCode: erpMessage.merchantCode,
      merchantName: erpMessage.merchantName,
      merchantId: erpMessage.merchantId,
      terminalId: erpMessage.terminalId,
      branchId: erpMessage.branchId,
      branchName: erpMessage.branchName,
      unitInfo: showUnitInfo,
      orderDetail: orderDetailContent,
      amt: this.state.totalAmt,
      openId:  openId,
      returnUrl: "",
      bizType: parseInt(erpMessage.bizType),
    };
    localStorage.setItem('externalTraceNo',params.externalTraceNo);
    payment.pay(
        params,
        (arg) => {
          try {
            if (arg.code == 0) {
              localStorage.setItem('codeStatus', arg.code);
              localStorage.setItem('appType', arg.appType);
              app.mainView.router.load({
                url: 'p/ordersuccess.html',
                animatePages: false,
                pushState: false
              })
            } else {
              //app.alert('下单失败!,用户取消操作！')
            }
          } catch (e) {}
        },
        (err) => {
          window.app.alert(err.rspMsg);
        });
  };

  /* eslint-disable */
  render() {
    const dom_wx = <li className="item-content" onClick={() => {
      if (this.state.wxEnable == 0) {
        return;
      } else {
        this.handleWX();
      }
    }}>
      <div className="item-inner">
        <div className="paytype-inner">
          <div className="item-icon"><img src={this.state.isOnWX ? wechatIcon : wechatIconDis} alt="" /></div>
          <div className={`item-title ${this.state.wxEnable == 0 ? 'wxtitle' : ''}`}>
            <p>微信支付</p>
            {this.state.wxEnable == 0 ? <p className="itemtitle-inner">暂不支持，请使用微信扫描二维码</p> : null}
          </div>
        </div>
        <div className="item-iconcircle" style={{ marginRight: '0px' }}><img src={this.state.wxEnable === 1 ? (this.state.isChooseWX ? circleSelOnWx : circleDis) : circleDis} alt="" /></div>
      </div>
    </li>;
    const dom_alipay = <li className="item-content" onClick={() => {
      if (this.state.zfbEnable == 0) {
        return;
      } else {
        this.handleAlipay();
      }
    }}>
      <div className="item-inner">
        <div className="paytype-inner">
          <div className="item-icon"><img src={this.state.isOnAlipay ? alipayIcon : alipayIconDis} alt="" /></div>
          <div className={`item-title ${this.state.zfbEnable == 0 ? 'wxtitle' : ''}`}>
            <p>支付宝客户端支付</p>
            {this.state.zfbEnable == 0 ? <p className="itemtitle-inner">暂不支持，请使用支付宝扫描二维码</p> : null}
          </div>
        </div>
        <div className="item-iconcircle" style={{ marginRight: '0px' }}><img src={this.state.zfbEnable === 1 ? (this.state.isChooseAlipay ? circleSelOnAli : circleDis) : circleDis} alt="" /></div>
      </div>
    </li>;
    let btn_bg;
    if (this.state.isOnWX) {
      btn_bg = '#1AAD19';
    } else if (this.state.isOnAlipay) {
      btn_bg = '#1E82D2';
    }
    return (
        <div className="page">
          <div className="page-content pay-pre">
            <div className="list-block order-info">
              <div className="title">{this.state.unitInfoTitle}</div>
              <div className="order-list">
                <ul>
                  <li className="item-content" style={{paddingLeft: '0'}}>
                    <div className="item-inner" style={{paddingLeft: '15px'}}>
                      <PriceInput onValueChange={this.handleValueChange} />
                    </div>
                  </li>
                  <li className="item-content">
                    <div className="item-inner">
                      <div className="search-order-area">
                        <div className="posi-input">
                          <div className="text">单号：</div>
                          <input style={{ lineHeight: '24px' }} className="order-input" type="text" placeholder="" value={this.state.merchantorderNum} onChange={this.handleOrderNumChange} />
                          <div className="paizhao" onClick={this.handlePhoto}>
                            <img src={scanIcon} alt="" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="item-content">
                    <div className="item-inner">
                      <div className="search-order-area">
                        <div className="posi-input">
                          <div className="text">详情：</div>
                          <textarea className="order-inputDetail" type="text" placeholder="" value={this.state.orderDetailContent} onChange={this.handleOrderDetailChange} />
                          <div className="tip" onClick={this.handleChangeText}>
                            必填
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <p className="paytype-text">请选择支付方式</p>
            <div className="list-block pay-type">
              <ul>
                {
                  this.state.payTypeLists.map((item) => {
                    if (item.payTypeCode == 'WX') {
                      return dom_wx;
                    } else if (item.payTypeCode == 'ALIPAY') {
                      return dom_alipay;
                    }
                  })
                }
              </ul>
            </div>
            <div className="checkButton">
              <a href="#" style={{ backgroundColor: btn_bg }} className="item-link buttonDefault" onClick={this.handleSubmitPay}>立即支付</a>
            </div>
          </div>
        </div>
    );
  }
}

export default ConfirmOrder;
