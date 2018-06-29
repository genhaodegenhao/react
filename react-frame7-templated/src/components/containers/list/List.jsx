import React from 'react';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
    };
  }

  componentDidMount() {
  }

  clickconfirm = () => {
    window.app.confirm('是否删除？', () => {
      console.log('ok');
    }, () => {
      console.log('cancel');
    });
  }

  render() {
    return (
      <div onClick={this.clickconfirm} className="test">
        Hello World
      </div>
    );
  }
}

export default Index;
