import React from 'react';
import ReactDOM from 'react-dom';

import {Router, Route, hashHistory, IndexRoute} from 'react-router';

import Login from './components/login/login';
import NewHome from './components/home/newhome';


import 'antd/dist/antd.css';
import './assets/Style/common/reset.css';

import App from './App';
ReactDOM.render(
	<Router history={hashHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={Login} />
			<Route path="NewHome" component={NewHome}/>
		</Route>
	</Router>
	, document.getElementById('root'));

