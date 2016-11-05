const path = require('path');

global.assert = require('assert');
global.sinon = require('sinon');
global.chai = require('chai');
global.expect = global.chai.expect;

global.srcDir = path.resolve(__dirname, '../src');
global.injector = require(path.join(__dirname, 'fixtures', 'injector.coffee'));

process.env.NODE_ENV = 'test';

process.setMaxListeners(1000);
