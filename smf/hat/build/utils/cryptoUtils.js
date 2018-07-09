const crypto = require('crypto');

const md5 = function (str) {
  const md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
};


module.exports = {
  md5,
};

