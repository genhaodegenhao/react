import React from 'react';
import util from '../../utils/util';
import _h5t from '../../utils/h5t';
import ua from '../../utils/userAgent';
import sharewx from '../../utils/shareWechat';
import setTitle from '../../backend/setTitle';
import '../../assets/css/mod_css/baodanOrder.less';
import wechatIco from '../../assets/img/baodan/icon_Wechat40x40@2x.png';
import alipayIco from '../../assets/img/baodan/icon_AliPay40x40@2x.png';
import imgStep from '../../assets/img/baodan/img_step.svg';

class OrderQrcode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      merchantorderNum: sessionStorage.getItem('merchantorderNum'),
      baodanInfo: sessionStorage.getItem('baodanInfo'),
      qrCode: sessionStorage.getItem('transQrcode'),
      ch_name: '',
      chnname: '',
      paymoney: '',
      isShow: false,
    };
  }
  /* eslint-disable */
  componentDidMount() {
    setTitle('保单二维码');
    this.handleBrowserTip();
    let qrCode = this.state.qrCode;
    const merchantorderNum = this.state.merchantorderNum;
    if (!qrCode) {
      qrCode = sessionStorage.getItem('paychangeQrCode');
    }
    this.initShare(qrCode, merchantorderNum);
    if (ua.userAgent === 'GENERAL_BROWSER') {
      let option = {
        payCode: sessionStorage.getItem('transPaycode'),
      };
      if (option.payCode) {
        this.handleSafari(option);
      } else {
        const payCode = sessionStorage.getItem('payCode');
        this.handleCreateQrcode(payCode);
        const dataInfo = JSON.parse(this.state.baodanInfo);
        this.handleInfo(dataInfo);
      }
    } else if (ua.userAgent === 'WX' || ua.userAgent === 'ALIPAY') {
      const payCode = sessionStorage.getItem('payCode');
      this.handleCreateQrcode(payCode);
      const dataInfo = JSON.parse(this.state.baodanInfo);
      this.handleInfo(dataInfo);
    }
    _h5t.track('pageview', {
      eventId: 'H5_baodanpay_P_orderQrcode',
    });
  }
  //浏览器打开页面提示
  handleBrowserTip = () => {
    let userAgent = sessionStorage.getItem('userAgent');
    if (userAgent === 'GENERAL_BROWSER') {
      this.setState({
        isShow: true,
      });
    }
  };
  //隐藏提示
  handleHideTip = () => {
    this.setState({
      isShow: false,
    })
  };
  //初始化分享功能
  initShare = (shareqrcode, merchantorderNum) => {
    sharewx.shareWechatLink(shareqrcode, merchantorderNum);
  };
  //生成二维码
  handleCreateQrcode = (paycode) => {
    let strUrl = util.handleShareBaseUrl();
    let baseShareUrl = '';
    if (strUrl === '/stag') {
      baseShareUrl = 'https://pay.99bill.com/stage2/html/smf/baodanpay.html#!/?payCode=';
    } else if (strUrl === '/prod') {
      baseShareUrl = 'https://pay.99bill.com/prod/html/smf/baodanpay.html#!/?payCode=';
    } else if (strUrl === '/sand') {
      baseShareUrl = 'https://pay.99bill.com/sandbox/html/smf/baodanpay.html#!/?payCode=';
    } else {
      baseShareUrl = 'https://pay.99bill.com/stage2/html/smf/baodanpay.html#!/?payCode=';
    }
    let qrcode = new QRCode(document.getElementById('qrcode'), {});
    qrcode.makeCode(baseShareUrl+paycode);
  };
  //信息展示
  handleInfo = (dataInfo) => {
    const orderInfo = JSON.parse(dataInfo.tunnelData);
    let namer = '';
    const namestr = orderInfo.oqsExtDateInfo.ch_name.value;
    if (namestr.length <= 2) {
      namer = util.handleChangeString(namestr, 0, 1);
    } else if (namestr.length >= 3) {
      const reg = /^(.).+(.)$/g;
      namer =namestr.replace(reg, "$1*$2");
    }
    this.setState({
      ch_name: orderInfo.oqsExtDateInfo.ch_name,
      chnname: namer,
      paymoney: dataInfo.amt,
    });
  };
  //浏览器打开
  handleSafari = (param) => {
    let _this = this;
    this.handleCreateQrcode(param.payCode);
    window.$$.ajax({
      method: 'POST',
      url: process.env.FETCH_ENV.fetchUrl + '/mam/3.0/scan/qrcode/scan',
      contentType: 'application/json;charset=UTF-8',
      data: JSON.stringify(param),
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
              } else {
                window.app.alert('二维码已过期！');
              }
            },
            error: function err(resp) {
              window.app.alert(resp);
            }
          })
        } else {
          window.app.alert(data.errMsg);
        }
      },
      error: function error(error) {
        window.app.alert(error);
      }
    })
  };
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
        _this.handleTunnelData(res);
      }
    })
  };
  handleTunnelData = (data) => {
    let _this = this;
    let businfo = JSON.parse(data);
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
          _this.handleInfo(data);
        }
      },
      error: function err(res) {
        window.app.alert(res);
      }
    });
  };

  render() {
    return (
      <div className="page">
        <div className="page-content">
          <div className={`masktwo ${this.state.isShow ? 'show' : 'hide'}`}></div>
          <div className={`browser-tip ${this.state.isShow ? 'show' : 'hide'}`}>
            <div className="img-step"><img src={imgStep} alt=""/></div>
            <p className="text-title">请按照以下步骤，完成支付</p>
            <ul className="tip">
              <li className="tip-inner">
                <span className="inner-num">1></span>
                <span className="inner-item">将付款二维码截图保存至相册；</span>
              </li>
              <li className="tip-inner">
                <span className="inner-num">2></span>
                <span className="inner-item">打开微信/支付宝“扫一扫”，识别相册中的付款二维码。</span>
              </li>
            </ul>
            <p className="know" onClick={this.handleHideTip}>知道了</p>
          </div>
          <h2 className="qrcode-title">扫一扫，完成保单支付</h2>
          <div className="list-block qrcode-page">
            <div className="top-area">
              <div className="time">此二维码有效时间为24小时</div>
              <div className="qrcode" id="qrcode"></div>
              <div className="tip">打开微信或支付宝【扫一扫】</div>
              <div className="icon">
                <img src={wechatIco} alt="" />
                <img src={alipayIco} alt="" />
              </div>
              <div className=" circle circle-top">&nbsp;</div>
              <div className="circle circle-right">&nbsp;</div>
            </div>
            <div className="card order-list">
              <div className="circle circle-bottom">&nbsp;</div>
              <div className="circle circle-left">&nbsp;</div>
              <div className="card-content">
                <ul>
                  <li className="orderList-inner">
                    <div className="text-left">订单编号</div>
                    <div className="text-right">{this.state.merchantorderNum}</div>
                  </li>
                  <li className="orderList-inner">
                    <div className="text-left">{this.state.ch_name.chnName}</div>
                    <div className="text-right">{this.state.chnname}</div>
                  </li>
                  <li className="orderList-inner">
                    <div className="text-left">支付金额（元）</div>
                    <div className="text-right">&yen;{this.state.paymoney}</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderQrcode;
