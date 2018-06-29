import React from 'react';
import { Link } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import { inject, observer } from 'mobx-react';

import kqLogo from '../../../assets/img/author/ic_kuaiqian.png';
import style from './author-service.less';
import api from '../../../backend/api';
import utils from '../../../utils/util';
import h5t from '../../../utils/h5t';

@inject('AuthModel')
@observer
class Author extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bankName: '',
    };
  }
  componentDidMount() {
    h5t.track('pageview', { eventId: 'H5_financialmarket_p_authorService' });
    const queryObj = utils.GetQueryStringUrl(window.location.href);
    window.sessionStorage.setItem('FINANCIAL_AUTHOR_CHANNEL', queryObj.channel);
    window.sessionStorage.setItem('FINANCIAL_AUTHOR_ELECTRONBANKNAME', queryObj.bankName);
    this.props.AuthModel.setChannel(queryObj.channel);
    const _this = this;
    _this.setState({
      bankName: queryObj.bankName,
    });
  }
  authorFunc = () => {
    h5t.track('trackevent', { eventId: 'H5_financialmarket_confirmAuthor' });
    const channel = window.sessionStorage.getItem('FINANCIAL_AUTHOR_CHANNEL');
    const parameters = {
      channel,
    };
    const { history } = this.props;
    const queryObj = utils.GetQueryStringUrl(window.location.href);
    const backurl = queryObj.backurl;
    api.checkElectronicAccount(parameters).then((res) => {
      if (res.respCode === '00') {
        const accountInfoList = res.accountInfoList;
        if (accountInfoList.length === 0) {
          history.push('/pre-open');
          window.sessionStorage.setItem('FINANCIAL_AUTHOR_BACKURL', backurl);
        } else if (accountInfoList.length > 0) {
          history.push(backurl);
        }
      } else {
        Toast.fail(res.respMsg, 2);
      }
    }).catch((e) => {
      Toast.fail(e.respMsg, 2);
    });
  }
  render() {
    const { bankName } = this.state;
    return (
      <div className={style.container}>
        <div className={style.support}>
          <img src={kqLogo} alt="快钱logo" />
          <div>
            <p>该服务由{bankName}提供</p>
            <p>向其提供以下权限即可继续操作</p>
          </div>
        </div>
        <div className={style.info}>
        使用您的身份信息(姓名、身份证号、手机号、银行卡信息、身份证影像)办理业务
        </div>
        <div className={style.button} onClick={() => this.authorFunc()}>确认授权</div>
        <div className={style.confirm}>
        确认授权即表示同意<Link to="/author-agreement" className={style.agreement}>《用户授权协议》</Link>
        </div>
      </div>
    );
  }
}

export default Author;
