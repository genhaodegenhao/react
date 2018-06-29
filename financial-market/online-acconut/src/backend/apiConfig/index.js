/* eslint-disable no-else-return */
import { Toast } from 'antd-mobile';
import { DefaultMockHead, DefaultApiHead } from '../fetchEnv';
import { LoginToken, handleInvalidToken } from '../../utils/LoginToken';

import ApiAuth from './apiAuth';
import ApiHome from './apiHome';
import ApiBuying from './apiBuying';
import ApiAuthService from './apiAuthService';
import ApiRecharge from './apiRecharge';
import ApiPrdDetail from './apiPrdDetail';
import ApiAccount from './apiAcconut';
import ApiWithdrawal from './apiWithdrawal';
import ApiMyFinancing from './apiMyFinancing';
import ApiXcxTransfer from './apiXcxTransfer';
import ApiMoneyIntoOut from './apiInOut';

// 基础配置
export const BaseConfig = {
  url: '', // 接口url
  method: 'post', // 请求类型
  commonParams: {}, // 通用参数
  baseUrl: DefaultApiHead, // url头部
  apiBaseUrl: DefaultApiHead,
  mockBaseUrl: DefaultMockHead,
  openMock: false, // 是否开启mock
  successCode: '00', // 请求成功code
  validTokenCode: '03', // token失效code
  handleInvalidToken: (data) => { handleInvalidToken(data.respMsg); }, // 处理token失效
  headers: {},
  getHeaders: () => ({
    authorization: LoginToken(),
  }),
  reqStart: () => { Toast.loading('加载中...', 0); }, // 请求开始
  reqEnd: () => { Toast.hide(); }, // 请求结束
  handleError: (data) => { Toast.fail(data.respMsg); }, // 请求异常
  timeoutMs: 15000, // 超时
};

// 接口配置
export const ApiConfig = {
  ...ApiAccount,
  ...ApiAuth,
  ...ApiHome,
  ...ApiBuying,
  ...ApiAuthService,
  ...ApiRecharge,
  ...ApiPrdDetail,
  ...ApiWithdrawal,
  ...ApiMyFinancing,
  ...ApiXcxTransfer,
  ...ApiMoneyIntoOut,
};
