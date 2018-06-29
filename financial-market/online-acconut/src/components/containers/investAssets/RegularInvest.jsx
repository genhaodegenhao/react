import React from 'react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { getQueryString, setUrlParams } from '../../../utils/toolFunc';
import _h5t from '../../../utils/h5t';
import s from './investment.less';
import financeIcon from '../../../assets/img/investment/img_my_finance_list.png';
import holdingIcon from '../../../assets/img/investment/icon_hold.png';
import purchaseIcon from '../../../assets/img/investment/icon_purchase.png';

@inject('FinancingPageModel')
@observer
class RegularAssetsPage extends React.Component {
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
      eventId: 'H5_financialmarket_p_regularInvestment',
    });
    this.props.FinancingPageModel.getOwnRegularAssets(this.state.channel);
  }
  handleHrefDetail = (item) => {
    const params = {
      channel: item.bankId,
      prdCode: item.productCode,
      prdName: item.productName,
    };
    this.props.history.push(`/regular-detail${setUrlParams(params)}`);
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
        <div className={s.totalEarnings}>
          持有项目预期总收益(元)：{this.props.FinancingPageModel.ownAssetsInfoObj.atpHoldProfit}
        </div>
        <div className={s.investList}>
          <ul>
            {
              this.props.FinancingPageModel.productLists.map((item) => {
                return (
                  <li onClick={() => { this.handleHrefDetail(item); }}>
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
                        <div className={s.earningDay}>
                          收益发放日 {moment(item.nextProfitDate, 'YYYYMMDDHHmm').format('YYYY/MM/DD')}
                        </div>
                      </div>
                    </div>
                    <div>
                      <img className={s.holdingIcon} src={holdingIcon} alt="" />
                      {
                        item.productStatus == 2 ? <img className={s.holdingIcon} src={holdingIcon} alt="" /> : <img className={s.holdingIcon} src={purchaseIcon} alt="" />
                      }
                    </div>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    );
  }
}

export default RegularAssetsPage;