module.exports = (express, DefaultMiddleware, PromiseMiddleware, Logger, Promise, ErrorMiddleware, config, ControllerRegistration, WinstonRequestLoggingMiddleware)->

  class BaseWebServer
    constructor:()->
      @app = express()

    getPort:()->
      @server?.address().port or config.Port

    registerDefaultMiddleware:()->
      @logSectionHeader("Default Middleware Registration")
      DefaultMiddleware.configure(@app)

    registerLoggingMiddleware:()->
      @logSectionHeader("Logging Middleware Registration")
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
      @logSectionHeader("Controller Registration")
      ControllerRegistration.register(@app)

    registerErrorMiddleware:()->
      @logSectionHeader("Error Middleware Registration")
      ErrorMiddleware.configure(@app)

    setCluster:(@cluster)->

    start:()->
      @registerMiddleware()
      @registerErrorMiddleware()
      @startInternal()

    startInternal:()-> new Promise (resolve, reject)=>
      @server = @app.listen config.Port, ()=>
        Logger.log @startedMessage()
        resolve()

      Promise.promisifyAll(@server)

    stop:()->
      (@server?.closeAsync?() or Promise.resolve())
        .finally =>
          Logger.log "Express server stopped"


    startedMessage:()->
      if @cluster
        "Worker #{@cluster.worker.id} started on port #{@getPort()}"
      else
        "Express app started on port #{@getPort()}"

    logSectionHeader: (message)->
      Logger.log "========================"
      Logger.log "= #{message}"
      Logger.log "========================"
