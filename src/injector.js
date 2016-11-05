import spur from 'spur-ioc';

import express from 'express';
import expressDevice from 'express-device';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressWinston from 'express-winston';
import ejs from 'ejs';

module.exports = function injector() {
  const ioc = spur.create('spur-web');

  ioc.registerDependencies({
    express,
    expressDevice,
    methodOverride,
    cookieParser,
    bodyParser,
    expressWinston,
    ejs
  });

  ioc.registerFolders(__dirname, [
    'handlers',
    'middleware',
    'webserver'
  ]);

  return ioc;
};
