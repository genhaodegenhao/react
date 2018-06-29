export default{
  // LN0020004查询电子户
  checkElectronicAccount: {
    url: '/wechat/check/open',
  },
  // LN0010009OCR扫描
  scanIdCard: {
    url: '/wechat/ocr/scan',
  },
  // LN0010007身份证上传
  uploadIdCard: {
    url: '/wechat/upload',
  },
  // LN0010010OCR扫描结果验证
  validateIdCard: {
    url: '/wechat/ocr/scan/validate',
  },
  // LN0010004查询用户绑卡列表
  bankSupport: {
    url: '/wechat/query/bindCards',
  },
  // LN0020005电子户开户
  openElectronicAccount: {
    url: '/wechat/openAccount',
  },
  // LN0010006短信验证码生成
  sendMsg: {
    url: '/wechat/sms/validateCode',
  },
  // LN0010005查询银行认证要素结果
  checkBankCertificate: {
    url: '/wechat/bank/certification/result',
  },
  // LN0010008银行要素认证
  bankCertificateElement: {
    url: '/wechat/bank/certification',
  },
};
