/* eslint-disable consistent-return */
import {
  observable,
  action,
} from 'mobx';
import API from '../backend/api';

class HomeModel {
  @observable bannerInfo = [];

  @observable prdCurList = [];

  @observable prdFixedList = [];

  @action setPrdCurList(value) {
    this.prdCurList = value || [];
  }

  @action setPrdFixedList(value) {
    this.prdFixedList = value || [];
  }

  @action setBannerInfo(value) {
    this.bannerInfo = value || [];
  }

  @action async updatePrdCurList() {
    try {
      const params = {
        channel: 0,
        pageNo: 1,
        productType: 2,
      };
      const res = await API.homeProductList(params);
      this.setPrdCurList(res.productList);
      return res;
    } catch (err) {
      // throw err;
      console.log(err);
    }
  }

  @action async updatePrdFixedList() {
    try {
      const params = {
        channel: 0,
        pageNo: 1,
        productType: 1,
      };
      const res = await API.homeProductList(params);
      this.setPrdFixedList(res.productList);
    } catch (err) {
      console.log(err);
    }
  }

  @action async updateBannerInfo() {
    try {
      const res = await API.homeInfo();
      this.setBannerInfo(JSON.parse(res.resInfo).contentFileList);
      return res;
    } catch (err) {
      console.log(err);
    }
  }
}

export default new HomeModel();
