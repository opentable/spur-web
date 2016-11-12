module.exports = (BaseMiddleware, Logger)->

  new class TestBaseMiddleware extends BaseMiddleware

    configure:()->
      super
      Logger.log 'Subclass called'
