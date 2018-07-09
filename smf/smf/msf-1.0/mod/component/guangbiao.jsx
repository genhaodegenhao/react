/**
 * 支付输入组件
 * @author zishuai.xu.coc
 * @time:2017/8/21;
 */
module.exports = React.createClass({
	getInitialState: function () {
		return {
			id: ''

		}
	},

	

	componentDidMount: function () {

		let line = $$('#line');
		let tag = true;
		let id = setInterval(() => {

		 	if(tag) {
		 		line.css('visibility','visible');
		 	}else {
		 		line.css('visibility','hidden');
		 	}
		 	tag = !tag;

		 },600);

		this.setState({
			id: id
		})

	},

	componentWillMount: function () {
		clearInterval(this.state.id);
	},


	render: function () {
		return (
		 <div id="line" className="line"></div>
		)
	}
})