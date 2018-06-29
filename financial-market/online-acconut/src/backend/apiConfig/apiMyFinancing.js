export default {
  // 查询我的理财
  getMyFinancing: {
    url: '/wechat/query/account',
  },
  // 查询持有产品
  getOwnFinaAssets: {
    url: '/wechat/query/finaAssets',
  },
  // 查询用户持有定期理财产品
  getRegularAsset: {
    url: '/wechat/query/prodAccountDetail'
  },
};
