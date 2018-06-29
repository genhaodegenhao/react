import React from 'react';
import {
  List,
} from 'antd-mobile';
// import { inject, observer } from 'mobx-react';
import API from '../../../backend/api';

const Item = List.Item;

// @inject('WithdrawalModel')
// @observer
class WithdrawalEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountInfoList: [],
    };
  }

  componentDidMount() {
    API.withdrawQueryAccount({
      channel: 0,
    }).then((res) => {
      this.setState({
        accountInfoList: res.accountInfoList,
      });
    });
  }

  render() {
    return (
      <div>
        <List>
          {
            this.state.accountInfoList.map((item) => {
              return (
                <Item onClick={() => { this.props.history.push(`/withdrawal?channel=${item.bankId}`); }}>
                  {item.bankName}
                </Item>);
            })
          }
        </List>
      </div>
    );
  }
}

export default WithdrawalEntry;
