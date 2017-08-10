/**
 * description:修改角色信息组件;
 */
import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import utils from '../../assets/js/common/common.js';
import '../../assets/Style/home/add-resource-inf.css';

var ModifyRoleInfo = React.createClass({
    /**
     * [getInitialState 初始化状态]
     */
    getInitialState: function() {
        return {
            loginToken: window.sessionStorage.getItem('loginToken'),
            name: this.props.location.state.rolename,
            roleId: this.props.location.state.roleid,
            createDate: '',
            updateDate: '',
            roleSource: [],
            roleMenuList: [],
            roleMenuId: [],
            roleResId:[]
        };
    },
    // 有实际请求使用ajax请求数据
    componentWillMount: function() {
        this.searchEvent(); //初始化角色菜单数据
    },
    componentWillUnmount: function(){
        clearTimeout(this.timer);
    },

    /**
     * [roleNameChange 资源名称change事件]
     */
    roleNameChange:function(event) {
        this.setState({name: event.target.value});
    },
    createDateChange:function(event) {
        this.setState({createDate: event.target.value});
    },
    updateDateChange:function(event) {
        this.setState({updateDate: event.target.value});
    },
    /**
     * 角色菜单查询
     */
    searchEvent: function(){
        // 把点击后对应的角色ID的名称显示出来
        var parmes = {
            "roleId": this.state.roleId
        };
        $.ajax({
            type: "GET",
            url: utils.baseUrl + '/intra/role/toUpdateRoleInfo',
            data: parmes,
            dataType: 'json',
            headers: {
                'Authorization': this.state.loginToken
            },
            success: function(result) {
                if (result.errCode === "00") {
                    this.timer = setTimeout(() => {
                        this.setState({
                            "name": result.roleInfo.name,
                            "roleId": result.roleInfo.roleId,
                            "createDate": result.roleInfo.createDate,
                            "updateDate": result.roleInfo.updateDate
                        });
                        this.setState({
                            roleMenuList: result.menuInfo,
                            roleSource: result.resourceInfo
                        });
                        var rolemenuId = [];
                        var roleresId = [];
                        for (var i = 0; i < result.roleMenu.length; i++) {
                            rolemenuId.push(result.roleMenu[i].id);
                        }
                        ;
                        for (var i = 0; i < result.roleResource.length; i++) {
                            roleresId.push(result.roleResource[i].id);
                        }
                        ;
                        this.setState({
                            roleMenuId: rolemenuId,
                            roleResId: roleresId
                        });
                    },10);
                }else {
                    var msg = "处理结果："+result.errMsg;
                    var returnVal = window.confirm(msg);
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.source, status, err.toString());
            }.bind(this)
        });
    },
    /**
     * [submitEvent 修改提交]
     */
    submitEventMenu:function(event) {
        var parmes = {
            "name": this.state.name,
            "roleId": this.state.roleId,
            "createDate": this.state.createDate,
            "updateDate": this.state.updateDate
        };
        $.ajax({
            type: "GET",
            url: utils.baseUrl + '/intra/role/updateRoleInfo',
            data: parmes,
            dataType: 'json',
            headers: {
                'Authorization': this.state.loginToken
            },
            success: function(result) {
                if (result.errCode == "00") {
                    alert("修改"+result.errMsg);
                }else {
                    var msg = "处理结果："+result.errMsg;
                    var returnVal = window.confirm(msg);
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.source, status, err.toString());
            }.bind(this)
        });
    },
    /**
     * deleteEventMenu 删除角色菜单
     */
    deleteEventMenu: function(event){
        var resId = event.target.getAttribute('data-menuid');
        var parmes = {
            "id": resId
        };
        $.ajax({
            type: "GET",
            url: utils.baseUrl + '/intra/role/deleteRoleMenu',
            data: parmes,
            dataType: 'json',
            headers: {
                'Authorization': this.state.loginToken
            },
            success: function(result) {
                if (result.errCode == "00") {
                    alert('删除成功');
                    this.searchEvent(); //重新渲染页面
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
    /**
     * deleteEventRes 删除角色资源
     */
    deleteEventRes: function(event){
        var resId = event.target.getAttribute('data-resid');
        var parmes = {
            "id": resId
        };
        $.ajax({
            type: "GET",
            url: utils.baseUrl + '/intra/role/deleteRoleResource',
            data: parmes,
            dataType: 'json',
            headers: {
                'Authorization': this.state.loginToken
            },
            success: function(result) {
                if (result.errCode == "00") {
                    alert('删除成功');
                    this.searchEvent(); //重新渲染页面
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
    render: function() {
        return (
            <div className="resource-inf-wrapper">
                <h3>修改角色信息</h3>
                <div className="resource-inf-form">
                    <div className="resource-name">
                        <label>
                            <span style={{color: 'red'}}>*</span>角色名称:
                        </label>
                        <input type="text" value={this.state.name} onChange={this.roleNameChange} />
                    </div>
                </div>
                <div className="btn-box">
                    <a href="javascript:void(null)" onClick={this.submitEventMenu}>提交</a>
                </div>
                <div className="role-menu">
                    <p>角色菜单</p>
                    <Link to={{pathname:"/html/addRoleMenu", state:{idData:this.props.location.state.roleid,nameData:this.props.location.state.rolename}}}><input className="btn-role-menu" type="button" value="角色菜单"/></Link>
                    <div className="user-table">
                        <table cellSpacing="0">
                            <thead>
                            <tr>
                                <th>角色id</th>
                                <th>角色名称</th>
                                <th>菜单id</th>
                                <th>菜单名称</th>
                                <th>更新时间</th>
                                <th width="100">操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.roleMenuList.map((item, rowIndex) => {
                                    return (
                                        <tr key={rowIndex}>
                                            <td className="ell" title={this.state.roleId}>{this.state.roleId}</td>
                                            <td className="ell" title={this.state.name}>{this.state.name}</td>
                                            <td className="ell" title={item.menuId}>{item.menuId}</td>
                                            <td className="ell" title={item.name}>{item.name}</td>
                                            <td className="ell" title={utils.formatCSTDate(item.updateDate,"yyyy-M-d hh:mm:ss")}>{utils.formatCSTDate(item.updateDate,"yyyy-M-d hh:mm:ss")}</td>
                                            <td className="operating">
                                                <button className="btn-delete" data-menuid={this.state.roleMenuId[rowIndex]} onClick={this.deleteEventMenu}>删除</button>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="role-menu">
                    <p>角色资源</p>
                    <Link to={{pathname:"/html/addRoleResource", state:{idData:this.props.location.state.roleid,nameData:this.props.location.state.rolename}}}><input className="btn-role-menu" type="button" value="角色资源"/></Link>
                    <div className="user-table">
                        <table cellSpacing="0">
                            <thead>
                            <tr>
                                <th>角色id</th>
                                <th>角色名称</th>
                                <th>菜单id</th>
                                <th>菜单名称</th>
                                <th>更新时间</th>
                                <th width="100">操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.roleSource.map((item, rowIndex) => {
                                    return (
                                        <tr key={rowIndex}>
                                            <td className="ell" title={this.state.roleId}>{this.state.roleId}</td>
                                            <td className="ell" title={this.state.name}>{this.state.name}</td>
                                            <td className="ell" title={item.resourceId}>{item.resourceId}</td>
                                            <td className="ell" title={item.name}>{item.name}</td>
                                            <td className="ell" title={utils.formatCSTDate(item.updateDate,"yyyy-M-d hh:mm:ss")}>{utils.formatCSTDate(item.updateDate,"yyyy-M-d hh:mm:ss")}</td>
                                            <td className="operating">
                                                <button className="btn-delete" data-resid={this.state.roleResId[rowIndex]} onClick={this.deleteEventRes}>删除</button>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
});

export default ModifyRoleInfo;