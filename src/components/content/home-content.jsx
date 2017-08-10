/**
 * author:zishuai.xu;
 * time:2017/8/1;
 * description: 菜单新增ui antd整合;
 */
import React,{ Component } from 'react'
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import {hashHistory} from 'react-router'
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

export default class HomeContent extends Component {

  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  }

 constructor () {
  super();
  this.state = {
    mainHeight: '',
    openKeys: []
  };
  this.handleOpenChange = this.handleOpenChange.bind(this);
  this.handleItemClick = this.handleItemClick.bind(this);
 }

 componentDidMount () {
  this.handleMainHeight();
  window.onresize = function () {
    this.handleMainHeight();
  }.bind(this);
  window.sessionStorage.setItem('mainHeight',this.state.mainHeight);
 }

 /**
  * [handleMainHeight 处理home-content页面的高度]
  */
 handleMainHeight () {
  let browserHeight = document.documentElement.clientHeight;
  this.setState({
    mainHeight: (browserHeight - 52) + 'px'
  })
 }

 /**
  * [handleOpenChange 处理侧边菜单的展开与折叠]
  */
 handleOpenChange (openKeys) {
  this.setState({
    openKeys: openKeys
  });
 }
/**
 * [handleItemClick 菜单项点击后路由进行跳转]
 */
 handleItemClick ({item,key,keypath}) {
  hashHistory.push({pathname: key});
 }

  render() {
    return (
      <Layout  className="main-content" style={{height: this.state.mainHeight,overflow: 'auto'}}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          style={{height: '100%'}}
        >
          <Menu style={{position: 'relative',zIndex: '999'}}  onClick={this.handleItemClick}  onOpenChange={this.handleOpenChange}   theme="dark" defaultSelectedKeys={['1']} mode="inline">
          {
            this.props.menuList.map((v,i) => {
              return (
                <SubMenu
                  key={`sub${i}`}
                  title={<span><Icon type={this.state.openKeys.indexOf(`sub${i}`) == -1?'plus':'minus'} /><span>{v.name}</span></span>}
                >
                  {
                    v.content.map((s,j) => {
                      return (
                        <Menu.Item key={s.menuUrl}>{s.name}</Menu.Item>
                      )
                    })
                  }
                </SubMenu>
              )
            })
          } 
          </Menu>
        </Sider>
        <Layout>
          <Content style={{height: '100%',overflow: 'auto'}}>
            {this.props.childrenLayout}
          </Content>
        </Layout>
      </Layout>
    );
  }
}