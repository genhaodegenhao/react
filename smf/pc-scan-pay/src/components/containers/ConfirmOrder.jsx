import React from 'react';
import util from '../../utils/util';
import _h5t from '../../utils/h5t';
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
import shareIcon from '../../assets/img/baodan/shareicon.png';

class ConfirmOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserAgent: window.sessionStorage.getItem('userAgent'),
      businessInformation: JSON.parse(sessionStorage.getItem('businessInformation')),
      payTypeListOne: [{ payTypeCode: 'WX', name: '微信', img: wechatIcon, imgDis: wechatIconDis }, { payTypeCode: 'DAIFU', name: '支付宝', img: alipayIcon, imgDis: alipayIconDis }, { payTypeCode: 'ALIPAY', name: '找人代付', img: daifuIcon, imgDis: daifuIcon }],
      payTypeListTwo: [{ payTypeCode: 'ALIPAY', name: '支付宝', img: alipayIcon, imgDis: alipayIconDis }, { payTypeCode: 'DAIFU', name: '找人代付', img: daifuIcon, imgDis: daifuIcon }, { payTypeCode: 'WX', name: '微信', img: wechatIcon, imgDis: wechatIconDis }],
      qrCode: '',
      payTypeLists: [],
      baodanInfo: sessionStorage.getItem('baodanInfo'),
      merchantorderNum: sessionStorage.getItem('merchantorderNum'),
      isOnWX: true,
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
      paymoney: '',
      qrcodeTime: '',
      merchantName: '', // 从这里开始
      orderAmount: '',
      outTradeNo: '',
      payAmount: '',
      hatInfo: {},
      goNext: false,
      orderNoPayBol: true,
      amtShowBol: false,
    };
  }
  /* eslint-disable */
  componentDidMount() {
    setTitle('确认订单');
    this.handleInitPage();
    this.innerOrderNoQuery();
    // this.handleBusniessInfo();
    // this.handleFromPage();
    console.log(window.media, 11)
    this.qrValide(window.media.qrCode);
  }


  handleTxnTime = (time) => {
    const timer = new Date(time);
    const year= timer.getFullYear();
    const month = timer.getMonth() < 10 ? ('0' + timer.getMonth()) : timer.getMonth();
    const day = timer.getDate() < 10 ? ('0' + timer.getDate()) : timer.getDate();
    return year + '-' + month + '-' + day;
  }

  //订单查询
  innerOrderNoQuery = () => {
    const url = 'https://ebd.99bill.com/coc-bill-api/csb/order/guideQuery';
    const option = {
      appId: 'coc-bill-api',
      requestTime: util.getNowFormatDate(),
      traceId: util.generateUUID(),
      innerOrderNo: window.innerOrderNo,
    };
    window.$$.ajax({
      url: url,
      method: 'POST',
      data: JSON.stringify(option),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      headers: {
        pubData: JSON.stringify({ 'c': 'H5', 'b': 'MKT', 'id': '102', 't': new Date() / 1 })
      },
      success: (res) => {
        if (res.rspCode === '0000') {
          if (res.txnFlg === 'S') {
            window.app.alert('订单重复，请勿重复支付');
            this.setState({
              amtShowBol: true,
            });
          } else {
            this.setState({
              orderNoPayBol: false,
            });
          }
          this.setState({
            outTradeNo: res.externalTraceNo,
            payAmount: res.amt,
            orderAmount: res.amt,
          });
        } else {
          window.app.alert(res.rspMsg);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  qrValide = (qrcode) => {
    const url = 'https://ebd.99bill.com/coc-bill-api/csb/qrcode/validate';
    const option = {
      appId: 'coc-bill-api',
      qrCode: qrcode,
    };
    window.$$.ajax({
      url: url,
      method: 'POST',
      data: JSON.stringify(option),
      contentType: 'application/json;charset=UTF-8',
      headers: {
        pubData: JSON.stringify({ 'c': 'H5', 'b': 'MKT', 'id': '102', 't': new Date() / 1 })
      },
      success: (res) => {
        console.log(res);
        const result = JSON.parse(res);
        console.log(result);
        this.setState({
          merchantName: result.merchantName,
          hatInfo: result,
        });

        setTimeout(() => {
          const obj = {
            "merchantName": result.merchantName,
            "merchantorderNum": this.state.outTradeNo,
            "paymoney": this.state.payAmount,
          };
          window.sessionStorage.setItem('resultDetail', JSON.stringify(obj));
        }, 0);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  //初始化分享功能
  initShare = (shareqrcode) => {
    let _this = this;
    window.$$.ajax({
      method: 'GET',
      url: 'https://ebd.99bill.com/coc-bill-api/base/3.0/system/time',
      contentType: 'application/json;charset=UTF-8',
      headers: {
        pubData: JSON.stringify({ 'c': 'H5', 'b': 'MKT', 'id': '102', 't': new Date() / 1 })
      },
      success: function succ(res) {
        const data = JSON.parse(res);
        const mediaData = {
          qrCode: shareqrcode,
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
          url: 'https://ebd.99bill.com/coc-bill-api/mam/3.0/scan/qrcode/create',
          contentType: 'application/json;charset=UTF-8',
          data: JSON.stringify(option),
          headers: {
            pubData: JSON.stringify({ 'c': 'H5', 'b': 'MKT', 'id': '102', 't': new Date() / 1 })
          },
          success: function succ(res) {
            const data = JSON.parse(res);
            if (data.errCode === '00') {
              sessionStorage.setItem('payCode', data.payCode);
              let str = util.handleShareBaseUrl();
              let baseShareUrl = '';
              if (str === '/stag') {
                baseShareUrl = 'https://pay.99bill.com/stage2/html/insurance-pay/index.html#!/?payCode=';
              } else if (str === '/prod') {
                baseShareUrl = 'https://pay.99bill.com/prod/html/insurance-pay/index.html#!/?payCode=';
              } else {
                baseShareUrl = 'https://pay.99bill.com/stage2/html/insurance-pay/index.html#!/?payCode=';
              }
              let share = {
                title: '保单付费',
                desc: '请您完成保单付费',
                link: baseShareUrl+data.payCode,
                imgUrl: shareIcon
              };
              window.wx.onMenuShareAppMessage({
                title: share.title,
                desc: share.desc,
                link: share.link,
                imgUrl: share.imgUrl,
                type: '', // 分享类型，music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function() {},
                cancel: function() {},
                fail: function() {}
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
  //从非查询接口过来getBusninessInfo
  handleBusniessInfo = () => {
    let erpMessage = this.state.businessInformation;
    let _this = this;
    if (!erpMessage) {
      let option = {
        appId: 'coc-bill-api',
        traceId: util.generateUUID(),
        requestTime: util.getNowFormatDate(),
        qrCode: sessionStorage.getItem('paychangeQrCode'),
      };
      window.$$.ajax({
        method:'POST',
        url:'https://ebd.99bill.com/coc-bill-api/csb/qrcode/validate',
        contentType:'application/json;charset=UTF-8',
        data:JSON.stringify(option),
        success: function succ(res) {
          sessionStorage.setItem('businessInformation', res);
          // _this.handleTunnelData();
        }
      })
    } else {
      // _this.handleTunnelData();
    }
  }
  //页面来源判断
  handleFromPage = () => {
    let shareQrcode = '';
    if (!this.state.qrCode) {
      this.setState({
        qrCode: sessionStorage.getItem('paychangeQrCode'),
      });
      shareQrcode = sessionStorage.getItem('paychangeQrCode');
      if (!shareQrcode) {
        shareQrcode = sessionStorage.getItem('personCode');
      }
    } else {
      let data = JSON.parse(this.state.baodanInfo);
      this.handlePackageData(data);
      shareQrcode = sessionStorage.getItem('personCode');
    }
    this.initShare(shareQrcode);
  };
  //获取保单信息
  handleTunnelData = () => {
    let _this = this;
    let businfo = JSON.parse(sessionStorage.getItem('businessInformation'));
    const option = {
      merchantId: businfo.merchantId,
      terminalId: businfo.terminalId,
      // merchantId: '812011145110001',
      // terminalId: '55555544',
      externalTraceNo: this.state.merchantorderNum,
    };
    window.$$.ajax({
      method: 'POST',
      url: 'https://ebd.99bill.com/coc-bill-api/mam/3.0/tais/oqs/order',
      contentType: 'application/json;charset=UTF-8',
      data: JSON.stringify(option),
      headers: {
        pubData: JSON.stringify({ 'c': 'H5', 'b': 'MKT', 'id': '102', 't': new Date() / 1 })
      },
      success: function succ(res) {
        sessionStorage.setItem('baodanInfo', res);
        const data = JSON.parse(res);
        if (data.errCode === '00') {
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
    return;
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
      paymoney: data.amt,
    });
  };
  handleInitPage = () => {
    const userAgent = this.state.isUserAgent;
    if (userAgent === 'WX') {
      this.setState({
        isOnWX: true,
        isOnAlipay: false,
        isChooseWX: true,
        isShareFriends: false,
        wxEnable: 1,
        zfbEnable: 0,
        payTypeLists: this.state.payTypeListOne,
      });
    } else if (userAgent === 'ALIPAY') {
      this.setState({
        isOnAlipay: true,
        isOnWX: false,
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
      url: 'https://ebd.99bill.com/coc-bill-api/base/3.0/system/time',
      contentType: 'application/json;charset=UTF-8',
      headers: {
        pubData: JSON.stringify({ 'c': 'H5', 'b': 'MKT', 'id': '102', 't': new Date() / 1 })
      },
      success: function succ(res) {
        const data = JSON.parse(res);
        const mediaData = {
          qrCode: _this.state.qrCode,
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
          url: 'https://ebd.99bill.com/coc-bill-api/mam/3.0/scan/qrcode/create',
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
  handleSubmitPay = () => {
    _h5t.track('trackevent', {
      eventId: 'H5_baodanpay_submitPay',
    });
    let _this = this;
    let code = '';
    if (window.sessionStorage.getItem('userAgent') === 'ALIPAY') {
      code = JSON.parse(sessionStorage.getItem('typevalue')).auth_code;
    } else if (window.sessionStorage.getItem('userAgent') === 'WX') {
      code = JSON.parse(sessionStorage.getItem('typevalue')).code;
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
        userAgent: window.sessionStorage.getItem('userAgent'),
      };
      let url = 'https://ebd.99bill.com/coc-bill-api/csb/useragent/queryOpenId';
      if (process.env.NODE_ENV === 'sandbox') {
        url = 'https://ebd-sandbox.99bill.com/coc-bill-api/csb/useragent/queryOpenId'
      }
      window.$$.ajax({
        method: 'POST',
        url: url,
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
      qrCode = sessionStorage.getItem('personCode');
    }
    let erpMessage = JSON.parse(sessionStorage.getItem('businessInformation'));
    if (!erpMessage) {
      erpMessage = JSON.parse(sessionStorage.getItem('businessInformation'));
    }
    let params = {
      appId: 'coc-bill-api', //hard code
      requestTime: util.getNowFormatDate(),
      traceId: util.generateUUID(),
      bizType: 1,
      openId:  openId,
      innerOrderNo: window.innerOrderNo,
      appType: this.state.isOnWX ? 'WECHATOA' : 'ALIPAYSW',
    };
    console.log(params);
    localStorage.setItem('externalTraceNo',params.externalTraceNo);
    payment.pay(
      params,
      (arg) => {
        console.log(arg.code, '支付返回的码值');
        try {
          if (arg.code == 0) {
            // localStorage.setItem('codeStatus', arg.code);
            // localStorage.setItem('appType', arg.appType);
            // localStorage.setItem('businessInformation', sessionStorage.getItem('businessInformation'));
            window.sessionStorage.setItem('hasPay', 'yes');
            app.mainView.router.load({
              url: 'p/ordersuccess.html',
              animatePages: false,
              pushState: false
            })
          } else if (arg.code === -4) {
            if (this.state.isUserAgent === 'ALIPAY') {
              AlipayJSBridge.call('popWindow');
            } else if (this.state.isUserAgent === 'WX') {
              wx.closeWindow();
            }
          }
        } catch (e) {}
      },
      (err) => {
        if (err.rspMsg) {
          window.app.alert(err.rspMsg);
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
    // const dom_daifu = <li className="item-content" onClick={this.handleDaifu}>
    //   <div className="item-inner">
    //     <div className="paytype-inner">
    //       <div className="item-icon"><img src={daifuIcon} alt="" /></div>
    //       <div className="item-title">找人代付</div>
    //     </div>
    //     <div className="item-iconcircle" style={{ marginRight: '0px' }}><img src={this.state.isChooseDaifu ? circleSel : circleDis} alt="" /></div>
    //   </div>
    // </li>;
    return (
      <div className="page">
        <div className="page-content">
          <div className={`mask ${this.state.isFlag ? 'show' : 'hide'}`} onClick={this.handleHideMask}></div>
          <div className={`masktwo ${this.state.isshowShareTip ? 'show' : 'hide'}`} onClick={this.handleHideMaskTwo}></div>
          <div className={`share-tip ${this.state.isshowShareTip ? 'show' : 'hide'}`}>
            <img className="wx-icon" src={shareWxTip} alt="" />
            <div className="wx-text"><img src={shareWxTextTip} alt="" /></div>
          </div>
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
          <div className="list-block order-info">
            <div className="card order-list">
              <div className="card-header">订单信息</div>
              <div className="card-content">
                <ul>
                  <li className="orderList-inner">
                    <div>商户名称</div>
                    <div>{this.state.merchantName}</div>
                  </li>
                  <li className="orderList-inner">
                    <div>订单编号</div>
                    <div>{this.state.outTradeNo}</div>
                  </li>
                  <li className="orderList-inner">
                    <div>订单金额</div>
                    <div>&yen;{this.state.orderAmount}</div>
                  </li>
                </ul>
              </div>
              {
                !this.state.amtShowBol ? (
                  <div className="card-footer">
                    <div>支付金额</div>
                    <div className="price">&yen;{this.state.payAmount}</div>
                  </div>
                ) : (
                  <div className="card-footer">
                    <div>订单状态</div>
                    <div className="price">已支付</div>
                  </div>
                )
              }
            </div>
          </div>
          <p className="paytype-text" style={{ display: `${this.state.orderNoPayBol ? 'none' : 'block'}` }}>请选择支付方式</p>
          <div className="list-block pay-type" style={{ display: `${this.state.orderNoPayBol ? 'none' : 'block'}` }}>
            <ul>
              {
                this.state.payTypeLists.map((item) => {
                  if (item.payTypeCode == 'WX') {
                    return dom_wx;
                  } else if (item.payTypeCode == 'ALIPAY') {
                    return dom_alipay;
                  } else if (item.payTypeCode == 'DAIFU') {
                    return null;
                  }
                })
              }
            </ul>
            <div className="checkButton">
              <a href="#" className="item-link buttonDefault" onClick={this.handleSubmitPay}>去支付</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ConfirmOrder;
