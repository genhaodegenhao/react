import React from 'react';
import { inject, observer } from 'mobx-react';
import { InputItem, List, Modal, Button } from 'antd-mobile';
import { getQueryString, setUrlParams } from '../../../utils/toolFunc';
import _h5t from '../../../utils/h5t';
import s from './financialInto.less';
import noSelectIcon from '../../../assets/img/investment/ic_normal.png';
import selectIcon from '../../../assets/img/investment/ic_selected.png';
import backIcon from '../../../assets/img/investment/ic_navigationBtn.png';

@inject('FinancialIntoModel')
@observer
class FinancialInto extends React.Component {
  constructor(props) {
    super(props);
    const search = this.props.history.location.search;
    this.state = {
      productName: getQueryString('prdName', search),
      channel: getQueryString('channel', search),
      productCode: getQueryString('prdCode', search),
      iconurl: 'https://oms-cloud.99bill.com/h5/static/h5-resource/img/bank_icon/',
    };
  }

  componentDidMount() {
    _h5t.track('pageview', {
      eventId: 'H5_financialmarket_p_financialInto',
    });
    this.props.FinancialIntoModel.getAccountInfoLister(this.state.channel);
    this.props.FinancialIntoModel.getMinimunAmt(this.state.channel, this.state.productCode);
  }
  // 获取验证码
  getValidateCoder = () => {
    _h5t.track('trackevent', {
      eventId: 'H5_financialmarket_intoGetValidateCode',
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
    this.props.FinancialIntoModel.getValidateCode(token, sendFlag);
  };
  // 输入金额
  changeInputAmt = (e) => {
    this.props.FinancialIntoModel.changeFlag(e);
  };
  // 隐藏浮层
  hideModelMask = () => {
    this.props.FinancialIntoModel.hideModelFlag();
  };
  // 勾选协议
  handleChooseDeal = () => {
    this.props.FinancialIntoModel.changeChooseDeal();
  };
  // 到充值页面
  handleGoCharge = () => {
    _h5t.track('trackevent', {
      eventId: 'H5_financialmarket_intoRecharge',
    });
    const bankId = this.props.FinancialIntoModel.accountInfoObj.bankId;
    this.props.history.push(`/recharge?channel=${bankId}`);
  };
  // 输入验证码
  changeInputCode = (e) => {
    this.props.FinancialIntoModel.handlevalidateCodeValue(e);
  };
  handleBuying = () => {
    if (this.props.FinancialIntoModel.buyingBtnFlag) {
      _h5t.track('trackevent', {
        eventId: 'H5_financialmarket_intoBuyingBtn',
      });
      this.props.FinancialIntoModel.showModelFlag();
    }
  };
  handleAgainBuying = () => {
    if (this.props.FinancialIntoModel.againBuyingBtnFlag) {
      _h5t.track('trackevent', {
        eventId: 'H5_financialmarket_intoAgainBuyingBtn',
      });
      this.props.FinancialIntoModel.confirmBuying(
        this.state.channel, this.state.productCode).then((data) => {
        const params = {
          interestToDate: data.interestToDate,
          balance: data.balance,
          startInterestDate: data.startInterestDate,
          channel: this.state.channel,
          prdCode: this.state.productCode,
          prdName: this.state.productName,
          bankName: this.props.FinancialIntoModel.accountInfoObj.bankName,
        };
        this.props.history.replace(`/success-into${setUrlParams(params)}`);
      });
    }
  };

  /* eslint-disable */
  render() {
    return (
      <div className="buyingPage">
        <div className={s.buyingPageBankName}>
          <div className={s.bankInner}>
            {this.props.FinancialIntoModel.accountInfoObj.bankName}
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
              {this.props.FinancialIntoModel.accountInfoObj.bankName}
              &nbsp;电子账户(尾号{this.props.FinancialIntoModel.pan})
            </div>
            <div className={s.availableBalance}>
              可用余额：
              {this.props.FinancialIntoModel.balancePrice}元
            </div>
          </div>
          <div onClick={this.handleGoCharge} className={s.charge}>充值</div>
        </div>
        <div className={s.buyingPagebuyingAmt}>
          <div className={s.buyingAmtTitle}>转入金额(元)</div>
          <div className={s.buyingAmt}>
            <List>
              <InputItem
                clear
                placeholder={this.props.FinancialIntoModel.minAmtPlaceHolder}
                onChange={this.changeInputAmt}
                type="number"
              />
            </List>
          </div>
          <div className={s.buyingTip}>
            {this.props.FinancialIntoModel.interestFlag ?
                <div>预计收益<span>{this.props.FinancialIntoModel.ownInterest}</span>元</div> : '当日起息，可随时提现'
            }
          </div>
        </div>
        <div onClick={this.handleChooseDeal} className={s.buyingPagebuyingAgreement}>
          <img className={s.selectIcon} src={`${this.props.FinancialIntoModel.chooseDealFlag ? selectIcon : noSelectIcon}`} alt="" />
          <span className={s.buyingAgreement}>确认购买即表示您阅读并接受 <a href="#">《相关协议》</a>并受其约束</span>
        </div>
        <div className={`${this.props.FinancialIntoModel.buyingBtnFlag ? s.activeBuyingBtn : s.buyingBtn}`} onClick={this.handleBuying}>确认转入</div>
        <div className={s.fundSupport}>
          <div className={s.texttop}>基金销售服务由<img src={`${this.state.iconurl}ic_logo_small_${this.state.channel.toLowerCase()}.png`} alt="banklogoicon" />提供</div>
          <div className={s.textbottom}>基金销售资格证号 123456X</div>
        </div>
        <Modal
            popup
            visible={this.props.FinancialIntoModel.showModel}
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
              <div className={s.codeMessage}>短信将发送至{this.props.FinancialIntoModel.phone}</div>
              <div className={s.codeMsg}>
                <InputItem
                  className={s.inputCode}
                  onChange={this.changeInputCode}
                />
                <Button
                  onClick={this.getValidateCoder}
                  disabled={this.props.FinancialIntoModel.sendCodeAbledFlag}
                >
                  {this.props.FinancialIntoModel.codeText}
                </Button>
              </div>
            </div>
            <div onClick={this.handleAgainBuying} className={`${this.props.FinancialIntoModel.againBuyingBtnFlag ? s.activeBuyingBtnAgain : s.buyingBtnAgain}`}>确认转入</div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default FinancialInto;
