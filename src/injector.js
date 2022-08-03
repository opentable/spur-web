const spur = require('spur-ioc');

const express = require('express');
const expressDevice = require('express-device');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressWinston = require('express-winston');

module.exports = function injector() {
  const ioc = spur.create('spur-web');

  ioc.registerDependencies({
    express,
    expressDevice,
    methodOverride,
    cookieParser,
    bodyParser,
    expressWinston
  });

  ioc.registerFolders(__dirname, [
    'handlers',
    'middleware',
    'webserver'
  ]);

  return ioc;
};
