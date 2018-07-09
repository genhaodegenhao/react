import React from 'react';
import imgInfo from '../../assets/img/baodan/img_info.png';
import icName from '../../assets/img/baodan/ic_name.png';
import icID from '../../assets/img/baodan/ic_ID.png';

/* eslint-disable react/self-closing-comp */
class IdCardInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      userId: '',
    };
  }

  componentDidMount() {
  }

  closeMoadl = () => {
    this.props.userInfoChange('idMsgShowBol', false);
    this.setState({
      userName: '',
      userId: '',
    });
  }

  nameChange = (e) => {
    this.setState({
      userName: e.target.value,
    });
    this.props.userInfoChange('userName', e.target.value);
  }

  idChange = (e) => {
    this.setState({
      userId: e.target.value,
    });
    this.props.userInfoChange('userId', e.target.value);
  }

  submit = () => {
    console.log(this.props);
    if ((this.state.userId && this.state.userName && this.props.returnIdNoAndNameFlag === '0') || (this.state.userId && this.props.returnIdNoAndNameFlag === '3') || (this.state.userName && this.props.returnIdNoAndNameFlag === '2')) {
      this.props.userInfoChange('idMsgShowBol', false);
      this.setState({
        userName: '',
        userId: '',
      });
      this.props.handleSubmitPay(true);
    } else {
      window.app.alert('请填写相应信息！');
    }
  }

  render() {
    return (
      <div className="modalOverlay" style={{ display: `${this.props.idMsgShowBol ? '' : 'none'}` }}>
        <div className="idInfoModal">
          <div className="content">
            <div className="closeIcon" onClick={this.closeMoadl}></div>
            <img className="imgInfo" src={imgInfo} alt="imgInfo" />
            <div className="infoDec">
              <span className="span1">请填写身份信息</span>
              <br />
              <span className="span2">根据《保险实名登记管理办法》要求
付款前请补充以下信息</span>
            </div>
            <div className="inputInfo">
              <div className="inputName" style={{ display: `${this.props.returnIdNoAndNameFlag === '3' ? 'none' : ''}` }}>
                <img src={icName} alt="" />
                <input type="text" placeholder="请输入投保人姓名" value={this.state.userName} onChange={this.nameChange} />
              </div>
              <div className="inputID" style={{ display: `${this.props.returnIdNoAndNameFlag === '2' ? 'none' : ''}` }}>
                <img src={icID} alt="" />
                <input type="text" placeholder="请输入投保人身份证号" value={this.state.userId} onChange={this.idChange} />
              </div>
            </div>
            <div className="submit" onClick={this.submit}>确认支付</div>
          </div>
        </div>
      </div>
    );
  }
}

export default IdCardInfo;
