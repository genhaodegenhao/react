import React from 'react';
import util from '../../utils/util';
import _h5t from '../../utils/h5t';
import '../../assets/css/mod_css/supply.less';

class OrderSuccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userAgent: sessionStorage.getItem('userAgent'),
      businessInformation: JSON.parse(window.sessionStorage.getItem('businessInformation')),
      merchantName: '',
      orderNum: '',
      showUnitInfo: '',
      paymoney: '',
      payTime: '',
    };
  }
  /* eslint-disable */
  componentDidMount() {
    this.initPage();
    document.title = this.state.businessInformation.branchName || this.state.businessInformation.merchantName;
    if (this.state.userAgent === 'ALIPAY') {
      AlipayJSBridge.call('setTitle', {
        title: this.state.businessInformation.branchName || this.state.businessInformation.merchantName,
      });
    }
    _h5t.track('pageview', {
      eventId: 'H5_goodSupply_P_orderSuccess',
    });
  }
  initPage = () => {
    let _this = this;
    const option = {
      appId: 'coc-bill-api',
      requestTime: util.getNowFormatDate(),
      traceId: util.generateUUID(),
      appType: localStorage.getItem('appType'),
      merchantId: this.state.businessInformation.merchantId,
      terminalId: this.state.businessInformation.terminalId,
      externalTraceNo: localStorage.getItem('externalTraceNo'),
      bizType: parseInt(this.state.businessInformation.bizType),
    };
    window.$$.ajax({
      method: 'POST',
      url: process.env.FETCH_ENV.fetchUrl + '/csb/order/query',
      contentType: 'application/json;charset=UTF-8',
      data: JSON.stringify(option),
      headers: {
        pubData: JSON.stringify({ 'c': 'H5', 'b': 'MKT', 'id': '102', 't': new Date() / 1 })
      },
      success: function succ(res) {
        let data = JSON.parse(res);
        let merchantname = data.branchName || data.merchantName;
        let showUnitNo = data.unitInfo.unitNo;
        let showUnitName = data.unitInfo.unitName;
        let showUnitInfo = '';
        if (!showUnitNo) {
          showUnitInfo = showUnitName;
        } else if (!showUnitName) {
          showUnitInfo = showUnitNo;
        } else if (showUnitNo && showUnitName) {
          showUnitInfo = showUnitNo + showUnitName;
        }
        _this.setState({
          showUnitInfo: showUnitInfo,
          merchantName: merchantname,
          orderNum: data.idBiz,
          paymoney: data.amt,
          payTime: data.txnTime,
        });
      },
      error: function err(res) {
        window.app.alert(res);
      }
    });
  };

  handleSubmitFinish = () => {
    _h5t.track('trackevent', {
      eventId: 'H5_goodSupply_finish',
    });
    if (this.state.userAgent === 'ALIPAY') {
      AlipayJSBridge.call('popWindow');
    } else if (this.state.userAgent === 'WX') {
      wx.closeWindow();
    }
  };

  render() {
    let btn_bg;
    if (this.state.userAgent === 'WX') {
      btn_bg = '#1AAD19';
    } else if (this.state.userAgent === 'ALIPAY') {
      btn_bg = '#1E82D2';
    }
    return (
      <div className="page">
        <div className="page-content">
          <div className="order-success">
            <div className="pay-message">
              <div className="pay-status">
                <p>{this.state.showUnitInfo}</p>
                <p>已完成支付</p>
              </div>
              <div className="pay-money">
                <span>实付金额：{this.state.paymoney}元</span>
              </div>
            </div>
            <div className="order-message">
              <p className="store-name">{this.state.merchantName}</p>
              <ul>
                <li className="item-message">
                  <label className="order-label">订单编号：</label>
                  <span className="order-input">{this.state.orderNum}</span>
                </li>
                <li className="item-message">
                  <label className="order-label">支付时间：</label>
                  <span className="order-input">{this.state.payTime}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="checkButton finish-btn">
            <a href="#" style={{ backgroundColor: btn_bg }} className="item-link buttonDefault" onClick={this.handleSubmitFinish}>完成</a>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderSuccess;
