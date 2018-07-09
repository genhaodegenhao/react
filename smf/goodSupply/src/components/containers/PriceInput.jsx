import Gb from './guangbiao';
/* eslint-disable */
module.exports = React.createClass({
  getInitialState: function () {
    return {
      val: '',
      isEnterActive: false,
      isInput: false,
      focus: false,
      showDollar: false,
      tags: true,
      wdp6: {
        padding: '16px 0',
      },
    };
  },

  getDefaultProps: function () {
    return {
      wrapperStyle: {
        height: '60px',
      },
      textStyle: {
        lineHeight: '60px',
        height: '60px',
        display: 'inline-block',
        fontFamily: 'PingFangSC-Regular',
        fontSize: '14px',
        color: '#333',
        width: '1.1rem',
      },
      InputStyle: {
        height: '60px',
        padding: '16px 0',
        textAlign: 'right',
        border: 'none',
        fontFamily: 'PingFangSC-Regular',
        fontSize: '28px',
        color: '#333',
        fontWeight: 'bold',
        width: '3.25rem',
      },
      placeholder: '请输入金额',
      inputWrapper: {
        width: '3.25rem',
        lineHeight: '60px',
        marginRight: '4px',
      },
    };
  },

  handleChange: function (e) {
    this.setState({
      val: e.target.value,
    });
  },
  componentDidMount: function () {
    if (window.screen.width == 414) {
      this.setState({
        wdp6: {
          padding: '17px 0',
        }
      })
    }
    let line = window.$$('#line');
    let tag = true;
    setInterval(() => {
      if (tag) {
        line.css('visibility', 'visible');
      } else {
        line.css('visibility', 'hidden');
      }
      tag = !tag;
    }, 600);
    let _this = this;
    window.keypads = window.app.keypad({
      input: '#numpad',
      inputReadOnly: true,
      value: "¥",
      onChange: function (ele, val) {
        _this.props.onValueChange(val.slice(1,));
        let doma = window.$$(ele.container[0].childNodes[0].children[7])
        let platform = window.sessionStorage.getItem('userAgent');
        let platformBg = platform == "WX" ? 'btn-ok-disabled-wx' : 'btn-ok-disabled-ali';
        console.log(parseFloat(ele.value.slice(1,)))
        if (ele.value.length >= 2 && parseFloat(ele.value.slice(1,)) != 0.00) {
          doma.removeClass(platformBg);
        } else {
          doma.addClass(platformBg);
        }
      },
      onOpen: function (obj) {
        window.$$('.modal-overlay').remove();//解决app.alert()和键盘冲突的bug
        if (_this.state.tags) {
          _this.setState({
            tags: false,
            val: obj.value,
          })
        }
        _this.setState({
          focus: true,
        })
      },
      onClose: function (ele) {
        console.log(ele);
        _this.setState({
          focus: false,
          val: ele.value,
        })
      }
    });
    // setTimeout(() => {
    //   let initStr = "请输入金额";
    //   window.$$('#numpad')[0].value = initStr;
    // }, 1000);
  },

  render: function () {
    return (
      <div style={this.props.wrapperStyle} className="clearfix wrapperStyle">
        <div style={this.props.textStyle}>支付金额：</div>
        <div style={this.props.inputWrapper}>
          <input id="numpad" className={this.state.tags ? 'inputStyle' : ''} placeholder="请输入金额" style={{...this.props.InputStyle, ...this.state.wdp6}} type="text" value={this.state.val} onChange={(e) => this.handleChange(e)} onInput={() => console.log(11)}/>
        </div>
        {
          this.state.focus ? (<Gb />) : (<div className="line" style={{backgroundColor: '#fff'}}></div>)
        }
      </div>
    )
  }
});
