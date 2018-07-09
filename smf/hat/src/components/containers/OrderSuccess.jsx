import React from 'react';
import util from '../../utils/util';
import _h5t from '../../utils/h5t';
import '../../assets/css/mod_css/baodanOrder.less';
import successIcon from '../../assets/img/baodan/icon_success@2x.png';
import errorIcon from '../../assets/img/baodan/icon_fail@2x.png';

class OrderSuccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userAgent: sessionStorage.getItem('userAgent'),
      baodanInfo: sessionStorage.getItem('baodanInfo'),
      businessInformation: JSON.parse(window.sessionStorage.getItem('businessInformation')),
      ch_name: '',
      chnname: '',
      merchantName: '',
      orderNum: '',
      merchantorderNum: sessionStorage.getItem('merchantorderNum'),
      paymoney: '',
      payTime: '',
      isExpire: false,
      isSuccess: true,
      errMsg: '',
    };
  }
  /* eslint-disable */
  componentDidMount() {

    // this.initPage();
    const obj = JSON.parse(window.sessionStorage.getItem('resultDetail'));
    this.setState({
      merchantName: obj.merchantName,
      merchantorderNum: obj.merchantorderNum,
      paymoney: obj.paymoney,
    });

    if (window.sessionStorage.getItem('hasPay') === 'yes') {
      return;
    }
    if (window.sessionStorage.getItem('hasExpireDate') === 'yes') {
      this.setState({
        isExpire: true,
        errMsg: '订单过期'
      });
    } else if (window.sessionStorage.getItem('isFunctionCodeError') === 'true') { // 处理functionCode的错误
      this.setState({
        isSuccess: false,
        errMsg: '不支持的平台类型'
      });
    } else {
      let isSuccess = false;
      let errorMessage = '';
      console.log(window.sessionStorage.getItem('orderStatus'));
      switch (window.sessionStorage.getItem('orderStatus')) {
        case '1':
          isSuccess = true;break;
        case '2':
          isSuccess = false; errorMessage = '订单失败';break;
        case '3':
          isSuccess = false; errorMessage = '订单受理中';break;
        case '4':
          isSuccess = false; errorMessage = '订单已取消';break;
        case '5':
          isSuccess = false; errorMessage = '撤销';break;
        case '6':
          isSuccess = false; errorMessage = '退货';break;
        case '7':
          isSuccess = false; errorMessage = '超时';break;
      }
      if (isSuccess) {
        this.setState({
          isSuccess: true
        });
      } else {
        this.setState({
          isSuccess: false,
          errMsg: errorMessage
        });
      }
    }
    // this.setState({
    //   merchantName: obj.merchantName,
    //   merchantorderNum: obj.merchantorderNum,
    //   paymoney: obj.paymoney,
    // });
    // _h5t.track('pageview', {
    //   eventId: 'H5_baodanpay_P_orderSuccess',
    // });
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
      externalTraceNo: this.state.merchantorderNum,
      bizType: parseInt(this.state.businessInformation.bizType),
    };
    window.$$.ajax({
      method: 'POST',
      url: 'https://ebd.99bill.com/coc-bill-api/csb/order/query',
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
        const namestr = orderInfo.oqsExtDateInfo.ch_name.value;
        if (namestr.length <= 2) {
          namer = util.handleChangeString(namestr, 0, 1);
        } else if (namestr.length >= 3) {
          const reg = /^(.).+(.)$/g;
          namer = namestr.replace(reg, '$1*$2');
        }
        _this.setState({
          ch_name: orderInfo.oqsExtDateInfo.ch_name,
          chnname: namer,
          merchantName: data.merchantName,
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
      eventId: 'H5_baodanpay_finish',
    });
    if (this.state.userAgent === 'ALIPAY') {
      AlipayJSBridge.call('popWindow');
    } else if (this.state.userAgent === 'WX') {
      wx.closeWindow();
    }
  };

  render() {
    const dom = (
      <ul>
        <li className="orderList-inner">
          <div className="text-left">商家</div>
          <div className="text-right">{this.state.merchantName}</div>
        </li>
        <li className="orderList-inner">
          <div className="text-left">订单编号</div>
          <div className="text-right">{this.state.merchantorderNum}</div>
        </li>
      </ul>
    );
    return (
      <div className="page">
        <div className="page-content">
          <div className="order-success">
            <div className="success-tip">
              <div className="icon"><img src={this.state.isSuccess && !this.state.isExpire ? successIcon : errorIcon} alt="" /></div>
              <div className="text">{this.state.isSuccess && !this.state.isExpire ? '支付成功' : this.state.errMsg}</div>
              {this.state.isSuccess && !this.state.isExpire ? (<div className="price">￥{this.state.paymoney}</div>) : null}
            </div>
            <div className="card order-list">
              <div className="card-content">
                {
                  this.state.isSuccess && !this.state.isExpire ? dom : null
                }
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
