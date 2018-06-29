/* eslint-disable consistent-return */
import { observable, action, computed } from 'mobx';
import { Toast } from 'antd-mobile';
import util from '../utils/util';
import api from '../backend/api';
import ecbutil from '../utils/ecbutil';

class BuyingPageModel {
  @observable buyingBtnFlag = false;
  @observable showModel = false;
  @observable sendCodeFlag = false;
  @observable againBuyingBtnFlag = false;
  @observable sendCodeAbledFlag = false;
  @observable chooseDealFlag = false;
  @observable interestFlag = false;
  @observable countDownSed = 60;
  @observable timer;
  @observable returnRateValue = '';
  @observable investPeriodValue = '';
  @observable codeText = '获取验证码';
  @observable minAmt = '';
  @observable minAmtPlaceHolder = '';
  @observable buyingPrice = '';
  @observable phone = '';
  @observable balancePrice = '';
  @observable pan = '';
  @observable validateCodeValue = '';
  @observable accountInfoObj = {};
  @observable successResultAmt = '';
  @observable confirmBuyingObj = {};
  @computed get ownInterest() {
    return ((this.buyingPrice * this.returnRateValue * this.investPeriodValue) / 36500).toFixed(2);
  }
  @action resetData() {
    this.buyingBtnFlag = false;
    this.showModel = false;
    this.sendCodeFlag = false;
    this.sendCodeAbledFlag = false;
    this.againBuyingBtnFlag = false;
    this.chooseDealFlag = false;
    this.interestFlag = false;
    this.buyingPrice = '';
    this.returnRateValue = '';
    this.investPeriodValue = '';
    this.countDownSed = 60;
    this.codeText = '获取验证码';
    clearInterval(this.timer);
  }
  @action async getAccountInfoLister(bankId) {
    this.resetData();
    const params = {
      channel: bankId,
    };
    const response = await api.checkAccount(params);
    this.handleAccountInfo(response);
  }
  @action handleAccountInfo(data) {
    if (data.respCode === '00') {
      this.accountInfoObj = data.accountInfoList[0];
      console.log(data.accountInfoList[0]);
      this.phone = util.handleChangeString(
        ecbutil.decryptByDES(data.accountInfoList[0].phoneNo), 3, 4
      );
      this.balancePrice = ecbutil.decryptByDES(data.accountInfoList[0].balance);
      this.pan = ecbutil.decryptByDES(data.accountInfoList[0].pan).substr(-4);
    }
  }
  @action async getMinimunAmt(bankId, prdCode) {
    const params = {
      channel: bankId,
      productCode: prdCode,
    };
    console.log(params);
    const response = await api.getMinAmt(params);
    this.handleMinimunAmt(response);
  }
  @action handleMinimunAmt(data) {
    if (data.respCode === '00') {
      this.minAmt = Math.floor(data.productDescInfo.productInfo.investAmtFrom);
      this.minAmtPlaceHolder = Math.floor(data.productDescInfo.productInfo.investAmtFrom) + '元起投，1元递增'; // eslint-disable-line
      this.returnRateValue = parseFloat(data.productDescInfo.productInfo.returnRate); // eslint-disable-line
      this.investPeriodValue = parseInt(data.productDescInfo.productInfo.investPeriod); // eslint-disable-line
    }
  }
  @action changeFlag(value) {
    this.buyingPrice = value;
    if (this.buyingPrice.indexOf('.') > -1) { // eslint-disable-line
      Toast.info('转入金额应为整数!', 2);
    }
    this.commonFun();
  }
  @action showModelFlag() {
    if (parseFloat(this.buyingPrice) > parseFloat(this.balancePrice)) { // eslint-disable-line
      Toast.info('您的余额不足!', 2);
      return;
    }
    this.showModel = true;
  }
  @action hideModelFlag() {
    this.showModel = false;
  }
  @action changeChooseDeal() {
    this.chooseDealFlag = !this.chooseDealFlag;
    this.commonFun();
  }
  @action commonFun() {
    if (this.buyingPrice >= this.minAmt && this.chooseDealFlag) {
      this.buyingBtnFlag = true;
      this.interestFlag = true;
    } else {
      this.buyingBtnFlag = false;
      this.interestFlag = false;
    }
  }
  @action changeCodeText(value) {
    if (value <= 0) {
      value = '重新发送'; // eslint-disable-line
    } else {
      value = util.addPreZero(value) + 's后可重新发送'; // eslint-disable-line
    }
    this.codeText = value;
  }
  @action disableSendCode() {
    this.sendCodeAbledFlag = true;
  }
  @action enableSendCode() {
    this.sendCodeAbledFlag = false;
  }
  @action async getValidateCode(codetoken, resendflag) {
    const params = {
      channel: 0,
      token: codetoken,
      businessType: 1,
      pan: this.accountInfoObj.pan,
      phoneNo: this.accountInfoObj.phoneNo,
      resendFlag: resendflag,
    };
    const data = await api.validateCode(params);
    this.handleValidateCode(data);
  }
  @action handleValidateCode(data) {
    if (data.respCode === '00') {
      Toast.success('验证码发送成功', 2);
      sessionStorage.setItem('codeToken', data.token);
      this.sendCodeFlag = true;
      let sec = this.countDownSed;
      this.changeCodeText(sec);
      this.disableSendCode();
      this.timer = setInterval(() => {
        sec = sec - 1; // eslint-disable-line
        this.changeCodeText(sec);
        if (sec <= 0) {
          this.enableSendCode();
          clearInterval(this.timer);
        }
      }, 1000);
    }
  }
  @action handlevalidateCodeValue(value) {
    this.validateCodeValue = value;
    if (this.validateCodeValue.trim() !== '' && this.sendCodeFlag) {
      this.againBuyingBtnFlag = true;
    } else {
      this.againBuyingBtnFlag = false;
    }
  }
  @action async confirmBuying(bankId, prdCode) {
    const tokenCode = sessionStorage.getItem('codeToken');
    const params = {
      channel: bankId,
      amount: ecbutil.encryptByDES(this.buyingPrice),
      productCode: prdCode,
      productType: 1,
      token: tokenCode,
      validateCode: this.validateCodeValue,
    };
    if (params.validateCode === '') {
      Toast.info('验证码不能为空', 2);
      return;
    }
    try {
      const data = await api.makesureBuying(params);
      this.handleConfirmBuying(data);
      return data;
    } catch (err) {
      throw err;
    }
  }
  @action handleConfirmBuying(data) {
    this.confirmBuyingObj = data;
    sessionStorage.setItem('TRADENO', data.tradeNo);
  }
  @action async getSuccessResult(bankId) {
    const params = {
      channel: bankId,
      productType: 1,
      tradeNo: sessionStorage.getItem('TRADENO'),
    };
    const data = await api.successPage(params);
    this.handleSuccessResult(data);
  }
  @action handleSuccessResult(data) {
    if (data.respCode === '00') {
      this.successResultAmt = ecbutil.decryptByDES(data.amount);
      console.log(this.successResultAmt);
    }
  }
}

export default new BuyingPageModel();
