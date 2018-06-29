import React from 'react';

import style from './open-ele-account.less';
// import logo from '../../../assets/img/author/ic_logo_suzhouyinhang_golden.png';
// import fundSupportIcon from '../../../assets/img/investment/ic_logo_suzhouyinhang_small.png';
import { decryptByDES } from '../../../utils/ecbutil';
import { GetQueryStringUrl } from '../../../utils/util';
import h5t from '../../../utils/h5t';

class SuccessOpen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bankNo: '',
      bankName: window.sessionStorage.getItem('FINANCIAL_AUTHOR_ELECTRONBANKNAME'),
      bankId: window.sessionStorage.getItem('FINANCIAL_AUTHOR_CHANNEL').toLowerCase(),
    };
  }
  componentDidMount() {
    h5t.track('pageview', { eventId: 'H5_financialmarket_p_successopen' });
    const queryObj = GetQueryStringUrl(window.location.href);
    const _this = this;
    _this.setState({
      bankNo: decryptByDES(queryObj.accountNo),
      // bankName: queryObj.bankName,
      // bankId: (queryObj.bankId).toLowerCase(),
    });
  }
  goBack = () => {
    const backUrl = window.sessionStorage.getItem('FINANCIAL_AUTHOR_BACKURL');
    const { history } = this.props;
    history.push(backUrl);
  }
  render() {
    const { bankNo, bankName, bankId } = this.state;
    return (
      <div className={style.container}>
        <div className={style.bankCard}>
          <img src={`https://oms-cloud.99bill.com/h5/static/h5-resource/img/bank_icon/ic_logo_golden_${bankId}.png`} alt="bankLogo" className={style.logo} width="100" height="32" />
          <div className={style.bankNo}>{bankNo}</div>
        </div>
        <div className={style.tips}>
          <p>您的{bankName}电子账户已开户成功</p>
          <p>请妥善保管好您的电子账户信息，您也可以在银行服务号及【我的】里查看电子账户</p>
        </div>
        <div className={style.button} onClick={() => this.goBack()}>继续购买</div>
        <div className={style.footer}>
          <p>基金销售服务由<img src={`https://oms-cloud.99bill.com/h5/static/h5-resource/img/bank_icon/ic_logo_small_${bankId}.png`} alt="bank_icon" width="56" height="15" />提供</p>
          <p>基金销售资格证号  0000092X</p>
        </div>
      </div>
    );
  }
}
export default SuccessOpen;
