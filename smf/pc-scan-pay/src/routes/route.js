import ConfirmOrder from '../components/containers/ConfirmOrder';
import OrderSuccess from '../components/containers/OrderSuccess';
import OrderQrcode from '../components/containers/OrderQrcode';
import Order404 from '../components/containers/Order404';

const router = {
  'p/confirmorder.html': {
    mod: ConfirmOrder,
    title: '确认订单',
  },
  'p/ordersuccess.html': {
    mod: OrderSuccess,
    title: '交易结果',
  },
  'p/orderqrcode.html': {
    mod: OrderQrcode,
    title: '保单二维码',
  },
  'p/order404.html': {
    mod: Order404,
    title: '订单失效',
  },
};

export default router;
