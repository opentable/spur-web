module.exports = (express, DefaultMiddleware, PromiseMiddleware, Logger, Promise, ErrorMiddleware, config, ControllerRegistration, WinstonRequestLoggingMiddleware)->

  class BaseWebServer
    constructor:()->
      @app = express()
      @port = config.Port

    setPort:(@port)->

    getPort:()->
      @server?.address().port or @port

    registerDefaultMiddleware:()->
      DefaultMiddleware.configure(@app, @logger)

    registerLoggingMiddleware:()->
      WinstonRequestLoggingMiddleware.configure(@app)

    registerMiddleware:()->
      @registerLoggingMiddleware()
      @registerDefaultMiddleware()

      PromiseMiddleware.configure(@app)
      @registerControllers()

    registerControllers:()->
      ControllerRegistration.register(@app)

    registerErrorMiddleware:()->
      ErrorMiddleware.configure(@app)

    setCluster:(@cluster)->

    start:()->
      @registerMiddleware()
      @registerErrorMiddleware()
      @startInternal()

    startInternal:()-> new Promise (resolve, reject)=>
      @server = @app.listen @port, ()=>
        Logger.info @startedMessage()
        resolve()
      Promise.promisifyAll(@server)

    stop:()->
      (@server?.closeAsync?() or Promise.resolve())
        .finally =>
          Logger.info "Express server stopped"


    startedMessage:()->
      if @cluster
        "Worker #{@cluster.worker.id} started on port #{@getPort()}"
      else
        "Express app started on port #{@getPort()}"
