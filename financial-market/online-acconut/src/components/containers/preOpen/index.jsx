import React from 'react';
import { inject, observer } from 'mobx-react';

import style from './pre-ele-account.less';
import h5t from '../../../utils/h5t';

@inject('AuthModel')
@observer
class PreElectronicAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  componentDidMount() {
    h5t.track('pageview', { eventId: 'H5_financialmarket_p_preOpen' });
    const { AuthModel } = this.props;
    AuthModel.checkBankCertificate();
  }
  next = () => {
    const { history, AuthModel } = this.props;
    if (AuthModel.isShowUploadIdCards) {
      history.push('/upload-id');
    } else {
      history.push('/bind-card');
    }
  }
  render() {
    const bankLogo = window.sessionStorage.getItem('FINANCIAL_AUTHOR_CHANNEL');
    return (
      <div className={style.container}>
        <div className={style.bankCard}>
          <img src={`https://oms-cloud.99bill.com/h5/static/h5-resource/img/bank_icon/ic_logo_grey_${bankLogo.toLowerCase()}.png`} alt="bankLogo" className={style.logo} width="100" height="32" />
        </div>
        <div className={style.tips}>
          <p>即将为您开通一个银行电子账户</p>
          <p>应银行要求，需先开通银行电子账户，通过电子
          账户与银行直接进行交易，资金安全有保障。</p>
        </div>
        <div className={style.button} onClick={() => this.next()}>下一步</div>
        <div className={style.footer}>
          <p>基金销售服务由<img src={`https://oms-cloud.99bill.com/h5/static/h5-resource/img/bank_icon/ic_logo_small_${bankLogo.toLowerCase()}.png`} alt="bank_icon" width="56" height="15" />提供</p>
          <p>基金销售资格证号0000092X</p>
        </div>
      </div>
    );
  }
}

export default PreElectronicAccount;
