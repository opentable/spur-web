module.exports = async () => {
  const injector = require('./fixtures/injector');

  global.injector = injector;

  process.env.NODE_ENV = 'test';
};
