/**
 * Created by song.wang.wb on 2017/7/14.
 */
import React from 'react';
import { hashHistory } from 'react-router';
import $ from 'jquery';
import '../../assets/Style/login/login.css';
import logo from '../../assets/Images/logo.gif';
import utils from '../../assets/js/common/common.js';

const Login = React.createClass({
    getInitialState: function(){
        return {
            userCode: "",
            password: "",
        };
    },
    changeUsername: function(e) {
        this.setState({
            userCode: e.target.value
        })
    },
    changePassword: function(e){
      this.setState({
          password: e.target.value
      })
    },
    handleSubmit: function(){
        if(this.state.userCode === "" || this.state.password === ""){
            alert('输入用户名或密码');
            return;
        }else if(this.state.userCode.trim().length === 0 || this.state.password.trim().length === 0){
            alert('用户名和密码不能为空');
            return;
        }
        $.ajax({
            type: 'POST',
            url: utils.baseUrl + '/intra/login/loginToken',
            data : JSON.stringify({
                "userCode" : this.state.userCode,
                "password" : this.state.password,
            }),
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            success : function(result) {
                alert("登录"+result.errMsg);
                if (result.errCode === "00") {
                    window.sessionStorage.setItem("loginToken",result.loginToken);
                    window.sessionStorage.setItem("userName",result.userInfo.name);
                    hashHistory.push('/newHome');
                } else {
                    $(".error-des").text(result.exceptionDesc);
                }
            },
            error : function(jqXHR, textStatus, errorThrown) {
                $(".error-des").text("请求出错");
            }
        });
    },
    render() {
        return (
            <div className="loginBg">
                <div className="login">
                    <div className="login-header">
                        欢迎来到运维系统！
                    </div>
                    <div className="login-content">
                        <div className="kq-logo"><img src={logo} className="login-logo" alt="logo"/></div>
                        <div className="login-form">
                            <input value={this.state.userCode} onChange={this.changeUsername} id="userCode" placeholder="账号" type="text" autoComplete="off"/><br/>
                            <input name="loginPassword" value={this.state.password} onChange={this.changePassword} id="password" placeholder="密码" type="password"/><br/>
                            <input onClick={this.handleSubmit} type="button" id="login-btn" value="登录"/>
                        </div>
                    </div>
                    <div className="login-footer">
                        <p>
                            <a href="">关于快钱</a>|
                            <a href="">新闻中心</a>|
                            <a href="">合作伙伴</a>|
                            <a href="">联系快钱</a>|
                            <a href="">诚聘英才</a>|
                            <a href="">网站地图</a>|
                        </p>
                        <p>快钱版权所有2004-2015</p>
                    </div>
                </div>
            </div>
        );
    }
});
export default Login;
