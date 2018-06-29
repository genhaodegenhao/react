import React from 'react';
import { inject, observer } from 'mobx-react';
import { Result, Icon, Button } from 'antd-mobile';
import { getQueryString, setUrlParams } from '../../../utils/toolFunc';
import _h5t from '../../../utils/h5t';
import s from './buyingSuccessPage.less';

@inject('BuyingPageModel')
@observer
class BuyingSuccessPage extends React.Component {
  constructor(props) {
    super(props);
    const search = this.props.history.location.search;
    this.state = {
      productName: getQueryString('prdName', search),
      returnRate: getQueryString('returnRate', search),
      channel: getQueryString('channel', search),
      productCode: getQueryString('prdCode', search),
      bankName: getQueryString('bankName', search),
      iconurl: 'https://oms-cloud.99bill.com/h5/static/h5-resource/img/bank_icon/',
    };
  }

  componentDidMount() {
    _h5t.track('pageview', {
      eventId: 'H5_financialmarket_p_buyingSuccess',
    });
    this.props.BuyingPageModel.getSuccessResult(this.state.channel);
  }
  handleFinish = () => {
    _h5t.track('trackevent', {
      eventId: 'H5_financialmarket_buyingSuccessFinish',
    });
    const params = {
      channel: this.state.channel,
      prdCode: this.state.productCode,
      prdName: this.state.productName,
      bankName: this.state.bankName,
    };
    this.props.BuyingPageModel.resetData();
    this.props.history.replace(`/fixedproduct-detail${setUrlParams(params)}`);
  };

  render() {
    return (
      <div className="buyingSuccessPage">
        <Result
          img={<Icon type="check-circle" className="spe" style={{ fill: '#1F90E6' }} />}
          title="您已经成功认领！"
        />
        <div className={s.productInfo}>
          <ul>
            <li className={s.productName}>
              <div className={s.innerLeft}>产品名称</div>
              <div className={s.innerRight}>
                {this.state.productName}
              </div>
            </li>
            <li className={s.productName}>
              <div className={s.innerLeft}>预计七日年化收益率</div>
              <div className={s.innerRight}>
                {this.state.returnRate}
              </div>
            </li>
            <li className={s.productName}>
              <div className={s.innerLeft}>购买金额</div>
              <div className={s.innerRight}>
                {this.props.BuyingPageModel.successResultAmt}
              </div>
            </li>
            <li className={s.productName}>
              <Button onClick={this.handleFinish} type="primary">完成</Button>
            </li>
          </ul>
        </div>
        <div className={s.fundSupport}>
          <div className={s.texttop}>基金销售服务由<img src={`${this.state.iconurl}ic_logo_small_${this.state.channel.toLowerCase()}.png`} alt="banklogoicon" />提供</div>
          <div className={s.textbottom}>基金销售资格证号 123456X</div>
        </div>
      </div>
    );
  }
}

export default BuyingSuccessPage;
