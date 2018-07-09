/**
 * 展开菜单公共组件
 * @author zishuai.xu.coc
 * @time:2017/8/21;
 */
const dataJson = [
	{name: '番茄炒蛋', num:2, price: 18},
	{name: '外婆红烧肉', num:2, price: 18},
	{name: '干锅花菜', num:2, price: 18},
	{name: '干锅牛蛙', num:2, price: 18},
	{name: '外婆小炒肉', num:2, price: 18},
	{name: '番茄炒蛋', num:2, price: 18},
	{name: '外婆红烧肉', num:2, price: 18},
	{name: '干锅花菜', num:2, price: 18},
	{name: '干锅牛蛙', num:2, price: 18},
	{name: '外婆小炒肉', num:2, price: 18}
]
module.exports = React.createClass({
	getInitialState: function () {
		return {
			isHide: true,
			shouldShow: true
		}
	},

	getDefaultProps: function () {
		return {
			totalItem: '12',
			totalAmt: '219.50',
			orderItems: dataJson,
		}
	},

	componentDidMount: function () {

	},

	handleClickMenu (e) {
		this.setState({
			isHide: !this.state.isHide
		})
	},

	render: function () {
		const restItems = this.props.orderItems.length >= 5?this.props.orderItems.slice(0,5):this.props.orderItems;
		const shouqi = restItems.map((v,i) => {
			return (
			  <li className="menu-list-item">
			  	<span className="menu-list-item-name">{v.name}</span>
			  	<span className="menu-list-item-num">x{v.count}</span>
			  	<span className="menu-list-item-sum"><i>￥</i>{(parseFloat(v.amt) * parseFloat(v.count)).toFixed(2)}</span>
			  </li>
			)
		});
		const zhankai = this.props.orderItems.map((v,i) => {
			return (
			  <li className="menu-list-item">
			  	<span className="menu-list-item-name">{v.name}</span>
			  	<span className="menu-list-item-num">x{v.count}</span>
			  	<span className="menu-list-item-sum"><i>￥</i>{(parseFloat(v.amt) * parseFloat(v.count)).toFixed(2)}</span>
			  </li>
			)
		});
		console.log(restItems)
		return (
		  <div className="menu-list">
		  	<p className="menu-list-title">共{this.props.totalItem}份, 合计{this.props.totalAmt}元</p>
		  	<ul className="menu-list-items">
		  		{
		  			this.state.isHide?shouqi:zhankai
		  		}
		  	</ul>

		  	{
		  		this.props.orderItems.length <= 5?null:(
		  			<div className="menu-list-bottom" onClick={() => this.handleClickMenu()}>
						<a>
							<img className="menu-list-bottomBar" title="" src={this.state.isHide?__uri('../msf-1.0/res/images/Shape_up@2x.png?__inline'):__uri('../msf-1.0/res/images/Shape1@2x.png?__inline')}/>
							<span>{this.state.isHide?'展开更多':'收起更多'}</span>
						</a>
					</div>
				)
		  	}
		  </div>
		)
	}
})