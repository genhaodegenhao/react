import React from 'react';
import { inject, observer } from 'mobx-react';
import { getQueryString, setUrlParams } from '../../../utils/toolFunc';
import _h5t from '../../../utils/h5t';
import s from './investment.less';
import accountIcon from '../../../assets/img/investment/ic_card.png';
import bottomBack from '../../../assets/img/investment/img_my_finance.png';
import currentIcon from '../../../assets/img/investment/icon_current.png';
import regularIcon from '../../../assets/img/investment/icon_regular.png';
import arrowRight from '../../../assets/img/investment/ic_arrow_grey.png';

@inject('FinancingPageModel')
@observer
class AssetsPage extends React.Component {
  constructor(props) {
    super(props);
    const search = this.props.history.location.search;
    this.state = {
      channel: getQueryString('channel', search),
    };
  }

  componentDidMount() {
    // TODO
    _h5t.track('pageview', {
      eventId: 'H5_financialmarket_p_investment',
    });
    this.props.FinancingPageModel.getMyFinancingInfo(this.state.channel);
  }
  clickHrefRegular = () => {
    _h5t.track('trackevent', {
      eventId: 'H5_financialmarket_regularInvestment',
    });
    const params = {
      channel: this.state.channel,
    };
    this.props.history.push(`/regular-invest${setUrlParams(params)}`);
  };
  clickHrefCurrent = () => {
    _h5t.track('trackevent', {
      eventId: 'H5_financialmarket_currentInvestment',
    });
    const params = {
      channel: this.state.channel,
    };
    this.props.history.push(`/current-invest${setUrlParams(params)}`);
  };

  render() {
    return (
      <div className={s.investment}>
        <div className={s.assetDetail}>
          <div className={s.top}>
            <div className={s.totalText}>投资总额(元)</div>
            <div className={s.totalAmt}>
              {this.props.FinancingPageModel.financalInfoObj.totalAmt}
            </div>
          </div>
          <div className={s.bottom}>
            <div className={s.holdPrincipal}>
              累计收益(元)：{this.props.FinancingPageModel.financalInfoObj.profitAmt}
            </div>
          </div>
          <div className={s.sidebarAccount}>
            <div className={s.accountIcon}><img src={accountIcon} alt="" /></div>
            <div className={s.account}>电子账户</div>
          </div>
          <div className={s.bottomBack}><img src={bottomBack} alt="" /></div>
        </div>
        <div className={s.assetType}>
          <div className={s.currentDate} onClick={this.clickHrefCurrent}>
            <div className={s.icon}><img src={currentIcon} alt="" /></div>
            <div className={s.rightArea}>
              <div className={s.text}>灵活期限</div>
              <div className={s.num}>
                {this.props.FinancingPageModel.financalInfoObj.fpdAmt}
              </div>
              <div className={s.arrow}><img src={arrowRight} alt="" /></div>
            </div>
          </div>
          <div className={s.currentDate} onClick={this.clickHrefRegular}>
            <div className={s.icon}><img src={regularIcon} alt="" /></div>
            <div className={s.rightArea}>
              <div className={s.text}>固定期限</div>
              <div className={s.num}>
                {this.props.FinancingPageModel.financalInfoObj.atpHoldAmt}
              </div>
              <div className={s.arrow}><img src={arrowRight} alt="" /></div>
            </div>
          </div>
          <div className={s.currentDate} style={{ marginTop: '20px' }}>
            <div className={s.icon}><img src={regularIcon} alt="" /></div>
            <div className={s.rightArea}>
              <div className={s.text}>交易记录</div>
              <div className={s.num}>0</div>
              <div className={s.arrow}><img src={arrowRight} alt="" /></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AssetsPage;

