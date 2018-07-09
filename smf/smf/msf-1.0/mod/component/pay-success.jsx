/**
 * author:shimin.chen;
 * time:2017/8/18;
 * description:支付成功页;
 */
var OrderList = require('./order-list');
module.exports = React.createClass({
    render: function () {
        var  erpSupport = this.props.erpSupport;
        if(erpSupport === "1") {
            return (
              <div>
                    <div className="pay-list">
                        <div className="pay-message">
                            <div className="tips">
                                <i></i>
                                <span>请将该页面展示给服务员</span>
                            </div>
                            <div className="pay-status">
                                <p>{this.props.orderMessage.tableNumber}</p>
                                <p>已完成支付</p>
                            </div>
                            <div className="pay-money">
                                <span>实付金额：{this.props.orderMessage.payMoney}元</span>
                            </div>
                        </div>
                        <div className="order-message">
                            <p className="store-name">{this.props.orderMessage.storeName}</p>
                            <ul>
                                <li className="item-message">
                                    <label className="order-label">订单编号：</label>
                                    <span className="order-input">{this.props.orderMessage.orderNumber}</span>
                                </li>
                                <li className="item-message">
                                    <label className="order-label">支付时间：</label>
                                    <span className="order-input">{this.props.orderMessage.payTime}</span>
                                </li>
                            </ul>
                        </div>
                        <OrderList  orderNum={this.props.orderNum} orderPrice={this.props.orderPrice} orderItems={this.props.orderItems}/>
                    </div>

                    <div className="bottom-logo">
                        <span>该订单支付服务由<i></i>提供</span>
                    </div>
              </div>
            )
        }else {
            return (
              <div>
                    <div className="pay-list">
                        <div className="pay-message">
                            <div className="tips">
                                <i></i>
                                <span>请将该页面展示给服务员</span>
                            </div>
                            <div className="pay-status">
                                <p>{this.props.orderMessage.tableNumber}</p>
                                <p>已完成支付</p>
                            </div>
                            <div className="pay-money">
                                <span>实付金额：{this.props.orderMessage.payMoney}元</span>
                            </div>
                        </div>
                        <div className="order-message">
                            <p className="store-name">{this.props.orderMessage.storeName}</p>
                            <ul>
                                <li className="item-message">
                                    <label className="order-label">订单编号：</label>
                                    <span className="order-input">{this.props.orderMessage.orderNumber}</span>
                                </li>
                                <li className="item-message">
                                    <label className="order-label">支付时间：</label>
                                    <span className="order-input">{this.props.orderMessage.payTime}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="bottom-logo">
                        <span>该订单支付服务由<i></i>提供</span>
                    </div>
              </div>
            )
        }
    }
})