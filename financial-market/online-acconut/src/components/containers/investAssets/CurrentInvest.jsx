import React from 'react';
import { inject, observer } from 'mobx-react';
import { getQueryString, setUrlParams } from '../../../utils/toolFunc';
import _h5t from '../../../utils/h5t';
import s from './investment.less';
import financeIcon from '../../../assets/img/investment/img_my_finance_list.png';

@inject('FinancingPageModel')
@observer
class CurrentAssetsPage extends React.Component {
  constructor(props) {
    super(props);
    const search = this.props.history.location.search;
    this.state = {
      channel: getQueryString('channel', search),
      iconurl: 'https://oms-cloud.99bill.com/h5/static/h5-resource/img/bank_icon/',
    };
  }

  componentDidMount() {
    // TODO
    _h5t.track('pageview', {
      eventId: 'H5_financialmarket_p_currentInvestment',
    });
    this.props.FinancingPageModel.getOwnCurrentAssets(this.state.channel);
  }
  handleClickDetail = (item) => {
    const params = {
      prdCode: item.productCode,
      channel: item.bankId,
      prdName: item.productName,
      bankName: item.bankName,
    };
    this.props.history.push(`/currentproduct-detail${setUrlParams(params)}`);
  };

  /* eslint-disable */
  render() {
    return (
      <div className={s.investment}>
        <div className={s.investHeader}>
          <div className={s.top}>
            <div className={s.totalText}>项目总本金(元)</div>
            <div className={s.totalAmt}>
              {this.props.FinancingPageModel.ownAssetsInfoObj.atpBalance}
            </div>
          </div>
          <div className={s.financeIcon}><img src={financeIcon} alt="" /></div>
        </div>
        <div className={s.investList}>
          <ul>
            {
              this.props.FinancingPageModel.productLists.map((item) => {
                return (
                  <li onClick={() => { this.handleClickDetail(item); }}>
                    <div className={s.listTop}>
                      <div className={s.bankIcon}>
                        <img src={`${this.state.iconurl}bank_${item.bankId.toLowerCase()}.png`} alt="bankicon" />
                      </div>
                      <div className={s.bankDes}>
                        <div className={s.bankName}>
                          {item.bankName} {item.productName}
                        </div>
                        <div className={s.bankNumber}>
                          {item.productCode}
                        </div>
                      </div>
                    </div>
                    <div className={s.listContent}>
                      <div className={s.bankPrice}>
                        {item.amount}
                      </div>
                      <div className={s.bankPriceDes}>
                        <div className={s.ownPrice}>持有本金(元)</div>
                      </div>
                    </div>
                  </li>
                );
              })
            }
          </ul>
        </div>
      </div>
    );
  }
}

export default CurrentAssetsPage;
