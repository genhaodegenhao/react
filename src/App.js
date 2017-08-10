import React, { Component } from 'react';

class App extends Component {
    render() {
        return (
          <div className="App" style={{height:'100%'}}>
            {this.props.children}
          </div>
        );
    }
}

export default App;
