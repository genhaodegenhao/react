import React from 'react';
import { Toast } from 'antd-mobile';
import { inject, observer } from 'mobx-react';

import style from './bind-bank-card.less';
import checkedImg from '../../../assets/img/author/success.png';
import addImg from '../../../assets/img/author/ic_add_old_card.png';
import api from '../../../backend/api';
import { decryptByDES } from '../../../utils/ecbutil';
import h5t from '../../../utils/h5t';

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-param-reassign */
@inject('AuthModel')
@observer
class BindBankCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // electronicAccountList: [],
    };
  }
  componentDidMount() {
    h5t.track('pageview', { eventId: 'H5_financialmarket_p_bindBankCard' });
    // this.getData();
    const { AuthModel } = this.props;
    AuthModel.getElectronicAccountList();
  }
  getData = () => {
    const _this = this;
    const parameter = {
      channel: window.sessionStorage.getItem('FINANCIAL_AUTHOR_CHANNEL'),
    };
    api.bankSupport(parameter).then((res) => {
      if (res.respCode === '00') {
        _this.setState({
          electronicAccountList: res.bankList,
        });
      } else {
        Toast.fail(res.respMsg, 2);
      }
    }).catch((e) => {
      Toast.fail(e.respMsg, 2);
    });
  }
  selectedBankCard = (bankCard) => {
    h5t.track('trackevent', { eventId: 'H5_financialmarket_selectedBankCard' });
    const { AuthModel } = this.props;
    AuthModel.selectedBankCard(bankCard);
  }
  addBankCard = () => {
    h5t.track('trackevent', { eventId: 'H5_financialmarket_addBankCard' });
    window.open(`https://www.99bill.com/seashell/webapp/billtrunk2/bindcard.html?nextPage=${window.location.href}`);
  }
  next = () => {
    const { history } = this.props;
    const bankCardInfo = window.sessionStorage.getItem('FINANCIAL_AUTHOR_BANKINFO');
    if (bankCardInfo) {
      history.push('/card-info');
    } else {
      Toast.fail('请选择一张银行卡进行绑定', 2);
    }
  }
  render() {
    const { AuthModel } = this.props;
    return (
      <div className={style.container}>
        <div className={style.tips}>
          <span className={style.tipIcon}>{/* 占位符 */}</span>
          暂不支持信用卡作为收款卡
        </div>
        <div className={style.bankList}>
          <ul>
            {
              AuthModel.newElectronicAccountList.map((item) => {
                return (
                  <li className="border-bottom" onClick={() => this.selectedBankCard(item)}>
                    <img src={`http://oms-cloud.99bill.com/h5/static/h5-resource/img/bank_icon/bank_${item.bankId && item.bankId.toLowerCase()}.png`} alt="bankIcon" width="30" height="30" className={style.bankIcon} />
                    <span className={style.bankNo}> {item.bankName}{`（${decryptByDES(item.pan).substr(decryptByDES(item.pan).length - 4)}）`}</span>
                    {
                      item.checked
                        ? <img src={checkedImg} alt="checked" width="30" height="30" className={style.checkedImg} />
                        : null
                    }
                  </li>
                );
              })
            }
          </ul>
          <div className={style.add} onClick={() => this.addBankCard()}>
            <img src={addImg} alt="add bank" width="30" height="30" />
            添加银行卡
          </div>
        </div>
        <div className={style.button} onClick={() => this.next()}>下一步</div>
      </div>
    );
  }
}


export default BindBankCard;
