import React from 'react';
import {
  Button,
  WhiteSpace,
  Flex,
} from 'antd-mobile';
import { inject, observer } from 'mobx-react';
// import echarts from 'echarts/dist/echarts.simple.js';
import echarts from 'echarts';
import s from './curProductDetail.less';
import Img1 from '../../../assets/img/investment/ic_card.png';
import { getQueryString, setUrlParams, setPageTitle } from '../../../utils/toolFunc';
import h5t from '../../../utils/h5t';

@inject('PrdDetailModel')
@observer
class CurProductDetail extends React.Component {
  constructor(props) {
    super(props);
    const search = this.props.history.location.search;
    this.state = {
      channel: getQueryString('channel', search),
      bankName: getQueryString('bankName', search),
      productCode: getQueryString('prdCode', search),
      productName: getQueryString('prdName', search),
      curChart: 1,
      chartData1: {
        xdata: [],
        ydata: [],
      },
      chartData2: {
        xdata: [],
        ydata: [],
      },
    };
  }

  componentWillMount() {
    setPageTitle(this.state.productName);
  }

  componentDidMount() {
    h5t.track('pageview', { eventId: 'H5_financialmarket_p_currentprddetail' });
    this.props.PrdDetailModel.getCurPrdDetail({
      channel: this.state.channel,
      productCode: this.state.productCode,
    }).then(() => {
      const detail = this.props.PrdDetailModel.curPrdDetail || {};
      const profitList = detail.profitList || [];
      const xdata = [];
      const ydata1 = [];
      const ydata2 = [];
      profitList.forEach((item) => {
        xdata.push(item.date);
        ydata1.push(item.profitRateSeven / 10000);
        ydata2.push(item.profit / 10000);
      });

      this.setState({
        chartData1: {
          xdata,
          ydata: ydata1,
        },
        chartData2: {
          xdata,
          ydata: ydata2,
        },
      }, () => {
        this.renderCharts1();
      });
    }).then(() => { });
  }

  handleFinancialOut = () => {
    h5t.track('trackevent', { eventId: 'H5_financialmarket_curprddetailFout' });
    this.props.PrdDetailModel.checkAccount({
      channel: this.state.channel,
    }).then(() => {
      const isOpenAccount = this.props.PrdDetailModel.isOpenAccount;
      const outParams = {
        channel: this.state.channel,
        prdCode: this.state.productCode,
        prdName: this.state.productName,
      };
      if (isOpenAccount) {
        // 是，跳转转出
        this.props.history.push(`/financial-out${setUrlParams(outParams)}`);
      } else {
        // 否，跳转开通
        const params = {
          channel: this.state.channel,
          bankName: this.state.bankName,
          backurl: `/financial-out${setUrlParams(outParams)}`,
        };
        this.props.history.push(`/author-service${setUrlParams(params)}`);
      }
    }).catch(() => { });
  }

  handleFinancialIn = () => {
    h5t.track('trackevent', { eventId: 'H5_financialmarket_curprddetailFin' });
    this.props.PrdDetailModel.checkAccount({
      channel: this.state.channel,
    }).then(() => {
      const isOpenAccount = this.props.PrdDetailModel.isOpenAccount;
      const productInfo = this.props.PrdDetailModel.curPrdDetail.productInfo;
      console.log(productInfo);
      const inParams = {
        channel: this.state.channel,
        prdCode: this.state.productCode,
        prdName: this.state.productName,
        returnRate: productInfo.returnRate,
        investPeriod: productInfo.investPeriod,
      };
      if (isOpenAccount) {
        // 是，跳转购买
        this.props.history.push(`/financial-into${setUrlParams(inParams)}`);
      } else {
        // 否，跳转开通
        const params = {
          channel: this.state.channel,
          bankName: this.state.bankName,
          backurl: `/financial-into${setUrlParams(inParams)}`,
        };
        this.props.history.push(`/author-service${setUrlParams(params)}`);
      }
    }).catch(() => { });
  }

  renderCharts1 = () => {
    const myChart = echarts.init(document.getElementById('curProductDetailCharts'));
    const option = {
      xAxis: {
        type: 'category',
        data: this.state.chartData1.xdata, // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        // show: false,
      },
      grid: {
        top: '5%',
      },
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: (item) => {
          return `${item.name} 七日年化：${item.value}%</div>`;
        },
        triggerOn: 'click',
      },
      yAxis: {
        type: 'value',
      },
      series: [{
        data: this.state.chartData1.ydata, // [1, 10, 50, 20, 80, 10, 90],
        type: 'line',
        symbol: 'circle',
        symbolColor: '#f54d4f',
        symbolSize: 5,
        itemStyle: {
          normal: {
            borderWidth: 40,
            borderColor: 'transparent',
          },
        },
      }],
      color: ['#f54d4f'],
    };

    myChart.setOption(option);
  }

  renderCharts2 = () => {
    const myChart2 = echarts.init(document.getElementById('curProductDetailCharts2'));
    const option2 = {
      grid: {
        top: '5%',
      },
      tooltip: {
        trigger: 'item',
        formatter: (item) => {
          return `${item.name} 万份收益：${item.value}元</div>`;
        },
        triggerOn: 'click',
      },
      xAxis: {
        type: 'category',
        data: this.state.chartData2.xdata, // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [{
        data: this.state.chartData2.ydata, // [10, 10, 30, 50, 80, 10, 40],
        type: 'line',
        symbol: 'circle',
        symbolColor: '#f54d4f',
        symbolSize: 5,
        itemStyle: {
          normal: {
            borderWidth: 40,
            borderColor: 'transparent',
          },
        },
      }],
      color: ['#f54d4f'],
    };

    myChart2.setOption(option2);
  }

  render() {
    const detail = this.props.PrdDetailModel.curPrdDetail || {};
    // const contractList = detail.contractList || [];
    // const problemUrl = detail.problemUrl || '';
    const productInfo = detail.productInfo || {};
    // const productRuleInfoList = detail.productRuleInfoList || [];
    // const profitList = detail.profitList || [];

    return (
      <div className={s.wrap} style={{ minHeight: `${window.screen.availHeight}px` }}>
        <div className={s.topArea}>
          <div className={s.topAreaMsg1}>
            <div>昨日收益（元）</div>
            <div>{productInfo.lastDayProfit || '-'}</div>
          </div>
          <div className={s.topAreaMsg2}>
            <div className={s.topAreaMsg2Item}>
              <div>持有总额（元）</div>
              <div>{productInfo.totalBalance || '-'}</div>
            </div>
            <div className={s.topAreaMsg2Item}>
              <div>累计收益（元）</div>
              <div>{productInfo.totalProfit || '-'}</div>
            </div>
          </div>
        </div>
        <WhiteSpace size="lg" />
        <div className={s.mainArea1}>
          <Flex>
            <Flex.Item>
              <div className={s.mainAreaItem}>
                <img width="30" src={Img1} alt="" />
                <div>1元起投</div>
                <div>低门槛</div>
              </div>
            </Flex.Item>
            <Flex.Item>
              <div className={s.mainAreaItem}>
                <img width="30" src={Img1} alt="" />
                <div>转出最快</div>
                <div>2分钟到账</div>
              </div>
            </Flex.Item>
            <Flex.Item>
              <div className={s.mainAreaItem}>
                <img width="30" src={Img1} alt="" />
                <div>大额购买</div>
                <div>定期理财</div>
              </div>
            </Flex.Item>
          </Flex>
        </div>
        <WhiteSpace size="lg" />
        <div className={s.mainArea2}>
          <Flex>
            <Flex.Item
              onClick={() => { this.setState({ curChart: 1 }, () => { this.renderCharts1(); }); }}
            >
              <div
                className={`${{ 1: s.tabTitleActive, 2: s.tabTitle }[this.state.curChart]}`}
              >七日年化</div>
            </Flex.Item>
            <Flex.Item
              onClick={() => { this.setState({ curChart: 2 }, () => { this.renderCharts2(); }); }}
            >
              <div
                className={`${{ 1: s.tabTitle, 2: s.tabTitleActive }[this.state.curChart]}`}
              >万份收益</div>
            </Flex.Item>
          </Flex>
          <p style={{ paddingLeft: '20px' }}>
            手指移至下方曲线图上，可查看{['七日年化(%)', '万份收益(元)'][this.state.curChart - 1]}
          </p>
          <div id="curProductDetailCharts" className={s.mainAreaItem} style={{ display: `${{ 2: 'none', 1: 'block' }[this.state.curChart]}` }}>{/* charts1 */}</div>
          <div id="curProductDetailCharts2" className={s.mainAreaItem} style={{ display: `${{ 1: 'none', 2: 'block' }[this.state.curChart]}` }}>{/* charts2 */}</div>
        </div>
        <WhiteSpace size="lg" />
        <div className={s.buttonWrap}>
          <Button
            className={s.buttonLeft}
            onClick={this.handleFinancialOut}
            disabled={this.state.channel === null}
          >转出</Button>
          <Button
            type="primary"
            className={s.buttonRight}
            onClick={this.handleFinancialIn}
            disabled={this.state.channel === null}
          >转入</Button>
        </div>
      </div >
    );
  }
}

export default CurProductDetail;
