import { observable, action } from 'mobx';
import moment from 'moment';
import api from '../backend/api';

class FinancingPageModel {
  @observable financalInfoObj = {};
  @observable ownAssetsInfoObj = {};
  @observable regularDetailInfoObj = {};
  @observable productLists = [];
  @observable regularDetailDate = '';
  @action async getMyFinancingInfo(bankId) {
    const params = {
      channel: bankId,
    };
    const response = await api.getMyFinancing(params);
    this.handleFinancingInfo(response);
  }
  @action handleFinancingInfo(data) {
    if (data.respCode === '00') {
      this.financalInfoObj = data;
    }
  }
  @action async getOwnRegularAssets(bankId) {
    const params = {
      channel: bankId,
      pageNo: 0,
      productType: 1,
    };
    const response = await api.getOwnFinaAssets(params);
    console.log(response);
    this.handleOwnRegularAssets(response);
  }
  @action handleOwnRegularAssets(data) {
    if (data.respCode === '00') {
      this.productLists = data.productList;
      this.ownAssetsInfoObj = data;
    }
  }
  @action async getOwnCurrentAssets() {
    const params = {
      channel: 0,
      pageNo: 0,
      productType: 2,
    };
    const response = await api.getOwnFinaAssets(params);
    console.log(response);
    this.handleOwnRegularAssets(response);
  }
  @action async getRegularDetailInfo(bankId, proCode) {
    const params = {
      channel: bankId,
      productCode: proCode,
    };
    const response = await api.getRegularAsset(params);
    this.handleRegularDetailInfo(response);
  }
  @action handleRegularDetailInfo(data) {
    if (data.respCode === '00') {
      this.regularDetailInfoObj = data.productInfo;
      this.regularDetailDate = moment(data.productInfo.holdTo, 'YYYYMMDDHHmm').format('YYYY/MM/DD');
    }
  }
}

export default new FinancingPageModel();
