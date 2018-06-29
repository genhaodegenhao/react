import { asyncComponent } from '../utils/asyncComponent';

const RouteConfig = [
  {
    path: '/account-list',
    component: asyncComponent(() => import('../components/containers/list/List')),
    title: '电子账户',
  },
  {
    path: '/account-detail',
    component: asyncComponent(() => import('../components/containers/detail/Detail')),
    title: '电子账户',
  },
  {
    path: '/home',
    component: asyncComponent(() => import('../components/containers/home/Home')),
    title: '首页',
  },
  {
    path: '/fixedproduct-detail',
    component: asyncComponent(() => import('../components/containers/productDetail/FixedproductDetail')),
    title: '定期理财详情',
  },
  {
    path: '/currentproduct-detail',
    component: asyncComponent(() => import('../components/containers/productDetail/CurProductDetail')),
    title: '活期理财详情',
  },
  {
    path: '/recharge',
    component: asyncComponent(() => import('../components/containers/recharge/Recharge')),
    title: '充值',
  },
  {
    path: '/recharge-verification',
    component: asyncComponent(() => import('../components/containers/recharge/Verification')),
    title: '充值验证码',
  },
  {
    path: '/recharge-success',
    component: asyncComponent(() => import('../components/containers/recharge/Success')),
    title: '充值成功',
  },
  {
    path: '/withdrawal-entry',
    component: asyncComponent(() => import('../components/containers/withdrawal/WithdrawalEntry')),
    title: '提现测试入口',
  },
  {
    path: '/withdrawal',
    component: asyncComponent(() => import('../components/containers/withdrawal/Withdrawal')),
    title: '提现',
  },
  {
    path: '/withdrawal-verification',
    component: asyncComponent(() => import('../components/containers/withdrawal/Verification')),
    title: '提现验证码',
  },
  {
    path: '/withdrawal-success',
    component: asyncComponent(() => import('../components/containers/withdrawal/Success')),
    title: '提现成功',
  },
  {
    path: '/invest-page',
    component: asyncComponent(() => import('../components/containers/investAssets/InvestPage')),
    title: '投资资产',
  },
  {
    path: '/regular-invest',
    component: asyncComponent(() => import('../components/containers/investAssets/RegularInvest')),
    title: '定期期限',
  },
  {
    path: '/regular-detail',
    component: asyncComponent(() => import('../components/containers/investAssets/InvestDetail')),
    title: '定期期限详情页',
  },
  {
    path: '/current-invest',
    component: asyncComponent(() => import('../components/containers/investAssets/CurrentInvest')),
    title: '活期期限',
  },
  {
    path: '/buying-page',
    component: asyncComponent(() => import('../components/containers/buyingProduct/BuyingPage')),
    title: '购买',
  },
  {
    path: '/author-service',
    component: asyncComponent(() => import('../components/containers/author/authorService')),
    title: '授权',
  },
  {
    path: '/service-agreement',
    component: asyncComponent(() => import('../components/containers/readMe/userServiceAgreement')),
    title: '用户服务协议',
  },
  {
    path: '/author-agreement',
    component: asyncComponent(() => import('../components/containers/readMe/userAuthorAgreement')),
    title: '用户授权协议',
  },
  {
    path: '/pre-open',
    component: asyncComponent(() => import('../components/containers/preOpen')),
    title: '开通提示',
  },
  {
    path: '/upload-id',
    component: asyncComponent(() => import('../components/containers/idCardImgs')),
    title: '上传身份证照',
  },
  {
    path: '/id-info',
    component: asyncComponent(() => import('../components/containers/idCardInfo')),
    title: '上传身份证照',
  },
  {
    path: '/bind-card',
    component: asyncComponent(() => import('../components/containers/bindBankCard')),
    title: '选择绑定卡',
  },
  {
    path: '/card-info',
    component: asyncComponent(() => import('../components/containers/bankCardInfo')),
    title: '银行卡信息',
  },
  {
    path: '/check-card',
    component: asyncComponent(() => import('../components/containers/checkBankCard')),
    title: '校验银行卡信息',
  },
  {
    path: '/success-open',
    component: asyncComponent(() => import('../components/containers/successOpen')),
    title: '电子账户开通提示',
  },
  {
    path: '/page-guide',
    component: asyncComponent(() => import('../components/containers/page-guide/PageGuide')),
    title: '目录',
    checkAuth: 0, // 0 非权限路由 1 权限路由需登陆
  },
  {
    path: '/buying-success',
    component: asyncComponent(() => import('../components/containers/buyingProduct/BuyingSuccessPage')),
    title: '购买结果页',
  },
  {
    path: '/financial-into',
    component: asyncComponent(() => import('../components/containers/financialInto/FinancialInto')),
    title: '转入',
  },
  {
    path: '/success-into',
    component: asyncComponent(() => import('../components/containers/financialInto/Success')),
    title: '转入结果页',
  },
  {
    path: '/financial-out',
    component: asyncComponent(() => import('../components/containers/financialOut/FinancialOut')),
    title: '转出',
  },
  {
    path: '/success-out',
    component: asyncComponent(() => import('../components/containers/financialOut/Success')),
    title: '转出结果页',
  },
  {
    path: '/xcxBindCard',
    component: asyncComponent(() => import('../components/containers/xcxBindCard/XcxBindCard')),
    title: '请稍等...',
    checkAuth: 0,
  },
];

export default RouteConfig;
