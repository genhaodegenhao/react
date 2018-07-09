/**
 * 支付输入组件
 * @author zishuai.xu.coc
 * @time:2017/8/21;
 */

const Gb = require('./guangbiao')

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

		}
	},

	getDefaultProps: function () {
		return {
			wrapperStyle: {
				width: '9rem',
				height: '60px',
				border: 'solid 1px #ccc',
				backgroundColor: '#fff',
				borderRadius: '4px',
				margin: '0 auto',
				marginBottom: '3rem',
				overflow: 'hidden',
			},

			textStyle: {
				lineHeight: '60px',
				height: '60px',
				display: 'inline-block',
				fontFamily: 'PingFangSC-Regular',
				fontSize: '14px',
				color: '#333',
				width: '3.8rem',
				textIndent: '9px',
				float: 'left',

			},

			InputStyle: {
				height: '28px',
				lineHeight: '1.5rem',
				padding: '16px 0',
				textAlign: 'right',
				border: 'none',
				fontFamily: 'PingFangSC-Regular',
				fontSize: '28px',
				color: '#333',
				fontWeight: 'bold',
				width: '4.6rem',
			},
			placeholder: '请询问服务员后输入',
			inputWrapper: {
				paddingRight: '1.4rem',
				width: '3.5rem',
				float: 'right',
				lineHeight: '60px',
				marginRight: '0.3rem'
			},
			inputWrapper: {
				float: 'right',
			}

		}
	},

	handleChange: function (e) {


		this.setState({
			val:  e.target.value
		})
	},

	componentDidMount: function () {

		// $$("#numpad").focus(function(){
	 //        document.activeElement.blur();
	 //    });
	 //    

		if(window.screen.width == 414) {
			this.setState({
				wdp6: {
					padding: '17px 0',
				}
			})
		}


		

		 let line = $$('#line');

		 let tag = true;
		 setInterval(() => {


		 	if(tag) {
		 		line.css('visibility','visible');
		 	}else {
		 		line.css('visibility','hidden');
		 	}
		 	tag = !tag;

		 },600)


		let _this = this;

		 app.keypad({
	      input: '#numpad',
	      inputReadOnly: true,
		  value:"¥",
	      onChange: function (ele,val) {



	      _this.props.onValueChange(val.slice(1,));
	      var doma = $$(ele.container[0].childNodes[0].children[7])


	      let platform = window.sessionStorage.getItem('userAgent');

          let platformBg = platform == "WX"?'btn-ok-disabled-wx':'btn-ok-disabled-ali';
  			

  			console.log(parseFloat(ele.value.slice(1,)))
          if(ele.value.length >=2 && parseFloat(ele.value.slice(1,)) != 0.00) {
            doma.removeClass(platformBg);

          } else {
            doma.addClass(platformBg);
          	
          } 
        },
        onOpen: function (obj) {
        	$$('.modal-overlay').remove();//解决app.alert()和键盘冲突的bug

        	if(_this.state.tags) {
        		_this.setState({
        			tags: false,
        			val: obj.value
        		})

        	}
        

          _this.setState({
            	
            	focus: true

            }) 

        
        },
        onClose: function (ele) {
        	console.log(ele)
        	
   			_this.setState({
   				focus: false,
   				val: ele.value
   			})
        }


	    });


		 setTimeout(() => {
		 	let initStr = "请询问服务员后输入";
			$$('#numpad')[0].value = initStr;
		 },1000)
		 
		
		

	},


	render: function () {
		return (
		  <div style={this.props.wrapperStyle} className="clearfix">
		  	<div style={this.props.textStyle}>订单金额（元）：</div>
		  	{
		  		this.state.focus?(<Gb />):(<div className="line" style={{backgroundColor: '#fff'}}></div>)
		  	}
		  	<div style={this.props.inputWrapper} >
		  		<input id="numpad" className={this.state.tags?'inputStyle':''} placeholder=""  style={{...this.props.InputStyle,...this.state.wdp6}} type="text"  value={this.state.val} onChange={(e) => this.handleChange(e)} onInput={() => console.log(11)}/>
		  	</div>
		  	
		  	
		  </div>
		)
	}
})