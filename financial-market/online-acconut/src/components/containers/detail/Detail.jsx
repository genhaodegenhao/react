import React from 'react';
import { List, Toast } from 'antd-mobile';
import { inject, observer } from 'mobx-react';
import s from './detail.less';

import card from '../../../assets/img/detail/ic_card.png';
import recharge from '../../../assets/img/detail/ic_recharge.png';
import phone from '../../../assets/img/detail/ic_phone.png';
import assets from '../../../assets/img/detail/ic_assets.png';
import h5t from '../../../utils/h5t';

const Item = List.Item; // eslint-disable-line no-unused-vars

@inject('AccountModel')
@observer
class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
    };
  }

  componentDidMount() {
    h5t.track('pageview', { eventId: 'H5_financialmarket_p_accountdetail' });
    // TODO
    console.log(this.props.AccountModel);
    console.log(this.props.AccountModel.getCurrentAcconutInfo, '+++++');
    const backId = this.props.AccountModel.getCurrentAcconutInfo.bankId;
    this.props.AccountModel.checkTotalAmt({ channel: backId }).then((res) => {
      console.log(res);
      this.props.AccountModel.setTotalAmt(res.totalAmt);
    });
  }

  goToRecharge = () => {
    h5t.track('trackevent', { eventId: 'H5_financialmarket_accdetailRecharge' });
    this.props.history.push({
      pathname: '/recharge',
      search: `?channel=${this.props.AccountModel.getCurrentAcconutInfo.bankId}`,
    });
  };

  goToWithdraw = () => {
    h5t.track('trackevent', { eventId: 'H5_financialmarket_accdetailWithdraw' });
    this.props.history.push({
      pathname: '/withdrawal',
      search: `?channel=${this.props.AccountModel.getCurrentAcconutInfo.bankId}`,
    });
  };

  goToInvestPage = () => {
    h5t.track('trackevent', { eventId: 'H5_financialmarket_accdetailInvestpage' });
    this.props.history.push({
      pathname: '/invest-page',
      search: `?channel=${this.props.AccountModel.getCurrentAcconutInfo.bankId}`,
    });
  };

  render() {
    const currentAccount = this.props.AccountModel.getCurrentAcconutInfo;
    console.log(currentAccount);
    const { pan, bankId, balance, phoneNo } = currentAccount;
    if (!pan || !bankId || balance < 0 || !phoneNo) {
      Toast.fail('银行卡信息查询错误，请稍后重试', 1);
      setTimeout(() => {
        this.props.history.goBack();
      }, 3000);
    }
    let backIconLightBule;
    let backIconSmall;

    const headThree = pan.substring(0, 3);

    const lastFour = pan.substring(pan.length - 4, pan.length);

    let star = '';

    console.log(pan.length);

    for (let i = 0; i < pan.length - 7; i += 1) {
      star += 'X';
    }

    const starText = `${headThree}${star}${lastFour}`;

    const headNumb = starText.substring(0, 4);
    const fiveToEight = starText.substring(4, 8);
    const tenToFourTeen = starText.substring(8, 12);
    const fiveTeenToLast = starText.substring(12, starText.length);

    console.log(headNumb, fiveToEight, tenToFourTeen, fiveTeenToLast);

    if (bankId === 'BSZ') {
      backIconLightBule = require('../../../assets/img/detail/bank_logo/ic_logo_suzhouyinhang_LightBlue.png');
      backIconSmall = require('../../../assets/img/detail/bank_logo/ic_logo_suzhouyinhang_small.png');
    } else {
      backIconLightBule = require('../../../assets/img/detail/bank_logo/ic_logo_nanjingyinhang_LightBlue.png');
      backIconSmall = require('../../../assets/img/detail/bank_logo/ic_logo_nanjingyinhang_small.png');
    }
    return (
      <div id="detail">
        <div className={s.accountInfoContainer}>
          <div className={s.baseInfoLayer}>
            <img src={backIconLightBule} className={s.bankImg} alt="银行" />
            <button className={s.recordButton} />
          </div>
          <div className={s.detailInfoLayer}>
            <div className={s.amtTips}>账户余额(元)</div>
            <div className={s.amt}>{balance}</div>
            <div className={s.cardId}>卡号：
              <span className={s.cardContent}>{headNumb}</span>
              <span className={s.cardContent}>{fiveToEight}</span>
              <span className={s.cardContent}>{tenToFourTeen}</span>
              <span className={s.cardContent}>{fiveTeenToLast}</span>
            </div>
          </div>
        </div>
        <div className={s.fucLayer}>
          <button className={s.funcButton} onClick={this.goToWithdraw}>
            <img src={card} alt="buttonIcon" className={s.buttonIcon} />
            <p className={s.funcButtonTxt}>提现</p>
          </button>
          <i className={s.line} />
          <button className={s.funcButton} onClick={this.goToRecharge}>
            <img src={recharge} alt="buttonIcon" className={s.buttonIcon} />
            <p className={s.funcButtonTxt}>充值</p>
          </button>
        </div>
        <div className={s.listItemLayer}>
          <div className="am-list-item am-list-item-middle">
            <div className="am-list-thumb">
              <img src={phone} alt="icon" />
            </div>
            <div className="am-list-line cover-am-list-line">
              <div className="am-list-content cover-am-list-content">
                <div className={s.listItemLabel}>预留手机号</div>
                <div className={s.listItemTxt}>{phoneNo}</div></div>
            </div>
          </div>
          <div className="am-list-item am-list-item-middle">
            <div className="am-list-thumb">
              <img src={assets} alt="icon" />
            </div>
            <div className="am-list-line" onClick={this.goToInvestPage}>
              <div className="am-list-content cover-am-list-content">
                <div className={s.listItemLabel}>理财资产</div>
                <div className={s.listItemNum}>{this.props.AccountModel.getTotalAmt}</div>
              </div>
              <div className="am-list-arrow am-list-arrow-horizontal" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className={s.bottomTips}>
          <div className={s.bottomTipsContent}>基金销售服务由<img src={backIconSmall} className={s.backIconLightBule} alt="back_icon" /> 提供</div>
          <div className={s.bottomTipsContentSmall}>基金销售资格证号  0000092X</div>
        </div>
      </div>

    );
  }
}

export default Detail;
