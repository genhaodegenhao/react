import React, { Component } from 'react';
import $ from 'jquery';
import utils from '../../assets/js/common/common.js';

class NewHeader extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loginToken: window.sessionStorage.getItem('loginToken'),
            menuList: []
        }
    }

    render() {
        return (
            <div className="header">
                header
            </div>
        );
    }
}

export default NewHeader;