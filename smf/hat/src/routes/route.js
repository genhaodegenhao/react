import ConfirmOrder from '../components/containers/ConfirmOrder';
import OrderSuccess from '../components/containers/OrderSuccess';
import OrderQrcode from '../components/containers/OrderQrcode';

const router = {
  'p/confirmorder.html': {
    mod: ConfirmOrder,
    title: '确认订单',
  },
  'p/ordersuccess.html': {
    mod: OrderSuccess,
    title: '保单付费',
  },
  'p/orderqrcode.html': {
    mod: OrderQrcode,
    title: '保单二维码',
  },
};

export default router;
