import React from 'react';
import {
  WhiteSpace,
  WingBlank,
  List,
  Button,
  Toast,
  InputItem,
} from 'antd-mobile';
import { inject, observer } from 'mobx-react';
import s from './withdrawal.less';
// import BankImg from '../../../assets/img/bankcard-icons/bank_abc.png';
import { getQueryString } from '../../../utils/toolFunc';
import h5t from '../../../utils/h5t';

const Item = List.Item;
const Brief = Item.Brief;

@inject('WithdrawalModel')
@observer
class Withdrawal extends React.Component {
  constructor(props) {
    super(props);
    const search = props.history.location.search;
    this.state = {
      channel: getQueryString('channel', search),
      inputValue: null,
      iconurl: 'https://oms-cloud.99bill.com/h5/static/h5-resource/img/bank_icon/',
    };
  }

  componentDidMount() {
    h5t.track('pageview', { eventId: 'H5_financialmarket_p_withdrawal' });
    this.props.WithdrawalModel.getWithdrawalInfo({
      channel: this.state.channel,
    });
  }

  handleInputChange = (val) => {
    // const val = e.target.value;
    this.setState({
      inputValue: val,
    });
    if (val > 0 && this.props.WithdrawalModel.withdrawalInfo) {
      this.props.WithdrawalModel.setPass(true);
      this.props.WithdrawalModel.setWithdrawalAmount(val);
    } else {
      this.props.WithdrawalModel.setPass(false);
    }
  }

  handleSubmit = () => {
    h5t.track('trackevent', { eventId: 'H5_financialmarket_withdrawalSaveAmount' });
    const withdrawalInfo = this.props.WithdrawalModel.withdrawalInfo;
    const withdrawalAmount = this.props.WithdrawalModel.withdrawalAmount;
    const payLimitEach = withdrawalInfo.payLimitEach;

    if (parseFloat(payLimitEach) < parseFloat(withdrawalAmount)) {
      Toast.fail('超过单笔限额');
    } else {
      this.props.history.replace(`/withdrawal-verification?channel=${this.state.channel}`);
    }
  }

  handleAllWithdraw = () => {
    const withdrawalInfo = this.props.WithdrawalModel.withdrawalInfo || {};
    const balance = withdrawalInfo.balance;
    this.setState({
      inputValue: balance,
    }, () => {
      this.handleInputChange(balance);
    });
  }

  render() {
    const withdrawalInfo = this.props.WithdrawalModel.withdrawalInfo || {};
    const pan = withdrawalInfo.pan;
    const substrPan = pan ? pan.substr(pan.length - 4, 4) : '-';
    const balance = withdrawalInfo.balance;


    const Img = (
      <div className={s.bankImg}>
        {/* <img src={BankImg} alt="bankicon" /> */}
        <img src={`${this.state.iconurl}bank_${this.state.channel.toLowerCase()}.png`} alt="bankicon" />
      </div>
    );
    return (
      <div className={`${s.wrap} withdrawalPage`}>
        <List renderHeader={() => `账户总额 | ${balance || '-'}元`} >
          <Item
            multipleLine
            thumb={Img}
          >
            {withdrawalInfo.bankName}
            电子账户（尾号{substrPan}）
            <Brief>单笔{withdrawalInfo.payLimitEach || '-'}元， 单日{withdrawalInfo.payLimitDay || '-'}元</Brief>
          </Item>
        </List>
        <WhiteSpace size="lg" />
        <List>
          <Item>
            <div>提现金额（元）</div>
            <WhiteSpace size="lg" />
            {/* <input
              className={s.numberInput}
              // type="number"
              placeholder="请输入提现金额"
              onChange={(e) => { this.handleInputChange(e.target.value); }}
              value={this.state.inputValue}
            /> */}
            <div className="numberInputWrap">
              <InputItem
                // className={s.numberInput}
                // type="number"
                placeholder="请输入提现金额"
                onChange={this.handleInputChange}
                value={this.state.inputValue}
                clear
              />
            </div>
          </Item>
          <Item>
            <span>可提现金额 {balance || '-'} 元</span>
            <a style={{ float: 'right', color: '#6a9cd9' }} onClick={this.handleAllWithdraw}>全部提现</a>
          </Item>
        </List>
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
        <WingBlank>
          <Button
            type="primary"
            disabled={!this.props.WithdrawalModel.isPass}
            onClick={this.handleSubmit}
          >确认提现</Button>
        </WingBlank>
      </div>
    );
  }
}

export default Withdrawal;
