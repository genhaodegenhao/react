/**
 * author:shimin.chen;
 * time:2017/8/18;
 * description:支付超时页;
 */
module.exports = React.createClass({
    render: function () {
        return (
          <div className="pay-failure pay-out-time">
                <span className="table-number">{this.props.orderMessage.tableNumber}</span>
                <div className="status-icon">
                    <i></i>
                </div>
                <div className="order-description">
                    <span className="order-status">交易超时</span>
                    <span className="order-tips">请联系服务员交易是否成功</span>
                    <span className="order-number">订单编号：{this.props.orderMessage.orderNumber}</span>
                </div>
                <div className="bottom-logo">
                    该订单支付服务由<i></i>提供
                </div>
          </div>
        )
    }
})