/**
 * description:新增角色信息组件;
 */
import React from 'react';
import $ from 'jquery';
import '../../assets/Style/home/add-resource-inf.css';
import utils from '../../assets/js/common/common.js';

var AddRoleInfo = React.createClass({
    /**
     * [getInitialState 初始化状态]
     */
    getInitialState: function() {
        return {
            loginToken: window.sessionStorage.getItem('loginToken'),
            roleName:'',
        };
    },
    /**
     * [roleNameChange 资源名称change事件]
     */
    roleNameChange:function(event) {
        this.setState({roleName: event.target.value});
    },
    /**
     * [submitEvent 提交事件]
     */
    submitEvent:function(event) {
        var parmes = {
            'name': this.state.roleName
        };
        if(parmes.name === '') {
            alert('请输入角色名称');
            return;
        };
        if(!this.state.mockdata){
            $.ajax({
                type: 'get',
                url: utils.baseUrl + '/intra/role/addRoleInfo',
                data: parmes,
                dataType: 'json',
                headers: {
                    'Authorization': this.state.loginToken
                },
                success: function(result) {
                    if (result.errCode == "00") {
                        alert("提交" + result.errMsg);
                    } else {
                        var msg = "处理结果："+result.errMsg;
                        var returnVal = window.confirm(msg);
                    }
                },
                error: function(xhr, status, err) {
                    console.error(this.props.source, status, err.toString());
                }
            });
        } else {
            var successData = require('../../json/success.json');
            if(successData.flag) {
                alert('提交成功！');
                // 提交成功值清空
                this.setState({roleName:''});
            }
        }
    },
    render: function() {
        return (
            <div className="resource-inf-wrapper">
                <h3>新新增角色信息</h3>
                <div className="resource-inf-form">
                    <div className="resource-name">
                        <label>
                            <span style={{color: 'red'}}>*</span>角色名称:
                        </label>
                        <input type="text" value={this.state.roleName} onChange={this.roleNameChange} />
                    </div>
                </div>
                <div className="btn-box">
                    <a href="javascript:void(null)" onClick={this.submitEvent}>提交</a>
                </div>
            </div>
        );
    }
});

export default AddRoleInfo;