const path = require('path');
const spur = require('spur-ioc');
const spurCommon = require('spur-common');
const registerConfig = require('spur-common/registerConfig');

/*
 Outside of this project, you use the distributed module
 const spurWeb = require('spur-web');
*/
const spurWeb = require('../../src/injector');

module.exports = function () {
  const ioc = spur.create('example');

  // Register configuration
  registerConfig(ioc, path.join(__dirname, './config'));


  ioc.merge(spurCommon());
  ioc.merge(spurWeb());

  // register folders in your project to be auto-injected
  ioc.registerFolders(__dirname, [
    'controllers/',
    'runtime/'
  ]);

  return ioc;
};
