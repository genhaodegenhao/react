import React from 'react';
import util from '../../utils/util';
import _h5t from '../../utils/h5t';
import '../../assets/css/mod_css/baodanOrder.less';
import wechatIco from '../../assets/img/baodan/icon_Wechat40x40@2x.png';
import alipayIco from '../../assets/img/baodan/icon_AliPay40x40@2x.png';
import shareIcon from '../../assets/img/baodan/shareicon.png';

class OrderQrcode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      merchantorderNum: sessionStorage.getItem('merchantorderNum'),
      payCode: sessionStorage.getItem('payCode'),
      baodanInfo: sessionStorage.getItem('baodanInfo'),
      qrCode: sessionStorage.getItem('personCode'),
      ch_name: '',
      chnname: '',
      paymoney: '',
    };
  }

  componentDidMount() {
    this.initQrCode();
    let qrCode = this.state.qrCode;
    if (!qrCode) {
      qrCode = sessionStorage.getItem('paychangeQrCode');
    } else {
      qrCode = sessionStorage.getItem('personCode');
    }
    this.initShare(qrCode);
    _h5t.track('pageview', {
      eventId: 'H5_baodanpay_P_orderQrcode',
    });
  }
  /* eslint-disable */
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
  initQrCode = () => {
    let strUrl = util.handleShareBaseUrl();
    let baseShareUrl = '';
    if (strUrl === '/stag') {
      baseShareUrl = 'https://pay.99bill.com/stage2/html/insurance-pay/index.html#!/?payCode=';
    } else if (strUrl === '/prod') {
      baseShareUrl = 'https://pay.99bill.com/prod/html/insurance-pay/index.html#!/?payCode=';
    } else {
      baseShareUrl = 'https://pay.99bill.com/stage2/html/insurance-pay/index.html#!/?payCode=';
    }
    let qrcode = new QRCode(document.getElementById('qrcode'), {});
    qrcode.makeCode(baseShareUrl+this.state.payCode);
    const dataInfo = JSON.parse(this.state.baodanInfo);
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

  render() {
    return (
      <div className="page">
        <div className="page-content">
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
                    <div className="text-right">￥{this.state.paymoney}</div>
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
