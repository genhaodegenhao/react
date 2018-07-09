/**
 * author:shimin.chen;
 * time:2017/8/18;
 * description:订单列表组件;
 */
var ajax = require('../common/ajax');
module.exports = React.createClass({
    getInitialState: function () {
        return {
            isHide: true
        }
    },

    getDefaultProps: function () {
        return {
            orderNum: 12,
            orderPrice: 219.50,
            orderItems: [],
        }
    },
    handleClickMenu (e) {
        var _this = this;
        _this.setState({
            isHide: !this.state.isHide
        })
        setTimeout(function(){
            _this.calculateHeight();
        }, 0);
    },
    /**
     * [calculateHeight 动态计算高度,改变css]
     */
    calculateHeight:function() {
        var currentHeight = $$(window).height(),
            payListHeight = $$('.pay-list').height(),
            offHeight = currentHeight - 71;
        if(payListHeight > offHeight) {
            $$('.bottom-logo').css('position','relative');
        }else {
            $$('.bottom-logo').css('position','absolute');
        }
    },
    /**
     * [getContent 获取列表]
     */
    getContent:function() {
        var openList = this.props.orderItems.map((v,i) => {
                return (
                  <li className="menu-list-item">
                    <span className="menu-list-item-name">{v.name}</span>
                    <span className="menu-list-item-num">x{v.count}</span>
                    <span className="menu-list-item-sum">￥{(parseFloat(v.amt) * parseFloat(v.count)).toFixed(2)}</span>
                  </li>
                )
            });
        if(!this.state.isHide) {
            return (
                <ul className="menu-list-items">
                    {openList}
                </ul>
            )
        }else {
            return (
                <div></div>
            )
        }
    },
    render: function () {
        return (
          <div className="order-list">
            <p className="menu-list-title">共{this.props.orderNum}份, 合计{this.props.orderPrice}元</p>
            {this.getContent()}
            <div className="menu-list-bottom" onClick={() => this.handleClickMenu()}>
                <a>
                    <img className="menu-list-bottomBar" title="" src={this.state.isHide?__uri('../msf-1.0/res/images/Shape_up@2x.png?__inline'):__uri('../msf-1.0/res/images/Shape1@2x.png?__inline')}/>
                    <span>{this.state.isHide?'展开更多':'收起更多'}</span>
                </a>
            </div>
          </div>
        )
    }
})
