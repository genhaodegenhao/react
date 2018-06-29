import React from 'react';
import { initLoginToken } from '../utils/LoginToken';

class AuthCheck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAccess: false,
    };
  }

  componentDidMount() {
    this.initLoginToken();
  }

  initLoginToken = () => {
    initLoginToken().then(
      () => {
        this.setState({
          isAccess: true,
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  render() {
    return (
      this.state.isAccess ? this.props.children : null
    );
  }
}

export default AuthCheck;
