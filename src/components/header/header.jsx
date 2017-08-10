/**
 * author:shimin.chen.wb;
 * time:2017/7/17;
 * description:头部组件;
 */

import React, {Component} from 'react';
import $ from 'jquery';
import { hashHistory } from 'react-router';
import userPic from '../../assets/Images/1.png';
import '../../assets/Style/home/header.css';
// let  json= require('file.json');

var header = React.createClass({
    getInitialState: function() {
        return {
            userName:window.sessionStorage.getItem('userName'),
            userPic:userPic,
            isShow:true,
            mockdata:false  //是否使用mock数据
        };
    },
    /**
     * [handleClick 点击切换]
     */
    handleClick:function() {
        this.setState(function(state) {
            return {isShow: !state.isShow};
        });
    },
    /**
     * [exit 退出]
     */
    exit:function() {
        hashHistory.push('/');
    },
    render: function() {
        var isHide;
        if(this.state.isShow) {
            isHide = 'hide';
        }else {
            isHide = 'show';
        }
        return ( 
            <div className="top-bar clearfix">
                <p className="fl">INTRA 运维平台</p> 
                <div className="user-massge fr" onClick={this.handleClick}>
                    <img src={this.state.userPic} /> 
                    <span className="ell"  title={this.state.userName}>{this.state.userName}</span> 
                    <ul className ={isHide}>
                        <a className="exit" href="javascript:void(0)">修改密码</a>
                        <a className="exit" href="javascript:void(0)" onClick={this.exit}>注销退出</a>
                    </ul> 
                </div>
                {/*<input className = "fr" type = "text" placeholder = "search" / >*/}
            </div> 
        );
    }
});


export default header;