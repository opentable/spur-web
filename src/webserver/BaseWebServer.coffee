module.exports = (express, DefaultMiddleware, PromiseMiddleware, Logger, Promise, ErrorMiddleware, config, ControllerRegistration, WinstonRequestLoggingMiddleware)->

  class BaseWebServer
    constructor:()->
      @app = express()

    getPort:()->
      @server?.address().port or config.Port

    registerDefaultMiddleware:()->
      DefaultMiddleware.configure(@app)

    registerLoggingMiddleware:()->
      WinstonRequestLoggingMiddleware.configure(@app)

    registerMiddleware:()->
      @registerLoggingMiddleware()
      @registerStaticMiddleware()
      @registerDefaultMiddleware()
      @registerTemplatingEngine()
      PromiseMiddleware.configure(@app)
      @registerControllers()

    registerStaticMiddleware:()->

    registerTemplatingEngine:()->

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
      @server = @app.listen config.Port, ()=>
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
