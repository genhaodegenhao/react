export default {
  // 获取最低投资额
  getMinAmt: {
    url: '/wechat/query/PeriodicalPrdDetail',
  },
  // 验证码发送
  validateCode: {
    url: '/wechat/sms/validateCode',
  },
  // 确认购买
  makesureBuying: {
    url: '/wechat/purchase/product'
  },
  // 购买结果页
  successPage: {
    url: '/wechat/purchase/result',
  }
};
