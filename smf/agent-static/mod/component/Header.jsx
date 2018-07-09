module.exports = React.createClass({
	getInitialState: function () {
		return {

		}
	},
	getDefaultProps: function () {
		return {
			title: '登录块钱',
			hasBack: false 
		}
	},
	events: {
		getBack: function () {
			window.history.back(-1);
		}
	},
	render: function () {
		var back = (<div className="left">
		  			<a className="link back" onClick={this.events.getBack}>
		  				<i className="icon icon-back"></i>
		  			</a>
		  		</div>);
		return (
		  <div className="navbar">
		  	<div className="navbar-inner">
		  		{this.props.hasBack?back:null}
		  		<div className="center">
		  			{this.props.title}
		  		</div>
		  	</div>
		  </div>
		)
	}


})