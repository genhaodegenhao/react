/**
 * 添加了confirm判断事件
 */
/**
 * description: 新增角色菜单信息组件;
 */
import React from 'react';
import $ from 'jquery';
import utils from '../../assets/js/common/common.js';
import '../../assets/Style/home/add-resource-inf.css';

var addRoleMenu = React.createClass({
    /**
     * [getInitialState 初始化状态]
     */
    getInitialState: function() {
        return {
            loginToken:window.sessionStorage.getItem("loginToken"),
            roleName: this.props.location.state.nameData,
            roleId: this.props.location.state.idData,
            menuInfoAllList: [], //json文件数据，后期从接口获取
        };
    },
    // 有实际请求使用ajax请求数据
    componentDidMount: function() {
        var parmes = {
            "roleId": this.state.roleId,
            "roleName": this.state.roleName
        };
        $.ajax({
            type: "GET",
            url: utils.baseUrl + '/intra/role/toAddRoleMenu',
            data: parmes,
            dataType: 'json',
            headers: {
                'Authorization': this.state.loginToken
            },
            success: function(result) {
                if (result.errCode == "00") {
                    this.setState({
                        menuInfoAllList: result.menuInfo
                    })
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
     * [submitEvent 查询事件]
     */
    submitEvent: function(event){
        var bool = window.confirm("确定要选中这些菜单吗?");
        if(bool){
            var arr=document.getElementsByName("menu");
            var menuidArr = [];
            for(var i=0;i<arr.length;i++){
                if(arr[i].checked){
                    menuidArr.push(arr[i].value);
                }
            }
            var menuidStr = menuidArr.toString();
            var parmes = {
                "ids": menuidStr,
                "roleId": this.state.roleId,
            };
            if(parmes.ids === ""){
                alert("新增菜单不能为空");
                return;
            }else{
                $.ajax({
                    type: "GET",
                    url: utils.baseUrl + '/intra/role/addRoleMenu',
                    data: parmes,
                    dataType: 'json',
                    headers: {
                        'Authorization': this.state.loginToken
                    },
                    success: function(result) {
                        if (result.errCode == "00") {
                            alert("添加"+result.errMsg);
                        } else {
                            var msg = "处理结果："+result.errMsg;
                            var returnVal = window.confirm(msg);
                        }
                    }.bind(this),
                    error: function(xhr, status, err) {
                        // console.error(this.props.source, status, err.toString());
                    }.bind(this)
                });
            }
        }
    },
    render: function() {
        return (
            <div className="resource-inf-wrapper">
                <h3>新增角色菜单</h3>
                <div className="user-table fontWeight">
                    <span style={{color: 'red'}}>*</span>角色id:
                    <input type="text" disabled value={this.state.roleId} />
                    <span style={{color: 'red',marginLeft:'15px'}}>*</span>角色名称:
                    <input type="text" disabled value={this.state.roleName} />
                </div>
                <div className="user-table fontWeight">
                    <span style={{color: 'red'}}>*</span>请选择:
                    <table cellSpacing="0">
                        <thead>
                        <tr>
                            <th><input className="checkAll" onClick={utils.toggleSelect} type="checkbox"/>全选</th>
                            <th>菜单id</th>
                            <th>菜单名称</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.menuInfoAllList.map((item, rowIndex) => {
                                return (
                                    <tr key={rowIndex}>
                                        <td className="ell"><input type="checkbox" name="menu" value={item.menuId} /></td>
                                        <td className="ell" title={item.menuId}>{item.menuId}</td>
                                        <td className="ell" title={item.name}>{item.name}</td>
                                    </tr>
                                );
                            })
                        }
                        </tbody>
                    </table>
                    <button onClick={this.submitEvent} className="btn-addrole">提交</button>
                </div>
            </div>
        );
    }
});

export default addRoleMenu;