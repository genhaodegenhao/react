/**
 * author:shimin.chen;
 * time:2017/8/18;
 * description:支付结果页;
 */
var util = require('../common/util'),
    ajax = require('../common/ajax'),
    api = require('../common/api'),
    PaySucess = require('../component/pay-success'),
    PayFailure = require('../component/pay-failure'),
    PayOutTime = require('../component/pay-out-time');
module.exports = React.createClass({
    /**
     * [getInitialState 初始化状态]
     */
    getInitialState: function () {
        return {
            payStatus:'success', //支付状态
            orderMessage:{
                tableNumber: '', //桌号
                payMoney:'', //实付金额
                storeName:'',//店名
                orderNumber:'',//订单编号
                payTime:'',//支付时间
            },
            orderNumber:'1111',
            orderList:[],//erp订单列表
            orderNum:0,//erp订单数量
            orderPrice:0,//erp订单金额
            erpSupport:"0",//是否支持erp
        }
    },
    
    componentDidMount:function(e) {
        var codeStatus = localStorage.getItem('codeStatus');

        var businessInformation = JSON.parse(sessionStorage.getItem('businessInformation')); 
        this.setState({erpSupport:businessInformation.erpSupport}); //是否支持erp
        var params = {
            appId:'coc-bill-api',
            requestTime:util.getNowFormatDate(),
            traceId:util.generateUUID(),
            appType:localStorage.getItem('appType'),
            merchantId:businessInformation.merchantId,
            terminalId:businessInformation.terminalId,
            externalTraceNo:localStorage.getItem('externalTraceNo'),
            bizType: parseInt(businessInformation.bizType),
        },
        _this = this,
        option = {
            url:api.apiUrl.orderQuery,
            data:params,
            callback:function(data) {
                if(data.rspCode === '0000') {
                    var orderMessage = {
                        tableNumber: '', //桌号
                        payMoney:data.amt, //实付金额
                        storeName:data.branchName || data.merchantName,//店名
                        orderNumber:data.idBiz,//订单编号
                        payTime:data.txnTime,//支付时间
                    };
                    if(data.unitInfo != '') {
                        let zhuohao = JSON.parse(data.unitInfo).unitNo;
                        if(zhuohao == undefined) {
                          orderMessage.tableNumber = JSON.parse(data.unitInfo).unitName; //桌号
                        } else {
                          orderMessage.tableNumber = JSON.parse(data.unitInfo).unitNo+JSON.parse(data.unitInfo).unitName; //桌号
                        }
                    }
                    if(_this.state.erpSupport === '1') { //erp信息有
                        if(data.erpInfo != '') { 
                            _this.setState({orderNum:JSON.parse(data.erpInfo).totalItem}); //erp订单数量
                            _this.setState({orderPrice:JSON.parse(data.erpInfo).totalAmt});//erp订单金额
                            _this.setState({orderList:JSON.parse(data.erpInfo).items});//erp订单列表
                        }
                    }
                    if(codeStatus == 0) { //支付成功
                        _this.setState({payStatus:'success'});
                    }else if(codeStatus == -1){ //支付失败
                        _this.setState({payStatus:'failure'});
                    }else {//支付超时
                        _this.setState({payStatus:'outTime'});
                    }
                    _this.setState({orderMessage:orderMessage}); //订单信息
                }else if(data.rspCode === '2000') {
                    app.alert(data.rspMsg);
                }
            }.bind(this)
        }
        ajax.post(option);
        var storeName = businessInformation.branchName || businessInformation.merchantName;
        this.setState({storeName:storeName}); //店名称
    },
    /**
     * [getContent 获取内容]
     * @return {[html]} [展示内容]
     */
    getContent:function() {
        if(this.state.payStatus === 'success') {
            return (
                <PaySucess orderMessage={this.state.orderMessage} orderNum={this.state.orderNum} orderPrice={this.state.orderPrice} orderItems={this.state.orderList} erpSupport={this.state.erpSupport}/>
            )
        }else if(this.state.payStatus === 'failure') {
            return (
                <PayFailure orderMessage={this.state.orderMessage} />
            )
        }else if(this.state.payStatus === 'outTime') {
            return (
                <PayOutTime orderMessage={this.state.orderMessage} />
            )
        }
    },
    render: function () {
        return ( 
        <div className="page-content"  data-title={this.state.storeName}>
            {this.getContent()}
        </div>
        )
    }
})