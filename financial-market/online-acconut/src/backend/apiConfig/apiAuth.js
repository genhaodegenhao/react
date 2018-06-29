import { ApiHead } from '../fetchEnv';

export default {
  // L0073001N 获取loginToken接口
  queryLoginToken: {
    url: '/auth/3.0/app',
    apiBaseUrl: ApiHead[1],
    getHeaders: () => ({
      pubData: JSON.stringify({ c: 'H5', b: 'msxf', id: '102', t: new Date() }),
    }),
  },
  // 登录接口
  login: {
    url: '/mam/3.0/members/password/login',
    apiBaseUrl: ApiHead[1],
    getHeaders: () => ({
      pubData: JSON.stringify({ c: 'H5', b: 'VAS-GOLD-INTEREST', id: '998', t: new Date() }),
    }),
  },
};
