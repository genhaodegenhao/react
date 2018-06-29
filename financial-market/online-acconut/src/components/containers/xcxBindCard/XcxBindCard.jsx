import React from 'react';
import Cookie from 'js-cookie';
import { Toast } from 'antd-mobile';
import { getQueryString, setUrlParams } from '../../../utils/toolFunc';
import API from '../../../backend/api';

class XcxBindCard extends React.Component {
  constructor(props) {
    super(props);
    const search = props.history.location.search;
    this.state = {
      code: getQueryString('code', search),
      from: getQueryString('from', search), // xcx bindcard
      bindcardUrl: 'https://www.99bill.com/seashell/webapp/billtrunk2/bindcard.html',
    };
  }

  componentWillMount() {
    this.loadSource();
  }

  componentDidMount() {
    if (this.state.from === 'xcx') {
      this.getToken()
        .then((token) => {
          // code换token，存到cookie
          Cookie.set('loginToken', token, { domain: '.99bill.com' });
          // 成功以后，跳转绑卡页面
          const bindcardUrl = this.state.bindcardUrl;
          const bindParams = {
            navbar: 0,
            origin: 'oms-cloud.99bill.com',
            nextPage: `${window.location.href.split('?')[0]}?from=bindcard`,
          };
          console.log(`${bindcardUrl}${setUrlParams(bindParams)}`);
          window.location.replace(`${bindcardUrl}${setUrlParams(bindParams)}`);
        })
        .catch((err) => {
          console.log(err);
          Toast.fail('获取logintoken失败！');
        });
    } else if (this.state.from === 'bindcard') {
      Toast.success('绑卡成功！');
      // 绑卡成功
      this.exitPage();
    } else {
      // 无有效参数，直接退出
      console.log('无有效参数，直接退出');
      this.exitPage();
    }
  }
  // 获取verifyCode
  getCode = () => {
    return new Promise((resolve, reject) => {
      API.xcxVerifyCode()
        .then((res) => {
          resolve(res.verifyCode);
        })
        .catch((res) => {
          reject(res);
        });
    });
  }
  // 获取loginToken
  getToken = () => {
    return new Promise((resolve, reject) => {
      if (this.state.code !== null) {
        API.xcxAuth({
          verifyCode: this.state.code,
        })
          .then((res) => {
            resolve(res.loginToken);
          })
          .catch((res) => {
            reject(res);
          });
      } else {
        // 测试使用h5账号
        this.getCode().then((code) => {
          API.xcxAuth({
            verifyCode: code,
          })
            .then((res) => {
              resolve(res.loginToken);
            })
            .catch((res) => {
              reject(res);
            });
        });
      }
    });
  }
  // 加载微信插件js
  loadSource = () => {
    const sourceUrl = 'https://res.wx.qq.com/open/js/jweixin-1.3.2.js';
    return new Promise((resolve) => {
      const source = document.createElement('script');
      source.src = sourceUrl;
      const s = document.getElementsByTagName('script')[0];
      if (s.src === sourceUrl) {
        s.onload = () => {
          resolve();
        };
      } else {
        s.parentNode.insertBefore(source, s);
        source.onload = () => {
          resolve();
        };
      }
    });
  };
  // 退出h5页面，返回小程序
  exitPage = () => {
    // 绑卡回来以后，加载微信插件库
    this.loadSource().then(() => {
      console.log('调用微信接口, 跳转微信页面');
      // 调微信接口, 跳转微信页面
      window.wx.miniProgram.navigateBack();
    });
  }

  render() {
    return null;
  }
}

export default XcxBindCard;
