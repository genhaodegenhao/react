/**
 * author:zishuai.xu;
 * time:2017/8/1;
 * description:菜单ui antd整合;
 */

import React, { Component } from 'react';
import '../../assets/Style/home/header.css';
import Header from '../header/header';
import Content from '../content/home-content'
import $ from 'jquery';
import utils from '../../assets/js/common/common.js';

class Home extends Component {

    constructor () {
        super();
        this.state = {
            loginToken: window.sessionStorage.getItem('loginToken'),
            menuList: []
        }
    }
    /**
     * [handelData 获取菜单信息]
     */
    handelData (data) {
        var result = [];
        for(var i=0;i<data.length;i++) {
            if(data[i].parentId === null) {
                var obj = data[i];
                obj.content = [];
                result.push(obj);
            }
        }
        for(var i=0;i<result.length;i++) {
            for(var j=0;j<data.length;j++) {
                if(result[i].menuId === data[j].parentId) {
                    result[i].content.push(data[j]);
                }
            }
        }
        return result;
    }

    componentDidMount () {
        let _this = this;
        $.ajax({
            type:'post',
            url: utils.baseUrl + '/intra/login/menuInfo',
            headers: {
                   'Authorization': _this.state.loginToken
            },
            data:JSON.stringify({}),
            dataType: 'json',
            success: function(data) {
                if(data.errCode === '00') {
                    var result = _this.handelData(data.menuInfoList)
                   
                    _this.setState({menuList:result});
                }
            },
            error: function(xhr, status, err) {
                console.error(_this.props.source, status, err.toString());
            }
        });
    }

    render() {
        return (
            <div className="wrapper">
                <Header />
                <Content menuList={this.state.menuList} childrenLayout={this.props.children}/>   
            </div> 
        );
      }
    }
    export default Home;