import {pay} from '../common/pays.js';
module.exports = React.createClass({
	getInitialState: function () {
		return {
			
		}
	},
	componentDidMount:function(){
		pay()
	},
	render: function () {
		return (
			<div className="">
				
			</div>
		)
	}
})