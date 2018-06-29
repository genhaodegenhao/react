import React from 'react';
import {
  WhiteSpace,
  WingBlank,
  List,
  Button,
  InputItem,
  Toast,
} from 'antd-mobile';
import { inject, observer } from 'mobx-react';
import s from './recharge.less';
// import BankImg from '../../../assets/img/bankcard-icons/bank_abc.png';
import { getQueryString } from '../../../utils/toolFunc';
import h5t from '../../../utils/h5t';

const Item = List.Item;
const Brief = Item.Brief;

@inject('RechargeModel')
@observer
class Recharge extends React.Component {
  constructor(props) {
    super(props);
    const search = props.history.location.search;
    this.state = {
      channel: getQueryString('channel', search),
      iconurl: 'https://oms-cloud.99bill.com/h5/static/h5-resource/img/bank_icon/',
    };
  }

  componentDidMount() {
    h5t.track('pageview', { eventId: 'H5_financialmarket_p_recharge' });
    this.props.RechargeModel.getRechargeInfo({
      channel: this.state.channel,
    });
  }

  handleInputChange = (val) => {
    if (val > 0 && this.props.RechargeModel.rechargeInfo) {
      this.props.RechargeModel.setPass(true);
      this.props.RechargeModel.setRechargeAmount(val);
    } else {
      this.props.RechargeModel.setPass(false);
    }
  }

  handleSubmit = () => {
    h5t.track('trackevent', { eventId: 'H5_financialmarket_rechargeSaveAmount' });
    const rechargeInfo = this.props.RechargeModel.rechargeInfo;
    const rechargeAmount = this.props.RechargeModel.rechargeAmount;
    const payLimitEach = rechargeInfo.payLimitEach;

    if (parseFloat(payLimitEach) < parseFloat(rechargeAmount)) {
      Toast.fail('超过单笔限额');
    } else {
      this.props.history.replace(`/recharge-verification?channel=${this.state.channel}`);
    }
  }

  render() {
    const rechargeInfo = this.props.RechargeModel.rechargeInfo || {};
    const pan = rechargeInfo.pan;
    const substrPan = pan ? pan.substr(pan.length - 4, 4) : '-';

    const Img = (
      <div className={s.bankImg}>
        {/* <img src={BankImg} alt="bankicon" /> */}
        <img src={`${this.state.iconurl}bank_${this.state.channel.toLowerCase()}.png`} alt="bankicon" />
      </div>
    );
    return (
      <div className={`${s.wrap} rechargePage`}>
        <List renderHeader={() => `电子账号 | ${rechargeInfo.accountNo}`} >
          <Item
            multipleLine
            thumb={Img}
          >
            {rechargeInfo.bankName}
            电子账户（尾号{substrPan}）
            <Brief>单笔{rechargeInfo.payLimitEach || '-'}元， 单日{rechargeInfo.payLimitDay || '-'}元</Brief>
          </Item>
        </List>
        <WhiteSpace size="lg" />
        <List>
          <InputItem
            // type="number"
            placeholder="请输入充值金额"
            onChange={(val) => { this.handleInputChange(val); }}
            clear
          >
            金额（元）
          </InputItem>
        </List>
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
        <WingBlank>
          <Button
            type="primary"
            disabled={!this.props.RechargeModel.isPass}
            onClick={this.handleSubmit}
          >确认充值</Button>
        </WingBlank>
      </div>
    );
  }
}

export default Recharge;
