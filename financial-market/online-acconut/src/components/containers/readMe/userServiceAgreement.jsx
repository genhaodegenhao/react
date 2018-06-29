import React from 'react';
import { ActivityIndicator } from 'antd-mobile';

class UserServiceAgreement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowLoading: true,
    };
  }
  componentDidMount() {
    const _this = this;
    _this.setState({
      isShowLoading: false,
    });
  }
  render() {
    const { isShowLoading } = this.state;
    return (
      <div style={{ position: 'absolute', left: '0', right: '0', top: '0', bottom: '0' }}>
        {
          isShowLoading
            ? <ActivityIndicator />
            : <iframe
              title="快钱支付账户用户服务协议"
              frameBorder="0"
              height="100%"
              width="100%"
              src="https://www.99bill.com/seashell/html/agreement/paymentServiceAgreement-h5.html"
            >{/* eslint占位符 */}
            </iframe>
        }
      </div>
    );
  }
}

export default UserServiceAgreement;
