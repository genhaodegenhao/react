import React from 'react';
import {
  Router,
  Route,
  Redirect,
} from 'react-router-dom';
import { spring, AnimatedSwitch } from 'react-router-transition';
import createHashHistory from 'history/createHashHistory';
import { asyncComponent } from '../utils/asyncComponent';
import Layout from '../components/containers/layout/Layout';
import RouteConfig from './routeConfig';
import AuthCheck from './authCheck';
import { setPageTitle } from '../utils/toolFunc';

const history = createHashHistory();

const noMatch = asyncComponent(() => import('../components/containers/no-match/noMatch'));


const RouteCtrl = (route) => {
  setPageTitle(route.title);
  const view = route.checkAuth === 0 ?
    (
      <Route
        exact
        path={route.path}
        component={route.component}
      />
    )
    :
    (
      <AuthCheck>
        <Route
          exact
          path={route.path}
          component={route.component}
        />
      </AuthCheck>
    );
  return view;
};

function mapStyles(styles) {
  return {
    transform: `translate(${styles.scale}%)`,
    position: 'absolute',
    width: '100%',
    height: '100%',
  };
}

// function mapStyles() {
//   return {
//     position: 'absolute',
//     width: '100%',
//   };
// }

// wrap the `spring` helper to use a bouncy config
function bounce(val) {
  return spring(val, {
    stiffness: 180,
    damping: 22,
  });
}

// child matches will...
const bounceTransition = {
  atEnter: {
    scale: 300,
  },
  atLeave: {
  },
  atActive: {
    scale: bounce(0),
  },
};

const routes = (
  <Router history={history} key={Math.random()}>
    <Layout history={history}>
      <AnimatedSwitch
        atEnter={bounceTransition.atEnter}
        atLeave={bounceTransition.atLeave}
        atActive={bounceTransition.atActive}
        mapStyles={mapStyles}
        className="switch-wrapper"
      >
        <Redirect exact from={'/' || '/index.html'} to="/home" />
        {
          RouteConfig.map((route) => {
            return (
              <RouteCtrl key={Math.random()} {...route} />
            );
          })}
        <Redirect exact from="/index.html" to="/account-list" />
        <Route component={noMatch} />
      </AnimatedSwitch>
    </Layout>
  </Router>
);

export default routes;
