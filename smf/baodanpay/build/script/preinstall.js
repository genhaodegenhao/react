const path = require('path');

const fs = require('fs');

const exec = require('child_process').exec;

const preList = require('../../package.json');

const { md5 } = require('../utils/cryptoUtils');

const execPath = path.resolve('../');

const preListObj = preList.devDependenciesGlobal;

const preListObjArray = Object.keys(preListObj);

const isFirst = !fs.existsSync(`${execPath}/package.json`);

const currentMd5 = md5(JSON.stringify(preListObj));

let script = `cd ${execPath} && npm i`;

let isUpdate = false;

console.log(`The md5 for this project: ${currentMd5}`);

if (isFirst){
  console.log('init global modules...');
  fs.writeFileSync(`${execPath}/package.json`, JSON.stringify({"md5": currentMd5,dependencies: preListObj}));
  isUpdate = true;
} else {
  console.log('will check update');
  const lastVersion = require(`${execPath}/package.json`).md5;
  if (lastVersion !== currentMd5) {
    fs.writeFileSync(`${execPath}/package.json`, JSON.stringify({"md5": currentMd5,dependencies: preListObj}));
    isUpdate = true;
  }
}

if (isUpdate) {
  console.log(`will install in ${execPath}`);
  console.log('start install public package for neo-antd');
  console.log('please wait some minutes.....');

  exec(script, function (err, stdout, stderr) {
    console.log(stdout);
    if (err) {
      console.log('error:' + stderr);
    } else {
      console.log(stdout);
      console.log('package init success');
      console.log(`The global install in ${execPath}`);
    }
  });

} else {
  console.log('not any update');
  console.log('will be run next');
}
