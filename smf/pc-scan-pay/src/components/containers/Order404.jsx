import React, { Component } from 'react';
import ImgError from '../../assets/img/baodan/Group@2x.png';
import setTitle from '../../backend/setTitle';

/* eslint-disable no-undef */
export default class Order404 extends Component {
  componentDidMount() {
    setTitle('订单失效');
    window.history.pushState(null, 'title', '404');
    window.addEventListener('popstate', () => {
      if (window.sessionStorage.getItem('userAgent') === 'ALIPAY') {
        AlipayJSBridge.call('popWindow');
      } else if (window.sessionStorage.getItem('userAgent') === 'WX') {
        wx.closeWindow();
      } else {
        window.app.alert('pc端浏览器回退！');
      }
    });
  }

  render() {
    return (
      <div className="imgErrorWrapper">
        <img className="imgIcon" src={ImgError} alt="404" />
        <p>二维码已过期，请刷新二维码重试</p>
      </div>
    );
  }
}
