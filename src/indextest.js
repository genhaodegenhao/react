import React from 'react';
import ReactDOM from 'react-dom';

import {Router, Route, hashHistory, IndexRoute} from 'react-router';

import Login from './components/login/login';
import Home from './components/home/home';
import newHome from './components/home/newhome';

import AddReaourceInf from './components/resource-inf/added-resource-information';
import SearchUserMsg from './components/user-msg/search-user-msg';
import ModifyUserMsg from './components/user-msg/modify-user-msg';
import DistributionRole from './components/user-msg/distribution-role';
import AddUserInformation from './components/user-msg/add-user-information';
import SearchResource from './components/resource-inf/searchResource';
import ModifyResource from './components/resource-inf/modifyResource';
import SearchDitMsg from './components/dict-msg/search-dict-message';
import ModifyDictMsg from './components/dict-msg/modify-dict-msg';
import AddDictMsg from './components/dict-msg/add-dict-msg';

import SearchRole from './components/role-info/searchRole';
import ModifyRoleInfo from './components/role-info/modifyRoleInfo';
import AddRoleInfo from './components/role-info/addRoleInfo';
import AddRoleMenu from './components/role-info/addRoleMenu';
import AddRoleResource from './components/role-info/addRoleResource';

import SearchBonusMsg from './components/bonus/search-bonus-msg';
import AddBonusMsg from './components/bonus/add-bonus-msg';
import ModifyBonusMsg from './components/bonus/modify-bonus-msg';

import SearchMenuInfo from './components/menu-info/search-menu-info';
import AddMenuInfo from './components/menu-info/add-menu-info';
import UpdateMenuInfo  from './components/menu-info/update-menu-info';

import AuthUrlList from './components/auth/authUrlList';
import AddAuthUrl from './components/auth/addAuthUrl';
import UpdateAuthUrl from './components/auth/updateAuthUrl';
import Success from './components/auth/success';

import newTokenCheck from './components/card2/newtokenCheck';
import newateOrder from './components/card2/newateOrder';
import newDelChat from './components/card2/newdeletechatrelatio';

import 'antd/dist/antd.css';
import './assets/Style/common/reset.css';

import App from './App';
ReactDOM.render(
	<Router history={hashHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={Login} />
			<Route path="newHome" component={newHome} >
                <Route path="/html/searchUserMsg" component={SearchUserMsg} />
                <Route path="/html/addUserInformation" component={AddUserInformation} />
                <Route path="/html/addReaourceInf" component={AddReaourceInf} />
                <Route path="/html/searchResource" component={SearchResource} />
                <Route path="/html/modifyUserMsg" component={ModifyUserMsg} />
                <Route path="/html/distributionRole" component={DistributionRole} />
                <Route path="/html/modifyResource" component={ModifyResource} />

                <Route path="/html/searchDict" component={SearchDitMsg} />
                <Route path="/html/modifyDictMsg" component={ModifyDictMsg} />
                <Route path="/html/addDictMsg" component={AddDictMsg} />

                <Route path="/html/searchBonusMsg" component={SearchBonusMsg} />
                <Route path="/html/addBonusMsg" component={AddBonusMsg} />
                <Route path="/html/modifyBonusMsg" component={ModifyBonusMsg} />

                <Route path="/html/searchMenuInfo" component={SearchMenuInfo} />
                <Route path="/html/addMenuInfo" component={AddMenuInfo} />
                <Route path="/html/updateMenuInfo" component={UpdateMenuInfo} />

                <Route path="/html/searchRole" component={SearchRole} />
                <Route path="/html/modifyRoleInfo" component={ModifyRoleInfo} />
                <Route path="/html/addRoleInfo" component={AddRoleInfo} />
                <Route path="/html/addRoleMenu" component={AddRoleMenu} />
                <Route path="/html/addRoleResource" component={AddRoleResource} />

                <Route path="/html/authUrlList" component={AuthUrlList} />
                <Route path="/html/addAuthUrl" component={AddAuthUrl} />
                <Route path="/html/updateAuthUrl" component={UpdateAuthUrl} />
                <Route path="/html/success" component={Success} />

                <Route path="/html/newTokenCheck" component={newTokenCheck} />
                <Route path="/html/newateOrder" component={newateOrder} />
                <Route path="/html/newdeletechatrelation" component={newDelChat} />
            </Route>
		</Route>
	</Router>
	, document.getElementById('root'));

