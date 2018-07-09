const express =  require('express');
const Mock =  require('mockjs');
const chalk = require('chalk');
const config = require('config');

const orderList = require('./data/orderList.json');
const merchantName = require('./data/merchant.json');
const account = require('./data/account.json');
const index = require('./data/index.json');
const merchantList = require('./data/merchantList.json');
const messageList = require('./data/message.json');
const messageDetails = require('./data/messageDetails.json');

const port = config.get('mockConfig').port || 8888;

console.log(chalk.cyanBright(`Start Mock-Server in ${port}`));

let app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.all('/orderList', (req, res) => {
  res.json(Mock.mock(orderList));
});
app.all('/merchantName', (req, res) => {
  res.json(Mock.mock(merchantName));
});
app.all('/account', (req, res) => {
  res.json(Mock.mock(account));
});
app.all('/index', (req, res) => {
  res.json(Mock.mock(index));
});
app.all('/merchantList', (req, res) => {
  res.json(Mock.mock(merchantList));
});
app.all('/messageList', (req, res) => {
  res.json(Mock.mock(messageList));
});
app.all('/messageDetails', (req, res) => {
  res.json(Mock.mock(messageDetails));
});
// app.all('/api2', (req, res) => {
//   res.json(Mock.mock(test));
// });
console.log(`Mock-Server on ${8888} %j`);

app.listen(port);
