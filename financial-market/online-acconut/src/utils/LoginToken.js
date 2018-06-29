import { Modal } from 'antd-mobile';
import Cookies from 'js-cookie';
import api from '../backend/api';
import { setUrlParams, checkEnv } from './toolFunc';

const alert = Modal.alert;

let AccessToken = null;
let DeviceId = null;

const EnvInfo = checkEnv();

export const LoginToken = () => {
  return sessionStorage.getItem('FINANCIAL_LOGINTOKEN');
};

const getNative = () => {
  return new Promise((resolve) => {
    window.KQB.native('getDeviceId', {
      success: (res) => {
        DeviceId = res.deviceId;
        window.KQB.native('getAccessToken', {
          success: (data) => {
            AccessToken = encodeURIComponent(data.accessToken);
            resolve();
          },
        });
      },
    });
  });
};

export const handleInvalidToken = () => {
  sessionStorage.removeItem('FINANCIAL_LOGINTOKEN');
  Cookies.remove('loginToken', { domain: '.99bill.com' });

  return new Promise((resolve) => {
    alert('登录已失效，请重新登录', null, [
      {
        text: '确定',
        onPress: () => {
          if (EnvInfo.KQ) {
            window.KQB.native('goback', {});
          }
          resolve();
        },
      },
    ]);
  });
};

// 获取token
export const initLoginToken = () => {
  return new Promise((resolve, reject) => {
    if (LoginToken()) { // 已登陆
      resolve();
    } else if (EnvInfo.KQ) { // 未登陆 - 快钱app中登陆
      sessionStorage.removeItem('FINANCIAL_LOGINTOKEN');
      getNative().then(() => {
        api.queryLoginToken({
          accessToken: AccessToken,
          deviceId: DeviceId,
        })
          .then(
            (res) => {
              sessionStorage.setItem('FINANCIAL_LOGINTOKEN', res.loginToken);
              Cookies.set('loginToken', res.loginToken, { domain: '.99bill.com' });
              resolve();
            },
            (err) => {
              handleInvalidToken(err.respMsg).then(() => {
                reject();
              });
            }
          );
      });
    } else if (EnvInfo.DevelopEnv) { // 未登陆 - 纯h5登陆
      sessionStorage.removeItem('FINANCIAL_LOGINTOKEN');
      api.login({ // 使用测试账户登录
        idContent: 'ef3P6SU6O71WKoUQxANjRA%253D%253D',
        password: 'KIMeQKBMBDW844PzHnVqmQ%253D%253D',
        // idContent: 'QTpkvUsqQiUCopHfxaRRPA%253D%253D',
        // password: 'ic4J1DwCz8f%252F0PzKyJV1Xg%253D%253D',
      }).then(
        (res) => {
          sessionStorage.setItem('FINANCIAL_LOGINTOKEN', res.loginToken);
          Cookies.set('loginToken', res.loginToken, { domain: '.99bill.com' });
          resolve();
        },
        (err) => {
          handleInvalidToken(err.respMsg).then(() => {
            reject();
          });
        }
      );
    } else {
      const token = Cookies.get('loginToken', { domain: '.99bill.com' });
      if (token) {
        sessionStorage.setItem('FINANCIAL_LOGINTOKEN', token);
        resolve();
      } else {
        // 跳转h5登陆链接
        const params = {
          navbar: 0,
          origin: 'oms-cloud.99bill.com',
          nextPage: window.location.href,
        };
        const url = `https://www.99bill.com/seashell/webapp/billtrunk/sign.html${setUrlParams(params)}`;
        window.location.replace(url);
      }
    }
  });
};

