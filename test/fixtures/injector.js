const path = require('path');
const spur = require('spur-ioc');
const spurCommon = require('spur-common');
const localInjector = require('../../src/injector');
const registerConfig = require('spur-common/registerConfig');
const colors = require('colors');

module.exports = function () {
  const ioc = spur.create('test-spur-web');

  registerConfig(ioc, path.join(__dirname, 'config'));

  ioc.merge(spurCommon());
  ioc.merge(localInjector());

  ioc.registerFolders(__dirname, ['controllers/', 'middleware/', 'runtime/']);

  ioc.registerDependencies({
    colors: colors,
  });

  return ioc;
};
