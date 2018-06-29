import ReactDOM from 'react-dom';
import attachFastClick from 'fastclick';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';
// import DevTools from 'mobx-react-devtools';

import 'assets/css/global.less';
import 'assets/css/mod_css/entry.less';

import routers from '../../routes/route';

import GlobalModel from '../../models/GlobalModel';
import AccountModel from '../../models/AccountModel';
import HomeModel from '../../models/HomeModel';
import BuyingPageModel from '../../models/BuyingPageModel';
import PrdDetailModel from '../../models/PrdDetailModel';
import RechargeModel from '../../models/RechargeModel';
import FinancingPageModel from '../../models/MyFinancingModel';
import WithdrawalModel from '../../models/WithdrawalModel';
import FinancialIntoModel from '../../models/FinancialIntoModel';
import FinancialOutModel from '../../models/FinancialOutModel';
import AuthModel from '../../models/AuthModel';

import h5t from '../../utils/h5t';

h5t.init();

if (process.env.NODE_ENV !== 'production' && process.env.DEBUG) {
  const eruda = require('eruda');
  // open debug mod
  eruda.init();
}

attachFastClick.attach(document.body);

const stores = {
  GlobalModel,
  AccountModel,
  HomeModel,
  BuyingPageModel,
  PrdDetailModel,
  RechargeModel,
  FinancingPageModel,
  WithdrawalModel,
  FinancialIntoModel,
  FinancialOutModel,
  AuthModel,
};

const MOUNT_NODE = document.getElementById('root');

window._____APP_STATE_____ = stores;

configure({ enforceActions: true });

ReactDOM.render(
  <Provider {...stores}>
    <div>
      {/* {process.env.NODE_ENV !== 'production' && process.env.DEBUG ? <DevTools /> : null} */}
      { routers }
    </div>
  </Provider>, MOUNT_NODE,
);
