/* eslint-disable consistent-return */
import {
  observable,
  action,
} from 'mobx';
import API from '../backend/api';

class PrdDetailModel {
  @observable curPrdDetail = {};

  @observable fixedPrdDetail = {};

  @observable isOpenAccount = false;

  @action setCurPrdDetail(value) {
    this.curPrdDetail = value || {};
  }

  @action setFixedPrdDetail(value) {
    this.fixedPrdDetail = value || {};
  }

  @action setIsOpenAccount(value) {
    this.isOpenAccount = value || false;
  }

  @action async getFixedPrdDetail(params) {
    try {
      const res = await API.getPeriodicalPrdDetail(params);
      this.setFixedPrdDetail(res.productDescInfo);
      return res;
    } catch (err) {
      this.setFixedPrdDetail({});
      // throw err;
    }
  }

  @action async getCurPrdDetail(params) {
    try {
      const res = await API.getCurrentPrdDetail(params);
      this.setCurPrdDetail(res.productDescInfo);
      return res;
    } catch (err) {
      this.setCurPrdDetail({});
      throw err;
    }
  }

  @action async checkAccount(params) {
    this.setIsOpenAccount(false);
    try {
      const res = await API.prdDetailCheck(params);
      if (res.accountInfoList.length > 0) {
        this.setIsOpenAccount(true);
      }
      return res;
    } catch (err) {
      throw err;
    }
  }
}

export default new PrdDetailModel();
