import React from 'react';
import {
  WhiteSpace,
  WingBlank,
  Button,
  // Steps,
  Result,
  Icon,
} from 'antd-mobile';
import { inject, observer } from 'mobx-react';
import s from './verification.less';
import h5t from '../../../utils/h5t';

// const Step = Steps.Step;

@inject('RechargeModel')
@observer
class Success extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    h5t.track('pageview', { eventId: 'H5_financialmarket_p_rechargeresult' });
    if (!this.props.RechargeModel.rechargeResult) {
      this.props.history.go(-1);
    }
  }

  handleSubmit = () => {
    this.props.history.go(-1);
  }

  render() {
    const result = this.props.RechargeModel.rechargeResult;

    if (result === 'S') {
      h5t.track('trackevent', { eventId: 'H5_financialmarket_rechargeResultS' });
    } else if (result === 'F') {
      h5t.track('trackevent', { eventId: 'H5_financialmarket_rechargeResultF' });
    } else if (result === 'T') {
      h5t.track('trackevent', { eventId: 'H5_financialmarket_rechargeResultT' });
    }

    return (
      <div className={s.wrap}>
        {
          result === 'S' ? <Result
            img={<Icon type="check-circle" style={{ fill: '#1F90E6', width: '60px', height: '60px' }} />}
            title="充值成功！"
          // message="充值成功！"
          /> : null
        }

        {
          result === 'F' ? <Result
            img={<Icon type="cross-circle-o" style={{ width: '60px', height: '60px' }} />}
            title="充值失败！"
          // message="充值成功！"
          /> : null
        }

        {
          result === 'T' ? <Result
            img={<Icon type="ellipsis" style={{ width: '60px', height: '60px' }} />}
            title="交易处理中"
            message="请稍后查看交易结果"
          /> : null
        }

        <div style={{ background: '#fff' }}>
          <WhiteSpace size="lg" />
          <WhiteSpace size="lg" />
          <WingBlank>
            <Button type="primary" onClick={this.handleSubmit}>完成</Button>
            <WhiteSpace size="lg" />
            <WhiteSpace size="lg" />
          </WingBlank>
        </div>
      </div>
    );
  }
}

export default Success;
