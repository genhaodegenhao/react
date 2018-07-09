import React from 'react';
import util from '../../utils/util';
import _h5t from '../../utils/h5t';
import '../../assets/css/mod_css/baodanOrder.less';
import setTitle from '../../backend/setTitle';
import successIcon from '../../assets/img/baodan/icon_success@2x.png';

class OrderSuccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userAgent: sessionStorage.getItem('userAgent'),
      baodanInfo: sessionStorage.getItem('baodanInfo'),
      businessInformation: JSON.parse(window.sessionStorage.getItem('businessInformation')),
      ch_name: '',
      chnname: '',
      merchantName: JSON.parse(sessionStorage.getItem('businessInformation')).merchantName,
      orderNum: '',
      merchantorderNum: sessionStorage.getItem('merchantorderNum'),
      paymoney: '',
    };
  }
  /* eslint-disable */
  componentDidMount() {
    setTitle('交易结果');
    this.initPage();
    _h5t.track('pageview', {
      eventId: 'H5_baodanpay_P_orderSuccess',
    });
  }
  initPage = () => {
    let _this = this;
    const option = {
      appId: 'coc-bill-api',
      requestTime: util.getNowFormatDate(),
      traceId: util.generateUUID(),
      merchantId: this.state.businessInformation.merchantId,
      externalTraceNo: this.state.merchantorderNum,
    };
    window.$$.ajax({
      method: 'POST',
      url: process.env.FETCH_ENV.fetchUrl + '/csb/order/guideQuery',
      contentType: 'application/json;charset=UTF-8',
      data: JSON.stringify(option),
      headers: {
        pubData: JSON.stringify({ 'c': 'H5', 'b': 'MKT', 'id': '102', 't': new Date() / 1 })
      },
      success: function succ(res) {
        let data = JSON.parse(res);
        const dataInfo = JSON.parse(_this.state.baodanInfo);
        const orderInfo = JSON.parse(dataInfo.tunnelData);
        let namer = '';
        const namestr = orderInfo.oqsExtDateInfo.ch_name.value || sessionStorage.getItem('baodanAuthRealName');
        if (namestr.length <= 2) {
          namer = util.handleChangeString(namestr, 0, 1);
        } else if (namestr.length >= 3) {
          const reg = /^(.).+(.)$/g;
          namer = namestr.replace(reg, '$1*$2');
        }
        _this.setState({
          ch_name: orderInfo.oqsExtDateInfo.ch_name || '投保人姓名',
          chnname: namer,
          paymoney: data.amt,
        });
      },
      error: function err(res) {
        window.app.alert(res);
      }
    });
  };

  handleSubmitFinish = () => {
    _h5t.track('trackevent', {
      eventId: 'H5_baodanpay_finish',
    });
    if (this.state.userAgent === 'ALIPAY') {
      AlipayJSBridge.call('popWindow');
    } else if (this.state.userAgent === 'WX') {
      wx.closeWindow();
    }
  };

  render() {
    return (
      <div className="page">
        <div className="page-content">
          <div className="order-success">
            <div className="success-tip">
              <div className="icon"><img src={successIcon} alt="" /></div>
              <div className="text">支付成功</div>
              <div className="price">&yen;{this.state.paymoney}</div>
            </div>
            <div className="card order-list">
              <div className="card-content">
                <ul>
                  <li className="orderList-inner" style={{ display: `${this.state.merchantName ? '' : 'none'}` }}>
                    <div className="text-left">商家</div>
                    <div className="text-right">{this.state.merchantName}</div>
                  </li>
                  <li className="orderList-inner" style={{ display: `${this.state.merchantorderNum ? '' : 'none'}` }}>
                    <div className="text-left">订单编号</div>
                    <div className="text-right">{this.state.merchantorderNum}</div>
                  </li>
                  <li className="orderList-inner" style={{ display: `${this.state.chnname ? '' : 'none'}` }}>
                    <div className="text-left">{this.state.ch_name.chnName}</div>
                    <div className="text-right">{this.state.chnname}</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="list-block">
            <div className="checkButton finish-btn">
              <a href="#" className="item-link buttonDefault" onClick={this.handleSubmitFinish}>完成</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderSuccess;
