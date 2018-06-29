import React from 'react';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import AccountCell from '../../include/accountCell/accountCell';
import ecbutil from '../../../utils/ecbutil';
import s from './list.less';
import h5t from '../../../utils/h5t';

// const mockData = {
//   accountInfoList: [
//     {
//       acNo: '111',
//       balance: '111',
//       bankCardNo: '111',
//       bankId: '111',
//       bankName: '111',
//       cifNo: '111',
//       controlAmt: '111',
//       idNo: '111',
//       idPhotoFlag: '111',
//       mobilephone: '111',
//       userName: '111',
//     },
//     {
//       acNo: '111',
//       balance: '111',
//       bankCardNo: '111',
//       bankId: '111',
//       bankName: '111',
//       cifNo: '111',
//       controlAmt: '111',
//       idNo: '111',
//       idPhotoFlag: '111',
//       mobilephone: '111',
//       userName: '111',
//     },
//     {
//       acNo: '111',
//       balance: '111',
//       bankCardNo: '111',
//       bankId: '111',
//       bankName: '111',
//       cifNo: '111',
//       controlAmt: '111',
//       idNo: '111',
//       idPhotoFlag: '111',
//       mobilephone: '111',
//       userName: '111',
//     },
//     {
//       acNo: '111',
//       balance: '111',
//       bankCardNo: '111',
//       bankId: '111',
//       bankName: '111',
//       cifNo: '111',
//       controlAmt: '111',
//       idNo: '111',
//       idPhotoFlag: '111',
//       mobilephone: '111',
//       userName: '111',
//     },
//     {
//       acNo: '111',
//       balance: '111',
//       bankCardNo: '111',
//       bankId: '111',
//       bankName: '111',
//       cifNo: '111',
//       controlAmt: '111',
//       idNo: '111',
//       idPhotoFlag: '111',
//       mobilephone: '111',
//       userName: '111',
//     },
//     {
//       acNo: '111',
//       balance: '111',
//       bankCardNo: '111',
//       bankId: '111',
//       bankName: '111',
//       cifNo: '111',
//       controlAmt: '111',
//       idNo: '111',
//       idPhotoFlag: '111',
//       mobilephone: '111',
//       userName: '111',
//     },
//   ],
// };

@inject('AccountModel')
@observer
class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountInfoList: [],
    };
  }

  componentDidMount() {
    // TODO

    // console.log(mockData);
    // console.log(this.props);
    h5t.track('pageview', { eventId: 'H5_financialmarket_p_accountlist' });
    const _self = this;
    this.props.AccountModel.getAccountInfoList({ channel: 0 }).then((res) => {
      console.log(res, '>>>>>');
      _self.setState({
        accountInfoList: res.accountInfoList,
      });
    });
  }

  handleClick = (item) => {
    h5t.track('trackevent', { eventId: 'H5_financialmarket_acclistDetail' });
    // e.preventDefault();
    console.log('click');
    console.log(ecbutil.decryptByDES(item.bankId));
    this.props.AccountModel.setPanView(ecbutil.decryptByDES(item.pan));
    this.props.AccountModel.setBankIdView(item.bankId);
    this.props.AccountModel.setBalanceView(ecbutil.decryptByDES(item.balance));
    this.props.AccountModel.setPhoneNoView(ecbutil.decryptByDES(item.phoneNo));
    this.props.history.push('/account-detail');
  };

  render() {
    const accountInfoList = this.state.accountInfoList || [];
    // const accountInfoList = mockData.accountInfoList || [];
    return (
      <div>
        <div className={s.listContainer}>
          {
            accountInfoList.map((item) => {
              const accountItem = _.cloneDeep(item);
              accountItem.balance = ecbutil.decryptByDES(accountItem.balance);
              accountItem.pan = ecbutil.decryptByDES(accountItem.pan);
              return (
                <AccountCell params={accountItem} onClick={() => { this.handleClick(item); }} />
              );
            }
            )
          }
        </div>
      </div>

    );
  }
}

export default List;
