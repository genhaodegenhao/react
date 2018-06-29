import React from 'react';
import {
  WhiteSpace,
  WingBlank,
  // List,
  Button,
  Flex,
  InputItem,
  // Message,
  Toast,
} from 'antd-mobile';
import { inject, observer } from 'mobx-react';
import { getQueryString } from '../../../utils/toolFunc';
import s from './verification.less';
import h5t from '../../../utils/h5t';

@inject('RechargeModel')
@observer
class Verification extends React.Component {
  constructor(props) {
    super(props);
    const search = props.history.location.search;
    this.state = {
      countS: props.RechargeModel.timerConf,
      disabledS: false,
      isReSend: false,
      channel: getQueryString('channel', search),
    };
  }

  componentDidMount() {
    h5t.track('pageview', { eventId: 'H5_financialmarket_p_rechargecode' });
    if (this.props.RechargeModel.accountInfo.phoneNo) {
      this.handleSendCode();
    } else {
      this.props.history.go(-1);
    }
  }

  handleSendCode = () => {
    h5t.track('trackevent', { eventId: 'H5_financialmarket_rechargeSendcode' });
    this.setState({
      disabledS: true,
      isReSend: true,
    }, () => {
      this.props.RechargeModel.sendCode().then(() => {
        Toast.success('验证码已发送');
        this.countTime();
        this.props.RechargeModel.setResendFlag();
      }).catch(() => {});
    });
  }

  handleCodeChange = (val) => {
    if (val.length > 0) {
      this.props.RechargeModel.setValidateCode(val);
      this.props.RechargeModel.setCodePass(true);
    } else {
      this.props.RechargeModel.setCodePass(false);
    }
  }

  countTime = () => {
    const time = setInterval(() => {
      if (this.state.countS > 1) {
        this.setState({
          countS: this.state.countS - 1,
        });
      } else {
        this.setState({
          disabledS: false,
          countS: this.props.RechargeModel.timerConf,
        }, () => {
          clearInterval(time);
        });
      }
    }, 1000);
  }

  handleSubmit = () => {
    h5t.track('trackevent', { eventId: 'H5_financialmarket_rechargeSubmit' });
    this.props.RechargeModel.recharge().then(() => {
      this.props.history.replace('/recharge-success');
    }).catch(() => {});
  }

  render() {
    return (
      <div className={s.wrap}>
        <WingBlank>
          <p>
            短信将发送至152****5336
          </p>
          <Flex>
            <Flex.Item>
              <InputItem
                placeholder="请输入验证码"
                className={s.inputItem}
                onChange={(val) => { this.handleCodeChange(val); }}
              />
            </Flex.Item>
            <Flex.Item>
              <Button
                type="primary"
                style={{
                  background: '#fff',
                  border: '1px solid #f54',
                  color: '#f54',
                }}
                disabled={this.state.disabledS}
                onClick={this.handleSendCode}
              >
                {this.state.disabledS ? `${this.state.countS}秒后可重新发送` : { false: '发送', true: '重新发送' }[this.state.isReSend]}
              </Button>
            </Flex.Item>
          </Flex>
          <WhiteSpace size="lg" />
          <WhiteSpace size="lg" />
          <Button
            type="primary"
            disabled={!this.props.RechargeModel.isCodePass}
            onClick={this.handleSubmit}
          >确认充值</Button>
        </WingBlank>
      </div>
    );
  }
}

export default Verification;
