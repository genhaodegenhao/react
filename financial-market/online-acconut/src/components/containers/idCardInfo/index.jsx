import React from 'react';
// import { createForm } from 'rc-form';
import { List, InputItem, Toast } from 'antd-mobile';
import { inject, observer } from 'mobx-react';

import style from './id-card-info.less';
import api from '../../../backend/api';
// import { isEmptyStr } from '../../../utils/toolFunc';
import { decryptByDES } from '../../../utils/ecbutil';
import h5t from '../../../utils/h5t';

@inject('AuthModel')
@observer
/* eslint-disable no-unused-vars */
class IdCardInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idCardInfo: {},
      name: '',
      idCard: '',
      validstartTime: '',
      validendTime: '',
      address: '',
    };
  }
  componentDidMount() {
    h5t.track('pageview', { eventId: 'H5_financialmarket_p_idCardInfo' });
  }
  idCardInfoConfirm = () => {
    h5t.track('trackevent', { eventId: 'H5_financialmarket_idCardInfoConfirm' });
    const { AuthModel } = this.props;
    const idCardInfo = JSON.parse(window.sessionStorage.getItem('FINANCIAL_AUTHOR_IDCARDINFO'));
    const frontFssIds = window.sessionStorage.getItem('FINANCIAL_AUTHOR_FRONTIMGFSSID');
    const backFssIds = window.sessionStorage.getItem('FINANCIAL_AUTHOR_BACKIMGFSSID');
    const holdFssIds = window.sessionStorage.getItem('FINANCIAL_AUTHOR_HOLDIMGFSSID');
    // const frontFssIds = AuthModel.frontImgFssId;
    // const backFssIds = AuthModel.backImgFssId;
    // const holdFssIds = AuthModel.handheldImgFssId;
    const channel = window.sessionStorage.getItem('FINANCIAL_AUTHOR_CHANNEL');
    const { history } = this.props;
    if (idCardInfo) {
      const parameter = {
        address: idCardInfo.address,
        birthday: idCardInfo.birthday,
        cardphotoFssId: idCardInfo.cardphotoFssId,
        identityCardId: idCardInfo.identityCardId,
        issuingauthority: idCardInfo.issuingauthority,
        name: idCardInfo.name,
        national: idCardInfo.national,
        sex: idCardInfo.sex,
        validendTime: idCardInfo.validendTime,
        validstartTime: idCardInfo.validstartTime,
        backImgFssId: backFssIds,
        frontImgFssId: frontFssIds,
        handheldImgFssId: holdFssIds,
        channel,
      };
      api.validateIdCard(parameter).then((res) => {
        console.log(res);
        if (res.respCode === '00') {
          history.push('/bind-card');
        } else {
          Toast.fail(res.respMsg, 2);
        }
      }).catch((e) => {
        Toast.fail(e.respMsg, 2);
      });
    }
  }
  nameChangeFunc = (e) => {
    this.setState({ name: e });
  }
  idCardChangeFunc = (e) => {
    this.setState({ identityCardId: e });
  }
  validTimeChangeFunc = (e) => {
    this.setState({ validSETime: e });
  }
  addressChangeFunc = (e) => {
    this.setState({ address: e });
  }
  render() {
    let idCardInfo = {};
    if (window.sessionStorage.getItem('FINANCIAL_AUTHOR_IDCARDINFO')) {
      idCardInfo = JSON.parse(window.sessionStorage.getItem('FINANCIAL_AUTHOR_IDCARDINFO'));
    }
    const validTime = `${idCardInfo && idCardInfo.validstartTime}-${idCardInfo && idCardInfo.validendTime}`;
    return (
      <div className={style.container}>
        <div className={style.tips}>请核实你的身份证信息准确无误</div>
        <div>
          <List>
            <InputItem
              editable={false}
              placeholder="请输入姓名"
              defaultValue={decryptByDES(idCardInfo.name)}
            >姓名</InputItem>
            <InputItem
              editable={false}
              placeholder="请输入身份证"
              defaultValue={decryptByDES(idCardInfo.identityCardId)}
            >身份证</InputItem>
            <InputItem
              editable={false}
              placeholder="请输入有效期"
              defaultValue={validTime}
            >有效期</InputItem>
            <InputItem
              editable={false}
              placeholder="请输入住址"
              defaultValue={idCardInfo.address}
            >住址</InputItem>
          </List>
        </div>
        <div className={style.button} onClick={() => this.idCardInfoConfirm()}>确认提交</div>
      </div>
    );
  }
}

export default IdCardInfo;
