/**
 * description: 新增角色菜单信息组件;
 */
import React from 'react';
import $ from 'jquery';
import utils from '../../assets/js/common/common.js';
import '../../assets/Style/home/add-resource-inf.css';

var addRoleResource = React.createClass({
    /**
     * [getInitialState 初始化状态]
     */
    getInitialState: function() {
        return {
            loginToken:window.sessionStorage.getItem("loginToken"),
            roleName: this.props.location.state.nameData,
            roleId: this.props.location.state.idData,
            resInfoAllList: [], //json文件数据，后期从接口获取
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
            url: utils.baseUrl + '/intra/role/toAddRoleResource',
            data: parmes,
            dataType: 'json',
            headers: {
                'Authorization': this.state.loginToken
            },
            success: function(result) {
                if (result.errCode == "00") {
                    this.setState({
                        resInfoAllList: result.resourceInfo
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
        var arr=document.getElementsByName("resource");
        var residArr = [];
        for(var i=0;i<arr.length;i++){
            if(arr[i].checked){
                residArr.push(arr[i].value);
            }
        }
        var residStr = residArr.toString();
        var parmes = {
            "ids": residStr,
            "roleId": this.state.roleId,
        };
        if(parmes.ids === ""){
            alert("新增资源不能为空");
            return;
        }else{
            $.ajax({
                type: "GET",
                url: utils.baseUrl + '/intra/role/addRoleResource',
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
    },
    render: function() {
        return (
            <div className="resource-inf-wrapper">
                <h3>新增角色资源</h3>
                <div className="user-table">
                    <span style={{color: 'red'}}>*</span>角色id:
                    <input type="text" disabled value={this.state.roleId} />
                    <span style={{color: 'red',marginLeft:'15px'}}>*</span>角色名称:
                    <input type="text" disabled value={this.state.roleName} />
                </div>
                <div className="user-table">
                    <span style={{color: 'red'}}>*</span>请选择:
                    <table cellSpacing="0">
                        <thead>
                        <tr>
                            <th><input className="checkAll" onClick={utils.toggleSelect} type="checkbox"/>全选</th>
                            <th>资源id</th>
                            <th>资源名称</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.resInfoAllList.map((item, rowIndex) => {
                                return (
                                    <tr key={rowIndex}>
                                        <td className="ell"><input type="checkbox" name="resource" value={item.resourceId}/></td>
                                        <td className="ell" title={item.resourceId}>{item.resourceId}</td>
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

export default addRoleResource;