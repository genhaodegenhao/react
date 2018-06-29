import React from 'react';
import { inject, observer } from 'mobx-react';
import { Result, Icon, Button } from 'antd-mobile';
import { getQueryString, setUrlParams } from '../../../utils/toolFunc';
import _h5t from '../../../utils/h5t';
import s from './success.less';

@inject('FinancialOutModel')
@observer
class SuccessOut extends React.Component {
  constructor(props) {
    super(props);
    const search = this.props.history.location.search;
    this.state = {
      channel: getQueryString('channel', search),
      productCode: getQueryString('prdCode', search),
      productName: getQueryString('prdName', search),
      bankName: getQueryString('bankName', search),
      iconurl: 'https://oms-cloud.99bill.com/h5/static/h5-resource/img/bank_icon/',
    };
  }

  componentDidMount() {
    _h5t.track('pageview', {
      eventId: 'H5_financialmarket_p_financialOutSuccess',
    });
  }
  handleClickHref = () => {
    _h5t.track('trackevent', {
      eventId: 'H5_financialmarket_outSuccessFinish',
    });
    const params = {
      prdCode: this.state.productCode,
      channel: this.state.channel,
      prdName: this.state.productName,
      bankName: this.state.bankName,
    };
    this.props.FinancialOutModel.resetData();
    this.props.history.replace(`/currentproduct-detail${setUrlParams(params)}`);
  };

  render() {
    return (
      <div>
        <div className="financialOut">
          <Result
            img={<Icon type="check-circle" className="spe" style={{ fill: '#1F90E6' }} />}
            title="转出成功！"
          />
        </div>
        <div className={s.productInfo}>
          <div className={s.finish}>
            <Button onClick={this.handleClickHref} type="primary">完成</Button>
          </div>
        </div>
        <div className={s.fundSupport}>
          <div className={s.texttop}>基金销售服务由<img src={`${this.state.iconurl}ic_logo_small_${this.state.channel.toLowerCase()}.png`} alt="banklogoicon" />提供</div>
          <div className={s.textbottom}>基金销售资格证号 123456X</div>
        </div>
      </div>
    );
  }
}

export default SuccessOut;
