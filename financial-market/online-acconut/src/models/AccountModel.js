import { observable, action, computed } from 'mobx';
import api from '../backend/api';
import { formatNum, toDecimal2 } from '../utils/util';

class AccountModel {
  @observable currentAccount = {};
  @observable panView = '';
  @observable bankIdView = '';
  @observable balanceView = 0;
  @observable phoneNoView = '';
  @observable totalAmt = 0;
  // @computed get getCurrentAccount() {
  //   if (Object.keys(this.currentAccount).length > 0) {
  //     return this.currentAccount;
  //   } else if (localStorage.getItem('currentAccount')) {
  //     return JSON.parse(localStorage.getItem('currentAccount'));
  //   }
  //   return {};
  // }
  @computed get getCurrentAcconutInfo() {
    let pan;
    let bankId;
    let balance;
    let phoneNo;

    console.log(this.panView, '>>>>>');

    if (this.panView) {
      pan = this.panView;
    } else if (localStorage.getItem('panView')) {
      pan = JSON.parse(localStorage.getItem('panView'));
    }

    if (this.bankIdView) {
      bankId = this.bankIdView;
    } else if (localStorage.getItem('bankIdView')) {
      bankId = JSON.parse(localStorage.getItem('bankIdView'));
    }

    if (this.balanceView) {
      balance = this.balanceView;
    } else if (localStorage.getItem('balanceView')) {
      balance = JSON.parse(localStorage.getItem('balanceView'));
    }

    if (this.phoneNoView) {
      phoneNo = this.phoneNoView;
    } else if (localStorage.getItem('phoneNoView')) {
      phoneNo = JSON.parse(localStorage.getItem('phoneNoView'));
    }

    return { pan, bankId, balance, phoneNo };
  }
  @computed get getTotalAmt() {
    return formatNum(this.totalAmt);
  }
  // @action setCurrentAccount(value) {
  //   this.currentAccount = value;
  //   if (localStorage.getItem('currentAccount') !== JSON.stringify(this.currentAccount)) {
  //     localStorage.setItem('currentAccount', JSON.stringify(this.currentAccount));
  //   }
  // }
  @action setPanView(value) {
    this.panView = value;
    if (localStorage.getItem('panView') !== JSON.stringify(this.panView)) {
      localStorage.setItem('panView', JSON.stringify(this.panView));
    }
  }
  @action setBankIdView(value) {
    this.bankIdView = value;
    if (localStorage.getItem('bankIdView') !== JSON.stringify(this.bankIdView)) {
      localStorage.setItem('bankIdView', JSON.stringify(this.bankIdView));
    }
  }
  @action setBalanceView(value) {
    this.balanceView = value;
    if (localStorage.getItem('balanceView') !== JSON.stringify(this.balanceView)) {
      localStorage.setItem('balanceView', JSON.stringify(this.balanceView));
    }
  }
  @action setPhoneNoView(value) {
    this.phoneNoView = value;
    if (localStorage.getItem('phoneNoView') !== JSON.stringify(this.phoneNoView)) {
      localStorage.setItem('phoneNoView', JSON.stringify(this.phoneNoView));
    }
  }
  @action addBalanceView(value) {
    const oldValue = parseFloat(this.getCurrentAcconutInfo.balance);
    const addValue = parseFloat(value);
    const tempValue = ((oldValue * 100) + (addValue * 100)) / 100;
    const newValue = tempValue.toFixed(2);
    this.setBalanceView(toDecimal2(newValue));
  }
  @action minusBalanceView(value) {
    const oldValue = parseFloat(this.getCurrentAcconutInfo.balance);
    const addValue = parseFloat(value);
    const tempValue = ((oldValue * 100) - (addValue * 100)) / 100;
    const newValue = tempValue.toFixed(2);
    this.setBalanceView(toDecimal2(newValue));
  }
  @action setTotalAmt(value) {
    this.totalAmt = value;
  }
  @action async getAccountInfoList(params) {
    this.response = await api.checkAccount(params);
    return this.response;
  }
  @action async checkTotalAmt(params) {
    this.response = await api.checkTotalAmt(params);
    return this.response;
  }
}

export default new AccountModel();
