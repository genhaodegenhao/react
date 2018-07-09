import React from 'react';
import util from '../../utils/util';
import _h5t from '../../utils/h5t';
import sharewx from '../../utils/shareWechat';
import payment from '../../backend/payment';
import setTitle from '../../backend/setTitle';
import '../../assets/css/mod_css/baodanOrder.less';
import wechatIcon from '../../assets/img/baodan/icon_WechatPay@2x.png';
import wechatIconDis from '../../assets/img/baodan/icon_WechatPay_Disable@2x.png';
import alipayIcon from '../../assets/img/baodan/icon_AliPay@2x.png';
import alipayIconDis from '../../assets/img/baodan/icon_AliPay_Disable@2x.png';
import daifuIcon from '../../assets/img/baodan/icon_ZhaoRenDaiFu@2x.png';
import circleDis from '../../assets/img/baodan/Radio@2x.png';
import circleSel from '../../assets/img/baodan/Radio_select@2x.png';
import shareQrcodeIcon from '../../assets/img/baodan/icon_QRcode@2x.png';
import shareWxIcon from '../../assets/img/baodan/icon_wechat@2x.png';
import shareWxTip from '../../assets/img/baodan/share_GuideImg@2x.png';
import shareWxTextTip from '../../assets/img/baodan/share_Text@2x.png';
import IdCardInfo from './idCardInfo';

class ConfirmOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserAgent: sessionStorage.getItem('userAgent'),
      businessInformation: JSON.parse(sessionStorage.getItem('businessInformation')),
      payTypeListOne: [{ payTypeCode: 'WX' }, { payTypeCode: 'DAIFU' }, { payTypeCode: 'ALIPAY' }],
      payTypeListTwo: [{ payTypeCode: 'ALIPAY' }, { payTypeCode: 'DAIFU' }, { payTypeCode: 'WX' }],
      qrCode: sessionStorage.getItem('transQrcode'),
      payTypeLists: [],
      baodanInfo: sessionStorage.getItem('baodanInfo'),
      merchantorderNum: sessionStorage.getItem('merchantorderNum'),
      isTimeExpired: false,
      isOnWX: false,
      isOnAlipay: false,
      isChooseWX: false,
      isChooseAlipay: false,
      isChooseDaifu: false,
      isShareFriends: true,
      wxEnable: 1,
      zfbEnable: 1,
      isFlag: false,
      isshowShareTip: false,
      ch_call_id: '',
      ch_call_tel: '',
      ch_id: '',
      ch_id_code: '',
      ch_name: '',
      chnname: '',
      insurer_no: '',
      merchantName: '',
      stl_merchant_id: '',
      paymoney: '',
      userName: '',
      userId: '',
      idMsgShowBol: false,
      baodanInfoMsg: JSON.parse(sessionStorage.getItem('baodanInfo')),
    };
  }
  /* eslint-disable */
  componentDidMount() {
    setTitle('确认订单');
    this.handleInitPage();
    this.handleFromPage();
    _h5t.track('pageview', {
      eventId: 'H5_baodanpay_P_confirmOrder',
    });
  }
  userInfoChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }
  //从非查询接口过来BusninessInfo
  handleBusniessInfo = (qrcode) => {
    let _this = this;
    let option = {
      appId: 'coc-bill-api',
      traceId: util.generateUUID(),
      requestTime: util.getNowFormatDate(),
      qrCode: qrcode,
    };
    window.$$.ajax({
      method: 'POST',
      url: process.env.FETCH_ENV.fetchUrl + '/csb/qrcode/validate',
      contentType: 'application/json;charset=UTF-8',
      data: JSON.stringify(option),
      success: function succ(res) {
        sessionStorage.setItem('businessInformation', res);
        _this.handleTunnelData();
      }
    })
  };
  //页面来源判断
  handleFromPage = () => {
    let shareQrcode = '';
    let _this = this;
    if (!this.state.qrCode) {
      let option = {
        payCode: sessionStorage.getItem('transPaycode'),
      };
      window.$$.ajax({
        method: 'POST',
        url: process.env.FETCH_ENV.fetchUrl + '/mam/3.0/scan/qrcode/scan',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(option),
        headers: {
          pubData: JSON.stringify({'c': 'H5', 'b': 'MKT', 'id': '102', 't': new Date() / 1})
        },
        success: function succ(res) {
          let data = JSON.parse(res);
          if (data.errCode === '00' || data.errCode === '10101' || data.errCode === '10100' || data.errCode === '10102') {
            let getQRCode = JSON.parse(data.media).qrCode;
            let merchantorderNum = JSON.parse(data.media).merchantorderNum;
            sessionStorage.setItem('merchantorderNum', merchantorderNum);
            sessionStorage.setItem('paychangeQrCode', getQRCode);
            _this.setState({
              merchantorderNum: merchantorderNum
            });
            let systemTime = JSON.parse(data.media).timer;
            window.$$.ajax({
              method: 'GET',
              url: process.env.FETCH_ENV.fetchUrl + '/base/3.0/system/time',
              contentType: 'application/json;charset=UTF-8',
              headers: {
                pubData: JSON.stringify({'c': 'H5', 'b': 'MKT', 'id': '102', 't': new Date() / 1})
              },
              success: function succ(resp) {
                let datar = JSON.parse(resp);
                let currentTime = datar.systemTime;
                let endTime = (currentTime - systemTime) / (1000 * 60 * 60);
                if (endTime <= 24) {
                  _this.handleBusniessInfo(getQRCode);
                  _this.initShare(getQRCode, merchantorderNum);
                } else {
                  window.app.alert('二维码已过期！');
                  _this.setState({
                    isTimeExpired: true,
                  });
                }
              },
              error: function err(resp) {
                window.app.alert(resp);
              }
            })
          } else {
            window.app.alert(data.errMsg);
            _this.setState({
              isTimeExpired: true,
            });
          }
        },
        error: function error(error) {
          window.app.alert(error);
        }
      })
    } else {
      let data = JSON.parse(this.state.baodanInfo);
      this.handlePackageData(data);
      shareQrcode = this.state.qrCode;
      this.initShare(shareQrcode, this.state.merchantorderNum);
    }
  };
  //初始化分享功能
  initShare = (shareqrcode, merchantorderNum) => {
    sharewx.shareWechatLink(shareqrcode, merchantorderNum);
  };
  //获取保单信息
  handleTunnelData = () => {
    let _this = this;
    let businfo = JSON.parse(sessionStorage.getItem('businessInformation'));
    const option = {
      merchantId: businfo.merchantId,
      terminalId: businfo.terminalId,
      externalTraceNo: this.state.merchantorderNum,
    };
    window.$$.ajax({
      method: 'POST',
      url: process.env.FETCH_ENV.fetchUrl + '/mam/3.0/tais/oqs/order',
      contentType: 'application/json;charset=UTF-8',
      data: JSON.stringify(option),
      headers: {
        pubData: JSON.stringify({ 'c': 'H5', 'b': 'MKT', 'id': '102', 't': new Date() / 1 })
      },
      success: function succ(res) {
        sessionStorage.setItem('baodanInfo', res);
        const data = JSON.parse(res);
        if (data.errCode === '00') {
          _this.setState({
            baodanInfoMsg: data,
          });
          _this.handlePackageData(data);
        }
      },
      error: function err(res) {
        window.app.alert(res);
      }
    });
  };
  //封装order数据
  handlePackageData = (data) => {
    let orderInfo = JSON.parse(data.tunnelData);
    const chidcode = orderInfo.oqsExtDateInfo.ch_id.value;
    let ch_id_code = util.handleChangeString(chidcode, 3, 4);
    const chidtel = orderInfo.oqsExtDateInfo.ch_call_id.value;
    let ch_call_tel = util.handleChangeString(chidtel, 3, 4);
    let namer = '';
    const namestr = orderInfo.oqsExtDateInfo.ch_name.value;
    if (namestr.length <= 2) {
      namer = util.handleChangeString(namestr, 0, 1);
    } else if (namestr.length >= 3) {
      const reg = /^(.).+(.)$/g;
      namer =namestr.replace(reg, "$1*$2");
    }
    this.setState({
      ch_call_id: orderInfo.oqsExtDateInfo.ch_call_id,
      ch_id: orderInfo.oqsExtDateInfo.ch_id,
      ch_name: orderInfo.oqsExtDateInfo.ch_name,
      insurer_no: orderInfo.oqsExtDateInfo.insurer_no,
      ch_id_code: ch_id_code,
      merchantName: data.merchantName,
      ch_call_tel: ch_call_tel,
      chnname: namer,
      stl_merchant_id: orderInfo.oqsExtDateInfo.stl_merchant_id.value,
      paymoney: data.amt,
    });
  };
  handleInitPage = () => {
    const userAgent = this.state.isUserAgent;
    if (userAgent === 'WX') {
      this.setState({
        isOnWX: true,
        isChooseWX: true,
        isShareFriends: false,
        wxEnable: 1,
        zfbEnable: 0,
        payTypeLists: this.state.payTypeListOne,
      });
    } else if (userAgent === 'ALIPAY') {
      this.setState({
        isOnAlipay: true,
        isShareFriends: true,
        isChooseAlipay: true,
        zfbEnable: 1,
        wxEnable: 0,
        payTypeLists: this.state.payTypeListTwo,
      });
    } else if (userAgent === 'GENERAL_BROWSER') {
      this.setState({
        isOnAlipay: false,
        isOnWX: false,
        isShareFriends: true,
        zfbEnable: 0,
        wxEnable: 0,
        payTypeLists: this.state.payTypeListOne,
      });
    }
  };
  handleWX = () => {
    _h5t.track('trackevent', {
      eventId: 'H5_baodanpay_chooseWechat',
    });
    this.setState({
      isChooseWX: true,
      isChooseAlipay: false,
      isChooseDaifu: false,
    });
  };
  handleAlipay = () => {
    _h5t.track('trackevent', {
      eventId: 'H5_baodanpay_chooseAlipay',
    });
    this.setState({
      isChooseWX: false,
      isChooseAlipay: true,
      isChooseDaifu: false,
    });
  };
  handleDaifu = () => {
    _h5t.track('trackevent', {
      eventId: 'H5_baodanpay_chooseDaifu',
    });
    window.$$('.share').css({
      height: '2.32rem',
    });
    this.setState({
      isChooseWX: false,
      isChooseAlipay: false,
      isChooseDaifu: true,
      isFlag: true,
    });
  };
  handleHideMask = () => {
    this.setState({
      isFlag: false,
      isChooseDaifu: false,
    });
    this.handleInitPage();
    window.$$('.share').css({
      height: '0px',
    });
  };
  handleHideMaskTwo = () => {
    this.setState({
      isshowShareTip: false,
    });
  };
  handleShareQrcode = () => {
    _h5t.track('trackevent', {
      eventId: 'H5_baodanpay_createQrcode',
    });
    let _this = this;
    window.$$.ajax({
      method: 'GET',
      url: process.env.FETCH_ENV.fetchUrl + '/base/3.0/system/time',
      contentType: 'application/json;charset=UTF-8',
      headers: {
        pubData: JSON.stringify({ 'c': 'H5', 'b': 'MKT', 'id': '102', 't': new Date() / 1 })
      },
      success: function succ(res) {
        const data = JSON.parse(res);
        let qrcode = _this.state.qrCode;
        if (!qrcode) {
          qrcode = sessionStorage.getItem('paychangeQrCode');
        }
        const mediaData = {
          qrCode: qrcode,
          merchantorderNum: _this.state.merchantorderNum,
          timer: data.systemTime,
        };
        const option = {
          bizCode: 'sample',
          type: '1',
          deviceid: 'ffffffff-e3df-665a-ffff-ffffc4d418a1',
          media: JSON.stringify(mediaData),
        };
        window.$$.ajax({
          method: 'POST',
          url: process.env.FETCH_ENV.fetchUrl + '/mam/3.0/scan/qrcode/create',
          contentType: 'application/json;charset=UTF-8',
          data: JSON.stringify(option),
          headers: {
            pubData: JSON.stringify({ 'c': 'H5', 'b': 'MKT', 'id': '102', 't': new Date() / 1 })
          },
          beforeSend: function besend(){
            window.app.smfCustomLoadOpen();
          },
          success: function succ(res) {
            window.app.smfCustomLoadClose();
            const data = JSON.parse(res);
            if (data.errCode === '00') {
              sessionStorage.setItem('payCode', data.payCode);
              window.app.mainView.router.load({
                url: 'p/orderqrcode.html',
                animatePages: true,
              });
            }
          },
          error: function err(res) {
            window.app.alert(res);
          }
        })
      },
      error: function err(res) {
        window.app.alert(res);
      }
    })
  };
  handleShareWx = () => {
    _h5t.track('trackevent', {
      eventId: 'H5_baodanpay_shareWxfriends',
    });
    this.setState({
      isshowShareTip: true,
    });
    this.handleHideMask();
  };
  handleSubmitPay = (fillInfoBol) => {
    if ((this.state.baodanInfoMsg.needAuthenticationFlag === '1' && this.state.baodanInfoMsg.returnIdNoAndNameFlag !== '1') && !fillInfoBol) {
      this.setState({
        idMsgShowBol: true,
      });
      return false;
    };
    _h5t.track('trackevent', {
      eventId: 'H5_baodanpay_submitPay',
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
    if (openId === null) { // 没有openId
      const params = {
        appId: 'coc-bill-api',
        requestTime: util.getNowFormatDate(),
        traceId: util.generateUUID(),
        code: code,
        userAgent: sessionStorage.getItem('userAgent'),
      };
      window.$$.ajax({
        method: 'POST',
        url: process.env.FETCH_ENV.fetchUrl + '/csb/useragent/queryOpenId',
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
    if (!qrCode) {
      qrCode = sessionStorage.getItem('paychangeQrCode');
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
    let authCertificateType = '';
    if (this.state.baodanInfoMsg.authCertificateType !== '0' && (this.state.baodanInfoMsg.returnIdNoAndNameFlag === '0' || this.state.baodanInfoMsg.returnIdNoAndNameFlag === '3')) {
      authCertificateType = '0';
    } else {
      authCertificateType = this.state.baodanInfoMsg.authCertificateType;
    };
    let paramsIdMsg = {
      authMobileNo: this.state.baodanInfoMsg.authMobileNo || '',
      authRealName: this.state.baodanInfoMsg.authRealName || this.state.userName,
      authCertificateNo: this.state.baodanInfoMsg.authCertificateNo || this.state.userId,
      authCertificateType: authCertificateType || '0',
      needAuthenticationFlag: this.state.baodanInfoMsg.needAuthenticationFlag,
    };
    sessionStorage.setItem('baodanAuthRealName', paramsIdMsg.authRealName)
    let params = {
      appId: 'coc-bill-api', //hard code
      requestTime: util.getNowFormatDate(),
      traceId: util.generateUUID(),
      externalTraceNo: this.state.merchantorderNum,
      userAgent: sessionStorage.getItem('userAgent'),
      qrCode: qrCode,
      merchantCode: erpMessage.merchantCode,
      merchantName: erpMessage.merchantName,
      merchantId: erpMessage.merchantId,
      terminalId: erpMessage.terminalId,
      branchId: erpMessage.branchId,
      branchName: erpMessage.branchName,
      productDesc: showUnitInfo,
      amt: this.state.paymoney,
      openId:  openId,
      returnUrl: "",
      bizType: parseInt(erpMessage.bizType),
      stlMerchantId: this.state.stl_merchant_id,
      appType: this.state.isOnWX ? 'WECHATOA' : 'ALIPAYSW',
      dataMap: JSON.stringify(paramsIdMsg),
    };
    localStorage.setItem('externalTraceNo',params.externalTraceNo);
    payment.pay(
      params,
      (arg) => {
        try {
          if (arg.code == 0) {
            localStorage.setItem('codeStatus', arg.code);
            localStorage.setItem('appType', arg.appType);
            localStorage.setItem('businessInformation', sessionStorage.getItem('businessInformation'));
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
        if (err.rspMsg || err.msg) {
          window.app.alert(err.rspMsg || err.msg);
        }
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
        <div className="item-iconcircle" style={{ marginRight: '0px' }}><img src={this.state.wxEnable === 1 ? (this.state.isChooseWX ? circleSel : circleDis) : circleDis} alt="" /></div>
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
        <div className="item-iconcircle" style={{ marginRight: '0px' }}><img src={this.state.zfbEnable === 1 ? (this.state.isChooseAlipay ? circleSel : circleDis) : circleDis} alt="" /></div>
      </div>
    </li>;
    const dom_daifu = <li className="item-content" onClick={this.handleDaifu}>
      <div className="item-inner">
        <div className="paytype-inner">
          <div className="item-icon"><img src={daifuIcon} alt="" /></div>
          <div className="item-title">找人代付</div>
        </div>
        <div className="item-iconcircle" style={{ marginRight: '0px' }}><img src={this.state.isChooseDaifu ? circleSel : circleDis} alt="" /></div>
      </div>
    </li>;
    return (
      <div className="page">
        <IdCardInfo userInfoChange={this.userInfoChange} userName={this.state.userName} userId={this.state.userId} returnIdNoAndNameFlag={this.state.baodanInfoMsg&&this.state.baodanInfoMsg.returnIdNoAndNameFlag} idMsgShowBol={this.state.idMsgShowBol} handleSubmitPay={this.handleSubmitPay} />
        <div className="share">
          <div className="share-wrap">
            <div className="share-icon" onClick={this.handleShareQrcode}>
              <img src={shareQrcodeIcon} alt="" />
              <span className="text">付款二维码</span>
            </div>
            <div className={`share-icon ${this.state.isShareFriends ? 'hide' : 'show'}`} onClick={this.handleShareWx}>
              <img src={shareWxIcon} alt="" />
              <span className="text">微信好友</span>
            </div>
          </div>
          <div className="cancel" onClick={this.handleHideMask}>取消</div>
        </div>
        <div className={`page-content ${this.state.isTimeExpired ? 'hide' : 'show'}`}>
          <div className={`mask ${this.state.isFlag ? 'show' : 'hide'}`} onClick={this.handleHideMask}></div>
          <div className={`masktwo ${this.state.isshowShareTip ? 'show' : 'hide'}`} onClick={this.handleHideMaskTwo}></div>
          <div className={`share-tip ${this.state.isshowShareTip ? 'show' : 'hide'}`}>
            <img className="wx-icon" src={shareWxTip} alt="" />
            <div className="wx-text"><img src={shareWxTextTip} alt="" /></div>
          </div>
          <div className="list-block order-info">
            <div className="card order-list">
              <div className="card-header">订单信息</div>
              <div className="card-content">
                <ul>
                  <li className="orderList-inner">
                    <div>订单编号</div>
                    <div>{this.state.merchantorderNum}</div>
                  </li>
                  <li className="orderList-inner" style={{ display: `${this.state.ch_call_tel ? '' : 'none'}` }}>
                    <div>{this.state.ch_call_id.chnName}</div>
                    <div>{this.state.ch_call_tel}</div>
                  </li>
                  <li className="orderList-inner" style={{ display: `${this.state.ch_id_code ? '' : 'none'}` }}>
                    <div>{this.state.ch_id.chnName}</div>
                    <div>{this.state.ch_id_code}</div>
                  </li>
                  <li className="orderList-inner" style={{ display: `${this.state.chnname ? '' : 'none'}` }}>
                    <div>{this.state.ch_name.chnName}</div>
                    <div>{this.state.chnname}</div>
                  </li>
                  <li className="orderList-inner" style={{ display: `${this.state.insurer_no.value ? '' : 'none'}` }}>
                    <div>{this.state.insurer_no.chnName}</div>
                    <div>{this.state.insurer_no.value}</div>
                  </li>
                  <li className="orderList-inner" style={{ display: `${this.state.merchantName ? '' : 'none'}` }}>
                    <div>商户名称</div>
                    <div>{this.state.merchantName}</div>
                  </li>
                </ul>
              </div>
              <div className="card-footer">
                <div>支付金额</div>
                <div className="price">&yen;{this.state.paymoney}</div>
              </div>
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
                  } else if (item.payTypeCode == 'DAIFU') {
                    return dom_daifu;
                  }
                })
              }
            </ul>
            <div className="checkButton">
              <a href="#" className="item-link buttonDefault" onClick={() => { this.handleSubmitPay()} }>去支付</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ConfirmOrder;
