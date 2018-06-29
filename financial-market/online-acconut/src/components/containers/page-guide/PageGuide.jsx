import React from 'react';
import {
  List,
} from 'antd-mobile';
import { Link } from 'react-router-dom';
import RouteConfig from '../../../routes/routeConfig';

const Item = List.Item;

class PageGuide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <List renderHeader={() => '目录'}>
          {
            RouteConfig.map((item) => {
              let view = null;
              if (item.path !== '/page-guide') {
                view = <Link to={item.path}><Item arrow="horizontal">{item.path}【{item.title}】</Item></Link>;
              }
              return view;
            })
          }
        </List>
      </div>
    );
  }
}

export default PageGuide;
