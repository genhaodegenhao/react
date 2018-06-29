import React from 'react';
import {
  Flex,
  Carousel,
  WhiteSpace,
} from 'antd-mobile';
import { inject, observer } from 'mobx-react';
import s from './home.less';
import Icon1 from './img/fhome_paycode.png';
import Icon2 from './img/fhome_bank.png';
import Icon3 from './img/fhome_financial.png';
import Icon4 from './img/fhome_detail.png';
import { setUrlParams } from '../../../utils/toolFunc';
import h5t from '../../../utils/h5t';

@inject('HomeModel')
@observer
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 1,
    };
  }

  componentDidMount() {
    h5t.track('pageview', { eventId: 'H5_financialmarket_p_home' });
    this.props.HomeModel.updatePrdCurList();
    this.props.HomeModel.updatePrdFixedList();
    this.props.HomeModel.updateBannerInfo();
  }

  handleGoDetail = (item) => {
    const params = {
      prdCode: item.productCode,
      prdName: item.productName,
      channel: item.bankId,
      bankName: item.bankName,
    };
    if (item.productType === '1') {
      h5t.track('trackevent', { eventId: 'H5_financialmarket_homeFixedprddetail' });
      this.props.history.push(`/fixedproduct-detail${setUrlParams(params)}`);
    } else {
      h5t.track('trackevent', { eventId: 'H5_financialmarket_homeCurdprddetail' });
      this.props.history.push(`/currentproduct-detail${setUrlParams(params)}`);
    }
  }

  render() {
    return (
      <div className={s.wrap}>
        <div className={s.tool}>
          <Flex>
            <Flex.Item>
              <div
                className={s.toolTtem}
                onClick={() => {
                  h5t.track('trackevent', { eventId: 'H5_financialmarket_homeAccountlist' });
                  this.props.history.push('/account-list');
                }}
              >
                <img src={Icon1} alt="电子账户" />
                <p>电子账户</p>
              </div>
            </Flex.Item>
            <Flex.Item>
              <div className={s.toolTtem}>
                <img src={Icon2} alt="银行卡" />
                <p>银行卡</p>
              </div>
            </Flex.Item>
            <Flex.Item>
              <div
                className={s.toolTtem}
                onClick={() => {
                  h5t.track('trackevent', { eventId: 'H5_financialmarket_homeInvestpage' });
                  this.props.history.push('/invest-page?channel=0');
                }}
              >
                <img src={Icon3} alt="我的理财" />
                <p>我的理财</p>
              </div>
            </Flex.Item>
            <Flex.Item>
              <div className={s.toolTtem}>
                <img src={Icon4} alt="交易明细" />
                <p>交易明细</p>
              </div>
            </Flex.Item>
          </Flex>
        </div>
        <div className={s.carousel}>
          <Carousel
            autoplay={false}
            infinite
            selectedIndex={this.state.slideIndex}
            beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
            afterChange={index => console.log('slide to', index)}
          >
            {
              this.props.HomeModel.bannerInfo.map((item) => {
                return (
                  <div className={s.carouselItem}>
                    <a href={item.jumpTarget}>
                      {/* <img height="100%" src={item.resUrl} alt={item.resName} /> */}
                      <div
                        style={{
                          width: '100%',
                          height: '100px',
                          background: `url(${item.resUrl})  no-repeat center center`,
                          backgroundSize: '100%',
                        }}
                      >
                        {/*  */}
                      </div>
                    </a>
                  </div>
                );
              })
            }
          </Carousel>
        </div>
        <WhiteSpace />
        <div className={s.product}>
          <div className={s.prdType}>灵活期限</div>
          <ul className={s.prdMain}>
            {
              this.props.HomeModel.prdCurList.map((item) => {
                return (
                  <li>
                    <div onClick={() => { this.handleGoDetail(item); }}>
                      <div className={s.prdTitle}>{item.bankName} | {item.productName}</div>
                      <WhiteSpace />
                      <Flex>
                        <Flex.Item>
                          <div className={s.prdItemPerWrap}>
                            <div className={s.prdItemPer}>
                              {item.profitRate.split('%')[0]}
                              <span className={s.prdItemPer2}>%</span>
                            </div>
                            <div className={s.prdItemPerDesc}>
                              {item.profitRateDescription}
                            </div>
                          </div>
                        </Flex.Item>
                        <Flex.Item>
                          <div className={s.prdItemSloganWrap}>
                            <div className={s.prdItemSlogan}>{item.productDescription}</div>
                            <div className={s.prdItemSloganDesc}>{item.investAmtFrom}起投</div>
                          </div>
                        </Flex.Item>
                      </Flex>
                    </div>
                  </li>
                );
              })
            }
          </ul>
        </div>
        <WhiteSpace />
        <div className={s.product}>
          <div className={s.prdType}>固定期限</div>
          <ul className={s.prdMain}>
            {
              this.props.HomeModel.prdFixedList.map((item) => {
                return (
                  <li>
                    <div onClick={() => { this.handleGoDetail(item); }}>
                      <div className={s.prdTitle}>{item.bankName} | {item.productName}</div>
                      <WhiteSpace />
                      <Flex>
                        <Flex.Item>
                          <div className={s.prdItemPerWrap}>
                            <div className={s.prdItemPer}>
                              {item.profitRate.split('%')[0]}
                              <span className={s.prdItemPer2}>%</span>
                            </div>
                            <div className={s.prdItemPerDesc}>
                              {item.profitRateDescription}
                            </div>
                          </div>
                        </Flex.Item>
                        <Flex.Item>
                          <div className={s.prdItemSlogan}>{item.productDescription}</div>
                          <div className={s.prdItemSloganDesc}>{item.investAmtFrom}起投</div>
                        </Flex.Item>
                      </Flex>
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

export default Home;
