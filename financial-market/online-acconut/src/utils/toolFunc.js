/* eslint-disable no-plusplus */
export const isEmptyObj = (o) => {
  return o === undefined || o === null;
};

export const isEmptyStr = (s) => {
  return isEmptyObj(s) || s.length === 0;
};

export const getQueryString = (name, search) => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  const r = search.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]); return null;
};

export const setUrlParams = (o, questionMark, isEncode) => {
  let p = questionMark ? '&' : '?';
  let i = 0;
  const unencode = (isEncode !== undefined) ? isEncode : true;
  /* eslint-disable guard-for-in */
  /* eslint-disable no-restricted-syntax */
  for (const key in o) {
    let value = o[key];
    if (value !== undefined) {
      if (unencode && typeof (value) === 'string') {
        value = encodeURIComponent(value);
      }
      if (i === 0) {
        p += `${key}=${value}`;
        i += 1;
      } else {
        p += `&${key}=${value}`;
      }
    }
  }
  return p;
};

export const dataURLtoBlob = (dataurl) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = window.atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {
    type: mime,
  });
};

export const checkEnv = () => {
  const ua = navigator.userAgent.toLowerCase();
  const is = (agent) => {
    let result = agent;
    result = result.toLowerCase();
    return ua.indexOf(result) > -1;
  };

  return {
    iOS: is('iphone') || is('ipad') || is('ipod'),
    Android: is('android'),
    KQ: is('kuaiqianbao'), // 快钱包ua
    FeiFan: is('feifan'), // 飞凡ua
    KQSDK: is('kuaiqianpaysdk'), // 快钱sdk ua
    FFTSDK: is('fftpaysdk'), // 飞凡通sdk ua
    Weixin: is('micromessenger'), // 微信 ua
    KQCSDK: is('kuaiqiancreditapplysdk'), // 快钱征信 ua
    DevelopEnv: process.env.NODE_ENV === 'development',
    is,
  };
};

export const setPageTitle = (title) => {
  const EnvInfo = checkEnv();
  if (EnvInfo.KQ) {
    window.KQB.native('setPageTitle', { title });
  }
  window.document.title = title || '首页';
};
