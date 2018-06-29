import React from 'react';
import {
  Button,
  WhiteSpace,
  WingBlank,
} from 'antd-mobile';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import s from './fixedproductDetail.less';
import { getQueryString, setUrlParams, setPageTitle } from '../../../utils/toolFunc';
import h5t from '../../../utils/h5t';

@inject('PrdDetailModel')
@observer
class FixedproductDetail extends React.Component {
  constructor(props) {
    super(props);
    const search = this.props.history.location.search;
    this.state = {
      channel: getQueryString('channel', search),
      bankName: getQueryString('bankName', search),
      productCode: getQueryString('prdCode', search),
      productName: getQueryString('prdName', search),
    };
  }

  componentWillMount() {
    this.props.PrdDetailModel.getFixedPrdDetail({
      channel: this.state.channel,
      productCode: this.state.productCode,
    });
    setPageTitle(this.state.productName);
  }

  componentDidMount() {
    h5t.track('pageview', { eventId: 'H5_financialmarket_p_fixedprddetail' });
  }

  handleBuy = () => {
    h5t.track('trackevent', { eventId: 'H5_financialmarket_fixedprddetailFbuy' });
    this.props.PrdDetailModel.checkAccount({
      channel: this.state.channel,
    }).then(() => {
      const isOpenAccount = this.props.PrdDetailModel.isOpenAccount;
      const productInfo = this.props.PrdDetailModel.fixedPrdDetail.productInfo;
      const buyParams = {
        channel: this.state.channel,
        prdCode: this.state.productCode,
        prdName: this.state.productName,
        returnRate: productInfo.returnRate,
        investPeriod: productInfo.investPeriod,
      };
      if (isOpenAccount) {
        // 是，跳转购买
        this.props.history.push(`/buying-page${setUrlParams(buyParams)}`);
      } else {
        // 否，跳转开通
        const params = {
          channel: this.state.channel,
          bankName: this.state.bankName,
          backurl: `/buying-page${setUrlParams(buyParams)}`,
        };
        this.props.history.push(`/author-service${setUrlParams(params)}`);
      }
    }).catch(() => { });
  }

  render() {
    const detail = this.props.PrdDetailModel.fixedPrdDetail || {};
    const contractList = detail.contractList || [];
    // const problemUrl = detail.problemUrl || '';
    const productInfo = detail.productInfo || {};
    // const productRuleInfoList = detail.productRuleInfoList || [];
    // const profitList = detail.profitList || [];

    return (
      <div className={s.wrap}>
        <div className={s.topArea}>
          <div className={s.topAreaMsg1}>
            <div>预计收益率</div>
            <div>{productInfo.returnRate || '-'}</div>
            <div>
              <span>{productInfo.raiseRemainDay || '- 天'}后募集结束</span>
            </div>
          </div>
          <div className={s.topAreaMsg2}>
            <div className={s.topAreaMsg2Item}>
              <div>{productInfo.investPeriod || '- 天'}</div>
              <div>期限</div>
            </div>
            <div className={s.topAreaMsg2Item}>
              <div>{productInfo.investAmtFrom || '-'}元</div>
              <div>起投金额</div>
            </div>
          </div>
        </div>
        <div className={s.mainArea1}>
          <div className={s.mainAreaItem}>
            <div>开始募集</div>
            <div>{productInfo.raiseFrom ? moment(productInfo.raiseFrom, 'YYYYMMDDHHmm').format('YYYY/MM/DD') : '-'}</div>
          </div>
          <div className={s.mainAreaItem}>
            <div>个人购买限额</div>
            <div>{productInfo.raiseTotalAmt || '-'}</div>
          </div>
          <div className={s.mainAreaItem}>
            <div>募集结束</div>
            <div>{productInfo.raiseTo ? moment(productInfo.raiseTo, 'YYYYMMDDHHmm').format('YYYY/MM/DD') : '-'}</div>
          </div>
          <div className={s.mainAreaItem}>
            <div>风险等级</div>
            <div>{{ R1: '谨慎型', R2: '稳健型', R3: '平衡型', R4: '进取型', R5: '激进型' }[productInfo.riskLevel] || '-'}</div>
          </div>
          <div className={s.mainAreaItem}>
            <div>产品成立（起息日）</div>
            <div>{productInfo.interestFrom ? moment(productInfo.interestFrom, 'YYYYMMDD').format('YYYY/MM/DD') : '-'}</div>
          </div>
          <div className={s.mainAreaItem}>
            <div>结息方式</div>
            <div>{['一次性还本付息', '定期付息，到期结算'][productInfo.settlementMethod] || '-'}</div>
          </div>
          <div className={s.mainAreaItem}>
            <div>产品到期</div>
            <div>{productInfo.settlementDate ? moment(productInfo.settlementDate, 'YYYYMMDD').format('YYYY/MM/DD') : '-'}</div>
          </div>
          <div className={s.mainAreaItem}>
            <div>结息周期</div>
            <div>{['手工', '每日', '每月', '每季', '每年'][productInfo.settlementPeriod] || '-'}</div>
          </div>
        </div>
        <div className={s.mainArea2}>
          {
            contractList.map((item) => {
              return (
                <div className={s.mainAreaItem}>
                  <div>{item.name}</div>
                  <div>{item.content}</div>
                </div>
              );
            })
          }
        </div>
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
        <WingBlank>
          <Button type="primary" onClick={this.handleBuy} disabled={this.state.channel === null}>购买</Button>
        </WingBlank>
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
      </div >
    );
  }
}

export default FixedproductDetail;
