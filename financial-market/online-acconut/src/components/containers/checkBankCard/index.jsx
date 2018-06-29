import React from 'react';
import {
  List,
  InputItem,
  Toast,
} from 'antd-mobile';

import style from './check-bank-card.less';
import api from '../../../backend/api';
import { encryptByDES } from '../../../utils/ecbutil';
import { setUrlParams } from '../../../utils/toolFunc';
import h5t from '../../../utils/h5t';

/* eslint-disable no-plusplus */

class CheckBankCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowCountdown: false,
      isFirstSendMsg: 0,
      token: '',
      validateCode: '',
      countDown: 59,
    };
  }
  componentDidMount() {
    h5t.track('pageview', { eventId: 'H5_financialmarket_p_checkBankCard' });
    window.sessionStorage.setItem('CHECKBANKCARD_TOTALTIMES', 60);
    this.sendMsg();
  }
  getValidateCode = (e) => {
    this.setState({
      validateCode: e,
    });
  }
  sendMsg = () => {
    h5t.track('trackevent', { eventId: 'H5_financialmarket_sendMsg' });
    const _this = this;
    const { isFirstSendMsg, token } = this.state;
    const bankCardInfo = window.sessionStorage.getItem('FINANCIAL_AUTHOR_BANKINFO');
    const channel = window.sessionStorage.getItem('FINANCIAL_AUTHOR_CHANNEL');
    const pan = JSON.parse(bankCardInfo).pan;
    const phoneNo = encryptByDES(window.sessionStorage.getItem('FINANCIAL_AUTHOR_PHONE'));
    const paramters = {
      businessType: 1,
      channel,
      pan,
      phoneNo,
      resendFlag: isFirstSendMsg,
      token,
    };
    api.sendMsg(paramters).then((res) => {
      if (res.respCode === '00') {
        _this.countDown();
        _this.setState({
          token: res.token,
        });
      } else {
        Toast.fail(res.errMsg, 1);
      }
    }).catch((e) => {
      Toast.fail(e.respMsg, 1);
    });
  }
  countDown = () => {
    const _this = this;
    this.setState({
      isShowCountdown: true,
      isFirstSendMsg: 1,
    });
    let totalTimes = window.parseInt(window.sessionStorage.getItem('CHECKBANKCARD_TOTALTIMES'));
    this.setState({
      countDown: totalTimes,
    });
    const interval = window.setInterval(() => {
      if (totalTimes === 0) {
        window.clearInterval(interval);
        window.sessionStorage.setItem('CHECKBANKCARD_TOTALTIMES', 60);
        _this.setState({
          isShowCountdown: false,
          countDown: 60,
        });
      } else if (totalTimes > 0) {
        totalTimes--;
        window.sessionStorage.setItem('CHECKBANKCARD_TOTALTIMES', totalTimes);
        _this.setState({
          countDown: totalTimes > 1 ? totalTimes : 1,
        });
      }
    }, 1000);
  }
  confirmOpen = () => {
    const { history } = this.props;
    const backImgFssId = window.sessionStorage.getItem('FINANCIAL_AUTHOR_BACKIMGFSSID');
    const frontImgFssId = window.sessionStorage.getItem('FINANCIAL_AUTHOR_FRONTIMGFSSID');
    const handheldImgFssId = window.sessionStorage.getItem('FINANCIAL_AUTHOR_HOLDIMGFSSID');
    const channel = window.sessionStorage.getItem('FINANCIAL_AUTHOR_CHANNEL');
    const { token } = this.state;
    const bankCardInfo = window.sessionStorage.getItem('FINANCIAL_AUTHOR_BANKINFO');
    let pan = '';
    let bankId = '';
    let bankName = '';
    const phoneNo = window.sessionStorage.getItem('FINANCIAL_AUTHOR_PHONE');
    if (bankCardInfo) {
      pan = JSON.parse(bankCardInfo).pan;
      bankId = JSON.parse(bankCardInfo).bankId;
      bankName = JSON.parse(bankCardInfo).bankName;
    }
    const { validateCode } = this.state;
    const paramters = {
      backImgFssId,
      frontImgFssId,
      handheldImgFssId,
      channel,
      token,
      validateCode,
      pan,
      bankId,
      bankName,
      phoneNo,
    };
    api.openElectronicAccount(paramters).then((res) => {
      if (res.respCode === '00') {
        const params = {
          accountNo: res.accountNo,
          bankName,
          bankId,
        };
        history.push(`/success-open${setUrlParams(params)}`);
      } else {
        Toast.fail(res.errMsg, 1);
      }
    }).catch((e) => {
      Toast.fail(e.respMsg, 1);
    });
  }
  render() {
    const { isShowCountdown, countDown } = this.state;
    const phone = window.sessionStorage.getItem('FINANCIAL_AUTHOR_PHONE');
    return (
      <div className={style.container}>
        <div className={style.messageInfo}>
          验证码已经发送至{phone}
        </div>
        <div className={style.message}>
          <div className={style.code}>
            <List>
              <InputItem
                placeholder="请输入验证码"
                onChange={this.getValidateCode}
                type="number"
              >验证码</InputItem>
            </List>
          </div>
          {
            !isShowCountdown
              ? <div className={style.sendBtn} onClick={() => this.sendMsg()}>发送验证码</div>
              : <div className={style.sendBtn}>{countDown}秒后重新发送</div>
          }
        </div>
        <div className={style.button} onClick={() => this.confirmOpen()}>确认</div>
      </div>
    );
  }
}

export default CheckBankCard;
