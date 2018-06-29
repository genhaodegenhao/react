import React from 'react';
import { Link } from 'react-router-dom';
import { List, InputItem, Toast } from 'antd-mobile';
import { inject, observer } from 'mobx-react';

import style from './bank-card-info.less';
import tipsImg from '../../../assets/img/author/ic_card_info.png';
import { isEmptyStr } from '../../../utils/toolFunc';
import { decryptByDES } from '../../../utils/ecbutil';
import h5t from '../../../utils/h5t';

@inject('AuthModel')
@observer
class BindCardInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      bankNo: '',
      active: false,
      bankName: '',
      bankLogo: '',
    };
  }
  componentDidMount() {
    h5t.track('pageview', { eventId: 'H5_financialmarket_p_bankCardInfo' });
    const bankInfo = window.sessionStorage.getItem('FINANCIAL_AUTHOR_BANKINFO');
    const _this = this;
    if (bankInfo) {
      _this.setState({
        bankNo: JSON.parse(bankInfo).pan,
        bankName: JSON.parse(bankInfo).bankName,
        bankLogo: JSON.parse(bankInfo).bankId,
      });
    }
  }
  nameChange = (e) => {
    this.setState({
      name: e,
    });
  }
  idCardNoChange = (e) => {
    this.setState({
      idCardNo: e,
    });
  }
  phoneChange = (e) => {
    if (e.length >= 11) {
      h5t.track('trackevent', { eventId: 'H5_financialmarket_phone' });
      this.setState({
        active: true,
      });
    } else {
      this.setState({
        active: false,
      });
    }
    this.setState({
      phone: e,
    });
  }
  nameTips = () => {
    Toast.info('为了您的账户安全，仅支持绑定本人的银行卡', 2);
  }
  phoneTips = () => {
    Toast.info('是您在办理该银行卡时预留的手机，请确保该手机号能正常接收短信', 2);
  }
  next = () => {
    const { phone } = this.state;
    const { history } = this.props;
    const reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if (phone.match(reg)) {
      history.push('/check-card');
      window.sessionStorage.setItem('FINANCIAL_AUTHOR_PHONE', phone);
    } else if (isEmptyStr(phone)) {
      Toast.info('请输入手机号码', 2);
    } else {
      Toast.info('您输入的手机号码有误，请检查后重新输入', 2);
    }
  }
  render() {
    const {
      // bankNo,
      bankName,
      bankLogo,
      phone,
      active,
    } = this.state;
    const name = window.sessionStorage.getItem('FINANCIAL_AUTHOR_NAME');
    const idCardNo = window.sessionStorage.getItem('FINANCIAL_AUTHOR_IDCARDNO');
    const tipsIcon = <img src={tipsImg} alt="tips" width="30" height="30" />;
    let bankNo = decryptByDES(this.state.bankNo);
    bankNo = bankNo.replace(/[ \f\t\v]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
    return (
      <div className={style.container}>
        <div className={style.cardInfo}>
          <img
            src={`http://oms-cloud.99bill.com/h5/static/h5-resource/img/bank_icon/bank_${bankLogo.toLowerCase()}.png`}
            alt="bank logo"
            width="20"
            height="20"
            style={{ verticalAlign: 'middle', marginRight: '5px' }}
          />
          {bankName}{bankNo}
        </div>
        <div>
          <List>
            <InputItem
              editable={false}
              placeholder="请输入姓名"
              defaultValue={decryptByDES(name)}
              extra={tipsIcon}
              onExtraClick={this.nameTips}
            >姓名</InputItem>
            <InputItem
              editable={false}
              placeholder="请输入身份证"
              defaultValue={decryptByDES(idCardNo)}
            >身份证</InputItem>
          </List>
        </div>
        <div style={{ marginTop: '12px' }}>
          <List>
            <InputItem
              placeholder="银行预留的手机号码"
              value={phone}
              onChange={this.phoneChange}
              extra={tipsIcon}
              onExtraClick={this.phoneTips}
            >手机号</InputItem>
          </List>
        </div>
        <div
          className={active ? style.activeBtn : style.disableBtn}
          onClick={() => this.next()}
        >下一步</div>
        <div className={style.confirm}>确认授权即表示同意 <Link to="/author-agreement" className={style.agreement}>《用户授权协议》</Link></div>
      </div>
    );
  }
}

export default BindCardInfo;
