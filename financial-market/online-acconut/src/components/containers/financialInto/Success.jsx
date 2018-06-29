import React from 'react';
import { inject, observer } from 'mobx-react';
import { Result, Icon, Button, Steps } from 'antd-mobile';
import { getQueryString, setUrlParams } from '../../../utils/toolFunc';
import ecbutil from '../../../utils/ecbutil';
import _h5t from '../../../utils/h5t';
import s from './success.less';

const Step = Steps.Step;
@inject('FinancialIntoModel')
@observer
class SuccessInto extends React.Component {
  constructor(props) {
    super(props);
    const search = this.props.history.location.search;
    this.state = {
      balanceInfo: '成功转入' + ecbutil.decryptByDES(getQueryString('balance', search)) +'元', // eslint-disable-line
      interestToDate: getQueryString('interestToDate', search),
      startInterestDate: getQueryString('startInterestDate', search),
      channel: getQueryString('channel', search),
      productCode: getQueryString('prdCode', search),
      productName: getQueryString('prdName', search),
      bankName: getQueryString('bankName', search),
      iconurl: 'https://oms-cloud.99bill.com/h5/static/h5-resource/img/bank_icon/',
    };
  }

  componentDidMount() {
    _h5t.track('pageview', {
      eventId: 'H5_financialmarket_p_financialIntoSuccess',
    });
  }
  handleClickHref = () => {
    _h5t.track('trackevent', {
      eventId: 'H5_financialmarket_intoSuccessFinish',
    });
    const params = {
      prdCode: this.state.productCode,
      channel: this.state.channel,
      prdName: this.state.productName,
      bankName: this.state.bankName,
    };
    this.props.FinancialIntoModel.resetData();
    this.props.history.replace(`/currentproduct-detail${setUrlParams(params)}`);
  };

  render() {
    return (
      <div>
        <div className="financialInto">
          <Result
            img={<Icon type="check-circle" className="spe" style={{ fill: '#1F90E6' }} />}
            title="转入成功！"
          />
        </div>
        <div className={s.productInfo}>
          <div className={s.stepInto}>
            <Steps size="small">
              <Step title={this.state.balanceInfo} description="" />
              <Step title={this.state.startInterestDate} description="开始计算收益" />
              <Step title={this.state.interestToDate} description="预计收益到账" />
            </Steps>
          </div>
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

export default SuccessInto;
