import React from 'react';
import { Link } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import axios from 'axios';
import { inject, observer } from 'mobx-react';

import style from './id-card-img.less';
import idCardFrontImg from '../../../assets/img/author/ic_id_card_front.png';
import idCardBackImg from '../../../assets/img/author/ic_id_card_back.png';
import idCardHoldImg from '../../../assets/img/author/ic_id_card_hold.png';
import api from '../../../backend/api';
import {
  isEmptyStr,
} from '../../../utils/toolFunc';
import { LoginToken } from '../../../utils/LoginToken';
import h5t from '../../../utils/h5t';

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable func-names */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-return-assign */
const KQB = window.KQB;

@inject('AuthModel')
@observer
class IdCardImgs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      multiple: false,
      // frontImg: '',
      // backImg: '',
      // holdImg: '',
    };
  }
  componentDidMount() {
    h5t.track('pageview', { eventId: 'H5_financialmarket_p_idCardImgs' });
  }
  getFssIds = (imgBase64, channel, type) => {
    const _this = this;
    const parameters = {
      channel,
      imgBase64,
    };
    api.uploadIdCard(parameters).then((res) => {
      if (res.errCode === '00') {
        if (type === 'front') {
          _this.setState({
            frontFssIds: res.fssIds,
          });
          window.sessionStorage.setItem('FINANCIAL_AUTHOR_FRONTIMGFSSID', res.fssIds);
        } else if (type === 'back') {
          _this.setState({
            backFssIds: res.fssIds,
          });
          window.sessionStorage.setItem('FINANCIAL_AUTHOR_BACKIMGFSSID', res.fssIds);
        } else if (type === 'hold') {
          _this.setState({
            holdFssIds: res.fssIds,
          });
          window.sessionStorage.setItem('FINANCIAL_AUTHOR_HOLDIMGFSSID', res.fssIds);
        }
      } else {
        Toast.fail(res.errMsg, 1);
      }
    }).catch((e) => {
      Toast.fail(e.respMsg, 1);
    });
  }
  handleAddImg(type) {
    const _this = this;
    const channel = 0;
    KQB.native('openCamera', {
      imgLimitSize: '100',
      sourceType: '0',
      success: (res) => {
        if (type === 'front') {
          _this.setState({
            frontImg: res.photo,
          });
          _this.getFssIds(res.photo, channel, 'front');
        } else if (type === 'back') {
          _this.setState({
            backImg: res.photo,
          });
          _this.getFssIds(res.photo, channel, 'back');
        } else if (type === 'hold') {
          _this.setState({
            holdImg: res.photo,
          });
          _this.getFssIds(res.photo, channel, 'hold');
        }
      },
      error: (res) => {
        console.log(`打开摄像头失败${res}`);
        Toast.info(JSON.stringify(res));
      },
    });
  }
  sendIdCardImgs = () => {
    h5t.track('trackevent', { eventId: 'H5_financialmarket_sendIdCardImgs' });
    const { history, AuthModel } = this.props;
    // const frontFssIds = window.sessionStorage.getItem('FINANCIAL_AUTHOR_FRONTIMGFSSID');
    // const backFssIds = window.sessionStorage.getItem('FINANCIAL_AUTHOR_BACKIMGFSSID');
    // const holdFssIds = window.sessionStorage.getItem('FINANCIAL_AUTHOR_HOLDIMGFSSID');
    const frontFssIds = AuthModel.frontImgFssId;
    const backFssIds = AuthModel.backImgFssId;
    const holdFssIds = AuthModel.handheldImgFssId;
    const channel = window.sessionStorage.getItem('FINANCIAL_AUTHOR_CHANNEL');
    if (isEmptyStr(frontFssIds) || isEmptyStr(backFssIds)) {
      Toast.fail('身份证正反面必须都传!', 2);
      return;
    }
    const parameters = {
      backImgFssId: backFssIds,
      channel,
      frontImgFssId: frontFssIds,
      handheldImgFssId: holdFssIds,
    };
    api.scanIdCard(parameters).then((res) => {
      if (res.respCode === '00') {
        window.sessionStorage.setItem('FINANCIAL_AUTHOR_IDCARDINFO', JSON.stringify(res));
        history.push('/id-info');
      } else {
        Toast.fail(res.respMsg, 1);
      }
    }).catch((e) => {
      Toast.fail(e.respMsg, 1);
    });
  }
  imgUploadChange = (e) => {
    h5t.track('trackevent', { eventId: 'H5_financialmarket_uploadImg' });
    const _this = this;
    const file = e.target;
    const reader = new FileReader();
    const fileType = e.target.getAttribute('data-fileType');
    const channel = window.sessionStorage.getItem('FINANCIAL_AUTHOR_CHANNEL');
    const { AuthModel } = this.props;

    const extensionName = file.value.split('.')[1].toLocaleLowerCase(); // 转小写
    if ((extensionName !== 'jpg') && (extensionName !== 'gif') && (extensionName !== 'jpeg') && (extensionName !== 'png') && (extensionName !== 'bmp')) {
      Toast.info('对不起，系统仅支持标准格式的照片，请您调整格式后重新上传，谢谢 !');
      return;
    }
    if (file.files[0].size / 1024 / 1024 > 3) {
      Toast.info('对不起，系统仅支持3M以下的照片，请您调整图片大小后重新上传，谢谢!');
      return;
    }

    if (fileType === 'back' && isEmptyStr(AuthModel.frontImg)) {
      Toast.fail('请先上传身份证正面', 2);
      return;
    }
    if ((fileType === 'hold' && isEmptyStr(AuthModel.frontImg)) || (fileType === 'hold' && isEmptyStr(AuthModel.frontImg))) {
      Toast.fail('请先上传身份证正反面', 2);
      return;
    }
    reader.readAsDataURL(file.files[0]);
    reader.onload = function () {
      const base64Img = this.result;
      const formData = new FormData();
      formData.append('files', file.files[0]);
      formData.append('channel', channel);
      // api.uploadIdCard(formData).then((res) => {
      //   console.log(res);
      // }).catch((err) => {
      //   Toast.fail(err.respMsg, 1);
      // });
      Toast.loading('加载中...', 0);
      axios.request({
        baseURL: 'https://ebd.99bill.com/coc-wechat-gateway',
        data: formData,
        url: '/wechat/upload',
        method: 'POST',
        headers: {
          authorization: LoginToken(),
        },
      }).then((data) => {
        return data.data;
      }).then((res) => {
        Toast.hide();
        if (res.respCode === '00') {
          if (fileType === 'front') {
            // _this.setState({
            //   frontImg: base64Img,
            // });
            _this.props.AuthModel.setFrontImg(base64Img);
            window.sessionStorage.setItem('FINANCIAL_AUTHOR_FRONTIMGFSSID', res.fssIds[0]);
            _this.props.AuthModel.setFrontImgFssId(res.fssIds[0]);
          } else if (fileType === 'back') {
            // _this.setState({
            //   backImg: base64Img,
            // });
            _this.props.AuthModel.setBackImg(base64Img);
            _this.props.AuthModel.setBackImgFssId(res.fssIds[0]);
            window.sessionStorage.setItem('FINANCIAL_AUTHOR_BACKIMGFSSID', res.fssIds[0]);
          } else if (fileType === 'hold') {
            // _this.setState({
            //   holdImg: base64Img,
            // });
            _this.props.AuthModel.setHandheldImg(base64Img);
            _this.props.AuthModel.setHandheldImgFssId(res.fssIds[0]);
            window.sessionStorage.setItem('FINANCIAL_AUTHOR_HOLDIMGFSSID', res.fssIds[0]);
          }
        } else {
          Toast.fail(res.respMsg, 2);
        }
      }).catch((err) => {
        Toast.fail(err.respMsg, 2);
        Toast.hide();
      });
    };
  }
  render() {
    // const { frontImg, backImg, holdImg } = this.state;
    // console.log(`frontImg${frontImg}`);
    // console.log(`backImg${backImg}`);
    // console.log(`holdImg${holdImg}`);
    const { AuthModel } = this.props;
    return (
      <div className={style.container}>
        <div className={style.tips}>完成身份证照认证即可完成身份验证</div>
        <div className={style.uploadContaier}>
          <ul>
            <li>
              {
                AuthModel.frontImg
                  ? <img src={AuthModel.frontImg} alt="frontIdCardImg" width="256" height="160" />
                  : <img src={idCardFrontImg} alt="身份证正面" width="256" height="160" />
              }
              <input className={style.uploadInput} name="files" type="file" accept="image/*" data-fileType="front" onChange={this.imgUploadChange} />
            </li>
            <li>
              {
                AuthModel.backImg
                  ? <img src={AuthModel.backImg} alt="backIdCardImg" width="256" height="160" />
                  : <img src={idCardBackImg} alt="身份证反面" width="256" height="160" />
              }
              <input className={style.uploadInput} name="files" type="file" accept="image/*" data-fileType="back" onChange={this.imgUploadChange} />
            </li>
            <li>
              {
                AuthModel.holdImg
                  ? <img src={AuthModel.holdImg} alt="holdIdCardImg" width="256" height="160" />
                  : <img src={idCardHoldImg} alt="手持身份证" width="256" height="160" />
              }
              <input className={style.uploadInput} name="files" type="file" accept="image/*" data-fileType="hold" onChange={this.imgUploadChange} />
            </li>
          </ul>
        </div>
        <div className={style.button} onClick={() => this.sendIdCardImgs()}>提交</div>
        <div className={style.confirm}>
        确认授权即表示同意<Link to="/service-agreement" className={style.agreement}>《用户服务协议》</Link>
        </div>
      </div>
    );
  }
}

export default IdCardImgs;
