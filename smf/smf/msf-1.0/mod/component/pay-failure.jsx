/**
 * author:shimin.chen;
 * time:2017/8/18;
 * description:支付失败页;
 */
module.exports = React.createClass({
    render: function () {
        return (
          <div className="pay-failure">
                <span className="table-number">{this.props.orderMessage.tableNumber}</span>
                <div className="status-icon">
                    <i></i>
                </div>
                <div className="order-description">
                    <span className="order-status">订单支付失败</span>
                    <span className="order-tips">请返回重新扫码或联系服务员</span>
                    <span className="order-number">订单编号：{this.props.orderMessage.orderNumber}</span>
                </div>
                <div className="bottom-logo">
                    <span>该订单支付服务由<i></i>提供</span>
                </div>
          </div>
        )
    }
})