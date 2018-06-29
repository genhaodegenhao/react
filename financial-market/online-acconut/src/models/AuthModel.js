import { observable, action, computed, toJS } from 'mobx';
import { Toast } from 'antd-mobile';
import api from '../backend/api';
/* eslint-disable no-param-reassign */
class AuthModel {
  @observable name = '';
  @observable idCardNo = '';
  @observable channel = '';
  @observable frontImgFssId ='';
  @observable backImgFssId ='';
  @observable handheldImgFssId ='';
  @observable frontImg ='';
  @observable backImg ='';
  @observable handheldImg ='';
  @observable electronicAccountList = [];
  @observable isShowUploadIdCards = true;
  @computed get newElectronicAccountList() {
    return toJS(this.electronicAccountList);
  }
  @action setChannel(value) {
    this.channel = value;
  }
  @action setIdCardNo(value) {
    this.idCardNo = value;
  }
  @action setName(value) {
    this.name = value;
  }
  @action setFrontImgFssId(value) {
    this.frontImgFssId = value;
  }
  @action setBackImgFssId(value) {
    this.backImgFssId = value;
  }
  @action setHandheldImgFssId(value) {
    this.handheldImgFssId = value;
  }
  @action setFrontImg(value) {
    this.frontImg = value;
  }
  @action setBackImg(value) {
    this.backImg = value;
  }
  @action setHandheldImg(value) {
    this.handheldImg = value;
  }
  @action setElectronicAccountList(arr) {
    this.electronicAccountList = [];
    this.electronicAccountList = this.electronicAccountList.concat(arr);
  }
  @action setIsShowUploadIdCards(flag) {
    this.isShowUploadIdCards = flag;
  }
  @action setIndex(id) {
    this.electronicAccountList.map((item) => {
      item.checked = false;
      if (item.pan === id) {
        item.checked = true;
      }
      return item;
    });
  }
  @action selectedBankCard(bankCard) {
    const electronicAccountList = [].concat(this.newElectronicAccountList);
    electronicAccountList.forEach((item) => {
      item.checked = false;
      if (item.pan === bankCard.pan) {
        item.checked = true;
        window.sessionStorage.setItem('FINANCIAL_AUTHOR_BANKINFO', JSON.stringify(bankCard));
        window.sessionStorage.setItem('FINANCIAL_AUTHOR_CHECKEDID', bankCard.pan);
      }
    });
    this.setElectronicAccountList(electronicAccountList);
    // this.checkBankCertificate();
  }
  @action async checkBankCertificate() {
    const channel = window.sessionStorage.getItem('FINANCIAL_AUTHOR_CHANNEL');
    const params = {
      channel,
    };
    try {
      const data = await api.bankCertificateElement(params);
      if (data.ocrCertificationFlag === '1') {
        this.setIsShowUploadIdCards(true);
      } else if (data.ocrCertificationFlag === '0') {
        this.setIsShowUploadIdCards(false);
      }
      const params2 = {
        faceCertificationFlag: data.faceCertificationFlag,
        ocrCertificationFlag: data.ocrCertificationFlag,
        realNameFlag: data.realNameFlag,
      };
      const data2 = await api.checkBankCertificate(params2);
      if (data2.ocrCertification === '1') {
        this.setIsShowUploadIdCards(false);
      } else if (data2.ocrCertification === '0' || data2.ocrCertification === '2') {
        this.setIsShowUploadIdCards(true);
      }
      window.sessionStorage.setItem('FINANCIAL_AUTHOR_IDCARDNO', data2.idCardNo);
      window.sessionStorage.setItem('FINANCIAL_AUTHOR_NAME', data2.name);
      this.setIdCardNo(data2.idCardNo);
      this.setName(data2.name);
    } catch (error) {
      Toast.fail(error.respMsg, 2);
    }
  }
  @action async getElectronicAccountList() {
    const channel = window.sessionStorage.getItem('FINANCIAL_AUTHOR_CHANNEL');
    const params = {
      channel,
    };
    try {
      const data = await api.bankSupport(params);
      const bankList = [].concat(data.bankList);
      const id = window.sessionStorage.getItem('FINANCIAL_AUTHOR_CHECKEDID');
      bankList.forEach((item) => {
        item.checked = false;
        if (id === item.pan) {
          item.checked = true;
        }
      });
      this.setElectronicAccountList(bankList);
    } catch (error) {
      Toast.fail(error.respMsg, 2);
    }
  }
}

export default new AuthModel();
