import React from 'react';
import _h5t from '../../utils/h5t';
import util from '../../utils/util';
import '../../assets/css/mod_css/baodanOrder.less';
import baodanIcon from '../../assets/img/baodan/icon_BaoXian@2x.png';
import scanIcon from '../../assets/img/baodan/icon_scan@2x.png';

class QueryOrderNum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      merchantorderNum: '',
      qrCode: sessionStorage.getItem('transQrcode'),
      userAgent: sessionStorage.getItem('userAgent'),
      isShow: true,
    };
  }

  componentDidMount() {
    this.handleShowPhoto();
    this.handleInitData();
    _h5t.track('pageview', {
      eventId: 'H5_baodanpay_P_queryOrderNum',
    });
  }
  /* eslint-disable */
  handleShowPhoto = () => {
    if (this.state.userAgent === 'GENERAL_BROWSER') {
      this.setState({
        isShow: false,
      });
    }
  };
  //初始化数据
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
        _this.setState({
          merchantName: data.merchantName
        })
      },
      error: function err(res) {
        window.app.alert(res);
      }
    })
  };
  initPage = () => {
    let _this = this;
    const option = {
      merchantId: JSON.parse(sessionStorage.getItem('businessInformation')).merchantId,
      terminalId: JSON.parse(sessionStorage.getItem('businessInformation')).terminalId,
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
      beforeSend: function besend(){
        window.app.smfCustomLoadOpen();
      },
      success: function succ(res) {
        window.app.smfCustomLoadClose();
        const data = JSON.parse(res);
        if (data.errCode === '00') {
          sessionStorage.setItem('baodanInfo', res);
          sessionStorage.setItem('merchantorderNum', _this.state.merchantorderNum);
          if (_this.state.userAgent === 'GENERAL_BROWSER') {
            window.$$.ajax({
              method: 'GET',
              url: process.env.FETCH_ENV.fetchUrl + '/base/3.0/system/time',
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
                const optioner = {
                  bizCode: 'sample',
                  type: '1',
                  deviceid: 'ffffffff-e3df-665a-ffff-ffffc4d418a1',
                  media: JSON.stringify(mediaData),
                };
                window.$$.ajax({
                  method: 'POST',
                  url: process.env.FETCH_ENV.fetchUrl + '/mam/3.0/scan/qrcode/create',
                  contentType: 'application/json;charset=UTF-8',
                  data: JSON.stringify(optioner),
                  headers: {
                    pubData: JSON.stringify({ 'c': 'H5', 'b': 'MKT', 'id': '102', 't': new Date() / 1 })
                  },
                  success: function succe(res) {
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
              error: function (res){
                window.app.alert(res);
              }
            })
          } else {
            window.app.mainView.router.load({
              url: 'p/confirmorder.html',
              animatePages: true,
            });
          }
        } else {
          window.app.alert(data.errMsg, '提示');
        }
      },
      error: function err(res) {
        window.app.alert(res);
      }
    });
  };

  handleOnChange = (e) => {
    this.setState({
      merchantorderNum: e.target.value,
    });
  };

  // 调起微信/支付宝扫描二维码/条形码
  handlePhoto = () => {
    let _this = this;
    if (this.state.userAgent === 'ALIPAY') {
      AlipayJSBridge.call('scan', {
        type: 'bar',
      }, function(result) {
        _this.setState({
          merchantorderNum: result.barCode,
        });
      });
    } else if (this.state.userAgent === 'WX') {
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

  handleSubmitQuery = () => {
    this.initPage();
    _h5t.track('trackevent', {
      eventId: 'H5_baodanpay_queryOrderNum',
    });
  };

  render() {
    return (
      <div className="page" style={{ background: '#fff' }}>
        <div className="page-content query-order">
          <div className="client-title">
            <div className="client-logo"><img src={baodanIcon} alt="" /></div>
            <div className="client-name">{this.state.merchantName}</div>
          </div>
          <div className="search-order-area list-block">
            <p className="order-text">您的订单编号</p>
            <div className="posi-input">
              <input style={{ lineHeight: '24px' }} className="order-input" type="text" onChange={this.handleOnChange} placeholder="请输入您的订单编号" value={this.state.merchantorderNum} />
              <div className={`paizhao ${this.state.isShow ? 'show' : 'hide'}`} onClick={this.handlePhoto}>
                <img src={scanIcon} alt="" />
              </div>
            </div>
            <div className="checkButton">
              <a href="#" className="item-link buttonDefault" onClick={this.handleSubmitQuery}>查询</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default QueryOrderNum;
