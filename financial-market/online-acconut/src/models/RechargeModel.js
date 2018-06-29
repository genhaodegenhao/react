/* eslint-disable consistent-return */
import {
  observable,
  action,
} from 'mobx';
import API from '../backend/api';
import ecbutil from '../utils/ecbutil';
import AccountModel from './AccountModel';

class RechargeModel {
  @observable timerConf = 59;

  @observable isPass = false;

  @observable isCodePass = false;

  @observable rechargeInfo = {};

  @observable accountInfo = {};

  @observable rechargeAmount = null;

  @observable validateCode = undefined;

  @observable codeToken = undefined;

  @observable resendFlag = 0;

  @observable rechargeResult = undefined;

  @action resetData() {
    this.isPass = false;
    this.isCodePass = false;
    this.rechargeInfo = undefined;
    this.accountInfo = undefined;
    this.rechargeAmount = null;
    this.validateCode = undefined;
    this.codeToken = undefined;
    this.resendFlag = 0;
    this.rechargeResult = undefined;
  }

  @action setPass(value) {
    this.isPass = value || false;
  }

  @action setCodePass(value) {
    this.isCodePass = value || false;
  }

  @action setRechargeInfo(value) {
    this.rechargeInfo = value;
  }

  @action setAccountInfo(value) {
    this.accountInfo = value;
  }

  @action setRechargeAmount(value) {
    this.rechargeAmount = value || 0;
  }

  @action setCodeToken(value) {
    this.codeToken = value;
  }

  @action setValidateCode(value) {
    this.validateCode = value;
  }

  @action setResendFlag() {
    if (this.resendFlag === 0) {
      this.resendFlag = 1;
    }
  }

  @action setRechargeResult(value) {
    this.rechargeResult = value;
  }

  @action async getRechargeInfo(params) {
    this.resetData();
    this.setPass(false);
    try {
      const res = await API.rechargeQueryAccount(params);
      const limitRes = await API.rechargeLimitAmt({
        channel: params.channel,
        businessType: 1,
      });
      const accountInfo = res.accountInfoList[0];

      this.setAccountInfo(accountInfo);

      this.setRechargeInfo({
        accountNo: ecbutil.decryptByDES(accountInfo.accountNo),
        balance: ecbutil.decryptByDES(accountInfo.balance),
        bankId: accountInfo.bankId,
        bankName: accountInfo.bankName,
        clientNo: accountInfo.clientNo,
        controlAmt: accountInfo.controlAmt,
        idImageFlag: accountInfo.idImageFlag,
        idNo: ecbutil.decryptByDES(accountInfo.idNo),
        pan: ecbutil.decryptByDES(accountInfo.pan),
        phoneNo: ecbutil.decryptByDES(accountInfo.phoneNo),
        userName: ecbutil.decryptByDES(accountInfo.userName),
        isOwnerCard: limitRes.isOwnerCard,
        payLimitDay: limitRes.payLimitDay,
        payLimitEach: limitRes.payLimitEach,
      });
      // this.setPass(true);
      return res;
    } catch (err) {
      console.log(err);
    }
  }

  @action async sendCode() {
    if (this.resendFlag === 0) {
      this.setCodePass(false);
    }
    const info = this.accountInfo || {};
    try {
      const res = await API.rechargeValidateCode({
        businessType: '1',
        channel: info.bankId,
        pan: info.pan,
        phoneNo: info.phoneNo,
        resendFlag: this.resendFlag,
        token: this.codeToken,
      });

      this.setCodeToken(res.token);

      return res;
    } catch (err) {
      throw (err);
    }
  }

  @action async recharge() {
    const info = this.accountInfo || {};
    try {
      const res = await API.recharge({
        amount: ecbutil.encryptByDES(this.rechargeAmount),
        channel: info.bankId,
        token: this.codeToken,
        validateCode: this.validateCode,
      });

      this.setRechargeResult(res.tradeStatus);
      AccountModel.addBalanceView(this.rechargeAmount);
      return res;
    } catch (err) {
      this.setRechargeResult('F');
      throw (err);
    }
  }
}

export default new RechargeModel();
