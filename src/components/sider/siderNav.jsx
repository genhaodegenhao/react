import React, { Component } from 'react';
import $ from 'jquery';
import utils from '../../assets/js/common/common.js';


class SiderNav extends Component {

    constructor (props) {
        super(props);
        this.state = {
            loginToken: window.sessionStorage.getItem('loginToken'),
            menuList: []
        }
    }

    render() {
        return (
            <div>
                SiderNav
            </div>
        );
    }
}

export default SiderNav;