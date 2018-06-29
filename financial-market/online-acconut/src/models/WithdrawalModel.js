/* eslint-disable consistent-return */
import {
  observable,
  action,
} from 'mobx';
import API from '../backend/api';
import ecbutil from '../utils/ecbutil';
import AccountModel from './AccountModel';

class WithdrawalModel {
  @observable timerConf = 59;

  @observable isPass = false;

  @observable isCodePass = false;

  @observable withdrawalInfo = {};

  @observable accountInfo = {};

  @observable withdrawalAmount = null;

  @observable validateCode = undefined;

  @observable codeToken = undefined;

  @observable resendFlag = 0;

  @observable withdrawalResult = undefined;

  @action resetData() {
    this.isPass = false;
    this.isCodePass = false;
    this.withdrawalInfo = undefined;
    this.accountInfo = undefined;
    this.withdrawalAmount = null;
    this.validateCode = undefined;
    this.codeToken = undefined;
    this.resendFlag = 0;
    this.withdrawalResult = undefined;
  }

  @action setPass(value) {
    this.isPass = value || false;
  }

  @action setCodePass(value) {
    this.isCodePass = value || false;
  }

  @action setWithdrawalInfo(value) {
    this.withdrawalInfo = value;
  }

  @action setAccountInfo(value) {
    this.accountInfo = value;
  }

  @action setWithdrawalAmount(value) {
    this.withdrawalAmount = value || 0;
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

  @action setWithdrawalResult(value) {
    this.withdrawalResult = value;
  }

  @action async getWithdrawalInfo(params) {
    this.resetData();
    this.setPass(false);
    try {
      const res = await API.withdrawQueryAccount(params);
      const limitRes = await API.withdrawLimitAmt({
        channel: params.channel,
        businessType: 2,
      });
      const accountInfo = res.accountInfoList[0];

      this.setAccountInfo(accountInfo);

      this.setWithdrawalInfo({
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
      const res = await API.withdrawValidateCode({
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
      throw err;
    }
  }

  @action async withdrawal() {
    const info = this.accountInfo || {};
    try {
      const res = await API.withdraw({
        amount: ecbutil.encryptByDES(this.withdrawalAmount),
        channel: info.bankId,
        token: this.codeToken,
        validateCode: this.validateCode,
      });

      this.setWithdrawalResult(res.tradeStatus);
      AccountModel.minusBalanceView(this.withdrawalAmount);
      return res;
    } catch (err) {
      this.setWithdrawalResult('F');
      throw err;
    }
  }
}

export default new WithdrawalModel();
