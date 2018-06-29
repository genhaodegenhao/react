import React from 'react';
import { inject, observer } from 'mobx-react';
import { getQueryString } from '../../../utils/toolFunc';
import _h5t from '../../../utils/h5t';
import s from './investment.less';

@inject('FinancingPageModel')
@observer
class RegularDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
    };
  }

  componentDidMount() {
    // TODO
    _h5t.track('pageview', {
      eventId: 'H5_financialmarket_p_regularInvestmentDetail',
    });
    const search = this.props.history.location.search;
    const bankId = getQueryString('channel', search);
    const proCode = getQueryString('prdCode', search);
    const productName = getQueryString('prdName', search);
    this.props.FinancingPageModel.getRegularDetailInfo(bankId, proCode);
    document.title = productName;
  }

  render() {
    return (
      <div className={s.investment}>
        <div className={s.detailText}>产品成立，计息中</div>
        <div className={s.investHeader} style={{ background: '#fff' }}>
          <div className={s.top}>
            <div className={s.totalText} style={{ color: '#000' }}>项目总本金(元)</div>
            <div className={s.totalAmt} style={{ color: '#f54d4f' }}>
              {this.props.FinancingPageModel.regularDetailInfoObj.holdAmt}
            </div>
          </div>
        </div>
        <div className={s.assetEarning}>
          <ul>
            <li className={s.productInfoOne}>
              <div className={s.innerLeft}>收益方式</div>
              <div className={s.innerRight}>
                {this.props.FinancingPageModel.regularDetailInfoObj.settlementMethod === '0' ? '一次性还本付息' : '定期付息，到期结算'}
              </div>
            </li>
            <li>
              <div className={s.innerLeft}>持有项目份额(份)</div>
              <div className={s.innerRight}>
                {this.props.FinancingPageModel.regularDetailInfoObj.holdShare}
              </div>
            </li>
            <li className={s.productInfoThree}>
              <div className={s.innerLeft}>预计总收益(元)</div>
              <div className={s.innerRight}>
                {this.props.FinancingPageModel.regularDetailInfoObj.totalProfit}
              </div>
            </li>
            <li>
              <div className={s.innerLeft}>产品到期日</div>
              <div className={s.innerRight}>
                {this.props.FinancingPageModel.regularDetailDate}
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default RegularDetailPage;
