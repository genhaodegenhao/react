import React from 'react';
import { inject, observer } from 'mobx-react';
import { InputItem, List, Modal, Button, Radio } from 'antd-mobile';
import { getQueryString, setUrlParams } from '../../../utils/toolFunc';
import _h5t from '../../../utils/h5t';
import s from './financialOut.less';
import selectIcon from '../../../assets/img/investment/ic_selected.png';
import noSelectIcon from '../../../assets/img/investment/ic_normal.png';
import backIcon from '../../../assets/img/investment/ic_navigationBtn.png';

const RadioItem = Radio.RadioItem;
@inject('FinancialOutModel')
@observer
class FinancialOut extends React.Component {
  constructor(props) {
    super(props);
    const search = this.props.history.location.search;
    this.state = {
      channel: getQueryString('channel', search),
      productCode: getQueryString('prdCode', search),
      productName: getQueryString('prdName', search),
      iconurl: 'https://oms-cloud.99bill.com/h5/static/h5-resource/img/bank_icon/',
      outValueType: 1,
    };
  }

  componentDidMount() {
    _h5t.track('pageview', {
      eventId: 'H5_financialmarket_p_financialOut',
    });
    this.props.FinancialOutModel.getAccountInfoLister(this.state.channel);
    this.props.FinancialOutModel.getMinimunAmt(this.state.channel, this.state.productCode);
  }
  onChange2 = (value) => {
    _h5t.track('trackevent', {
      eventId: 'H5_financialmarket_outChooseType',
    });
    this.setState({
      outValueType: value,
    });
  };
  // 获取验证码
  getValidateCoder = () => {
    _h5t.track('trackevent', {
      eventId: 'H5_financialmarket_outGetValidateCode',
    });
    const token = sessionStorage.getItem('codeToken');
    const firstsendFlag = 0;
    const resendFlag = 1;
    let sendFlag;
    if (token === null || token === undefined) {
      sendFlag = firstsendFlag;
    } else {
      sendFlag = resendFlag;
    }
    this.props.FinancialOutModel.getValidateCode(token, sendFlag);
  };
  // 输入金额
  changeInputAmt = (e) => {
    this.props.FinancialOutModel.changeFlag(e);
  };
  // 全部转出
  allOutMoney = () => {
    _h5t.track('trackevent', {
      eventId: 'H5_financialmarket_allOut',
    });
    const buyingPricer = this.props.FinancialOutModel.totalBalance;
    this.props.FinancialOutModel.changeAllOutMoney(buyingPricer);
  };
  // 隐藏浮层
  hideModelMask = () => {
    this.props.FinancialOutModel.hideModelFlag();
  };
  // 勾选协议
  handleChooseDeal = () => {
    this.props.FinancialOutModel.changeChooseDeal();
  };
  // 输入验证码
  changeInputCode = (e) => {
    this.props.FinancialOutModel.handlevalidateCodeValue(e);
  };

  handleBuying = () => {
    if (this.props.FinancialOutModel.buyingBtnFlag) {
      _h5t.track('trackevent', {
        eventId: 'H5_financialmarket_outBuyingBtn',
      });
      this.props.FinancialOutModel.showModelFlag();
    }
  };
  handleAgainBuying = () => {
    if (this.props.FinancialOutModel.againBuyingBtnFlag) {
      _h5t.track('trackevent', {
        eventId: 'H5_financialmarket_outAgainBuyingBtn',
      });
      this.props.FinancialOutModel.confirmBuying(
        this.state.channel, this.state.productCode, this.state.outValueType).then(() => {
        const params = {
          channel: this.state.channel,
          prdCode: this.state.productCode,
          prdName: this.state.productName,
          bankName: this.props.FinancialOutModel.accountInfoObj.bankName,
        };
        this.props.FinancialOutModel.resetData();
        this.props.history.replace(`/success-out${setUrlParams(params)}`);
      });
    }
  };

  render() {
    const { outValueType } = this.state;
    const data2 = [
      { value: 0, label: '快速转出', extra: '预计2小时到账，今日无收益' },
      { value: 1, label: '普通转出', extra: '预计一个工作日到账，无限额，今日仍有收益' },
    ];
    return (
      <div className="buyingPage financialOutPage">
        <div className={s.buyingPageBankName}>
          <div className={s.bankInner}>
            {this.props.FinancialOutModel.accountInfoObj.bankName}
          </div>
          <div className={s.divide}>&nbsp;</div>
          <div className={s.bankProduct}>
            {this.state.productName}
          </div>
        </div>
        <div className={s.buyingPagebankInfo}>
          <div className={s.bankIcon}>
            <img src={`${this.state.iconurl}bank_${this.state.channel.toLowerCase()}.png`} alt="bankicon" />
          </div>
          <div className={s.bankDec}>
            <div className={s.bankInfo}>
              {this.props.FinancialOutModel.accountInfoObj.bankName}
              &nbsp;电子账户(尾号{this.props.FinancialOutModel.pan})
            </div>
            <div className={s.availableBalance}>
              <span>
                单笔{this.props.FinancialOutModel.payLimitDay}元，
                单日{this.props.FinancialOutModel.payLimitEach}元
              </span>
            </div>
          </div>
        </div>
        <div className={s.buyingPagebuyingAmt}>
          <div className={s.buyingAmtTitle}>转出金额(元)</div>
          <div className={s.buyingAmt}>
            <List>
              <InputItem
                clear
                placeholder="请输入转出金额"
                onChange={this.changeInputAmt}
                value={this.props.FinancialOutModel.buyingPrice}
              />
            </List>
          </div>
          <div className={s.allOut}>
            <div className={s.buyingTip}>
              本次最多可转出
              <span>{this.props.FinancialOutModel.totalBalance}</span>
              元
            </div>
            <div onClick={this.allOutMoney} className={s.allOutText}>全部转出</div>
          </div>
        </div>
        <div className={s.outType}>
          <div className={s.outText}>
            <div className={s.outTip}>转出方式</div>
            <div className={s.outRule}>转出规则</div>
          </div>
          <div className={s.chooseType}>
            <List>
              {data2.map(i => (
                <RadioItem
                  key={i.value}
                  checked={outValueType === i.value}
                  onChange={() => this.onChange2(i.value)}
                >
                  {i.label}
                  <List.Item.Brief>{i.extra}</List.Item.Brief>
                </RadioItem>
              ))}
            </List>
          </div>
        </div>
        <div onClick={this.handleChooseDeal} className={s.buyingPagebuyingAgreement}>
          <img className={s.selectIcon} src={`${this.props.FinancialOutModel.chooseDealFlag ? selectIcon : noSelectIcon}`} alt="" />
          <span className={s.buyingAgreement}>确认购买即表示您阅读并接受 <a href="#">《相关协议》</a>并受其约束</span>
        </div>
        <div className={`${this.props.FinancialOutModel.buyingBtnFlag ? s.activeBuyingBtn : s.buyingBtn}`} onClick={this.handleBuying}>确认转出</div>
        <div className={s.fundSupport}>
          <div className={s.texttop}>基金销售服务由<img src={`${this.state.iconurl}ic_logo_small_${this.state.channel.toLowerCase()}.png`} alt="banklogoicon" />提供</div>
          <div className={s.textbottom}>基金销售资格证号 123456X</div>
        </div>
        <Modal
          popup
          visible={this.props.FinancialOutModel.showModel}
          onClose={this.hideModelMask}
          animationType="slide-up"
          className="buyingPageGetCode"
        >
          <div className={s.verifyCodeArea}>
            <div className={s.backArea}>
              <div className={s.backAreaIcon} onClick={this.hideModelMask}><img className={s.backIcon} src={backIcon} alt="" /></div>
              <div className={s.title}>请输入短信验证码</div>
            </div>
            <div className={s.codeInfo}>
              <div className={s.codeMessage}>短信将发送至{this.props.FinancialOutModel.phone}</div>
              <div className={s.codeMsg}>
                <InputItem
                  className={s.inputCode}
                  onChange={this.changeInputCode}
                />
                <Button
                  onClick={this.getValidateCoder}
                  disabled={this.props.FinancialOutModel.sendCodeAbledFlag}
                >
                  {this.props.FinancialOutModel.codeText}
                </Button>
              </div>
            </div>
            <div onClick={this.handleAgainBuying} className={`${this.props.FinancialOutModel.againBuyingBtnFlag ? s.activeBuyingBtnAgain : s.buyingBtnAgain}`}>确认转出</div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default FinancialOut;
