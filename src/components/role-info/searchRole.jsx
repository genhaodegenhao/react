/**
 * description:查询角色信息组件;
 */
import React, {Component} from 'react';
import $ from 'jquery';
import { Link } from 'react-router';
import PageComponent from '../page/pageComponent.jsx';
import '../../assets/Style/home/add-resource-inf.css';
import utils from '../../assets/js/common/common.js';

var SearchRole = React.createClass({
    /**
     * [getInitialState 初始化状态]
     */
    getInitialState: function() {
        return {
            loginToken:window.sessionStorage.getItem("loginToken"),
            roleName: '',
            totalNum:'',//总记录数
            pageNo:1,  //当前页
            pageSize:10, //每页显示的条数5条
            totalPage:'',//总页数
            girdSource:[], //json文件数据，后期从接口获取
        };
    },
    // 有实际请求使用ajax请求数据
    componentWillMount: function() {
        this.searchEvent();//初始化请求数据
    },
    componentWillUnmount: function(){
        clearTimeout(this.timer);
    },
    roleNameChange:function(event) {
        this.setState({roleName: event.target.value});
    },
    /**
     * [searchEvent 查询角色信息事件]
     */
    searchEvent:function(event) {
        var parmes = {
            "name":this.state.roleName,
            "pageNo": this.state.pageNo,
            "pageSize": this.state.pageSize
        };
        $.ajax({
            type: "GET",
            url: utils.baseUrl + '/intra/role/queryRoleInfo',
            data: parmes,
            dataType: 'json',
            headers: {
                'Authorization': this.state.loginToken
            },
            success: function(result) {
                //数据请求成功后将值放到state
                if (result.errCode == "00") {
                    this.timer = setTimeout(() => {
                        this.setState({girdSource:result.roleInfoList.elements});
                        this.setState({totalNum:result.pageBean.totalNum});
                        this.setState({totalPage:result.pageBean.totalPages});
                    },10);
                } else {
                    var msg = "处理结果："+result.errMsg;
                    var returnVal = window.confirm(msg);
                }
            }.bind(this),
            error: function(xhr, status, err) {
                // console.error(this.props.source, status, err.toString());
            }.bind(this)
        });
    },
    // 删除资源
    deleteEvent: function(e,role){
        var resId = e.target.getAttribute('data-id');
        var parmes = {
            "roleId": resId
        };
        $.ajax({
            type: "GET",
            url: utils.baseUrl + '/intra/role/deleteRoleInfo',
            data: parmes,
            dataType: 'json',
            headers: {
                'Authorization': this.state.loginToken
            },
            success: function(result) {
                if (result.errCode == "00") {
                    alert('删除成功');
                    this.searchEvent();
                } else {
                    var msg = "处理结果："+result.errMsg;
                    var returnVal = window.confirm(msg);
                }
            }.bind(this),
            error: function(xhr, status, err) {
                // console.error(this.props.source, status, err.toString());
            }.bind(this)
        });
    },
    //点击翻页
    pageClick:function(pageNum) {
        var _this = this;
        if(pageNum != this.state.pageNo){
            _this.setState({pageNo:pageNum});
        };
        setTimeout(function(){
            _this.searchEvent();
        },300);
    },
    //上一步
    goPrevClick:function(){
        var _this = this;
        let cur = this.state.pageNo;
        if(cur > 1){
            _this.pageClick( cur - 1);
        }
    },
    //下一步
    goNext:function(){
        var _this = this;
        let cur = _this.state.pageNo;
        //alert(cur+"==="+_this.state.totalPage)
        if(cur < _this.state.totalPage){
            _this.pageClick(cur + 1);
        }
    },
    render: function() {
        return (
            <div className="resource-inf-wrapper">
                <h3>查询角色信息</h3>
                <div className="user-message clearfix">
                    <div className="user-code fl">
                        <label>角色名称:</label>
                        <input type="text" value={this.state.roleName} onChange={this.roleNameChange} />
                    </div>
                    <div className="search-box fl">
                        <a href="javascript:void(null)" onClick={this.searchEvent}>查询</a>
                    </div>
                </div>
                <div className="user-table">
                    <table cellSpacing="0">
                        <thead>
                        <tr>
                            <th>角色id</th>
                            <th>角色名称</th>
                            <th>更新时间</th>
                            <th width="100">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.girdSource.map((item, rowIndex) => {
                                return (
                                    <tr key={rowIndex}>
                                        <td className="ell" title={item.roleId}>{item.roleId}</td>
                                        <td className="ell" title={item.name}>{item.name}</td>
                                        <td className="ell" title={utils.formatCSTDate(item.updateDate,"yyyy-M-d hh:mm:ss")}>{utils.formatCSTDate(item.updateDate,"yyyy-M-d hh:mm:ss")}</td>
                                        <td className="operating">
                                            <Link to={{pathname:"/html/modifyRoleInfo", state:{roleid:item.roleId,rolename:item.name}  }}><button className="btn-modify" data-id={item.roleId}>修改</button></Link>
                                            <button className="btn-delete" data-id={item.roleId} onClick={this.deleteEvent}>删除</button>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                        </tbody>
                    </table>
                    <PageComponent total={this.state.totalNum}
                                   current={this.state.pageNo}
                                   totalPage={this.state.totalPage}
                                   pageClick={this.pageClick}
                                   goPrev={this.goPrevClick}
                                   goNext={this.goNext}/>
                </div>
            </div>
        );
    }
});
export default SearchRole;