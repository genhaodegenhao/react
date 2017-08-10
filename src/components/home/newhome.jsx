import React, { Component } from 'react';
import $ from 'jquery';
import { Layout } from 'antd';
import NewHeader from '../header/newHeader';
import SiderNav from '../sider/siderNav';
import NewContent from '../content/content';
import NewFooter from '../footer/footer';
import utils from '../../assets/js/common/common.js';
import '../../assets/Style/home/header.css';

const { Header, Footer, Sider, Content } = Layout;

// 当你在React class中需要设置state的初始值或者绑定事件时,需要加上constructor(){}

class NewHome extends Component {

    constructor (props) {
        super(props);
        this.state = {
            loginToken: window.sessionStorage.getItem('loginToken'),
            menuList: []
        }
    }

    render() {
        return (
            <div className="wrapper">
                <Layout>
                    <Header><NewHeader/></Header>
                    <Layout>
                        <Sider><SiderNav/></Sider>
                        <Content><NewContent/></Content>
                    </Layout>
                    <Footer><NewFooter/></Footer>
                </Layout>
            </div>
        );
    }
}

export default NewHome;