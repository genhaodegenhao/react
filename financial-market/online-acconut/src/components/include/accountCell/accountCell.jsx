import React from 'react';
import s from './accountCell.less';

const accountCell = (props) => {
  const params = props.params;
  const handleClick = props.onClick;
  const { pan, bankName, balance } = { ...params };
  const lastNo = pan ? pan.substring(pan.length - 3, pan.length) : '';
  return (
    <div className={s.container} onClick={handleClick}>
      <div className={s.content}>
        <div className={s.lineItem}><div className={s.accountContent}>{bankName}</div>电子账户 {'>'}  </div>
        <div className={s.lineItem}>尾号：<div className={s.lastNoContent}>{lastNo}</div></div>
        <div className={s.lineItem}>余额：<div className={s.amtContent}>¥{balance}</div></div>
      </div>
    </div>
  );
};

export default accountCell;
