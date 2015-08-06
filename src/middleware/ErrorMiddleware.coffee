module.exports = (SpurErrors, Logger, HtmlErrorRender, BaseMiddleware, _)->

  new class ErrorMiddleware extends BaseMiddleware

    configure:(@app)->
      super
      @EXCLUDE_STATUSCODE_FROM_LOGS = [
        404
      ]

      @app.use @throwNotFoundError
      @app.use @middleware(@)

    throwNotFoundError:(req, res, next)->
      next(SpurErrors.NotFoundError.create("Not Found"))

    middleware:(self)-> (err, req, res, next)=>

      @logErrorStack(err)

      unless err.statusCode
        err = SpurErrors.InternalServerError.create(err.message, err)

      res.status(err.statusCode)

      res.format
        text:()=>
          @sendTextResponse(err, req, res)
        html:()=>
          @sendHtmlResponse(err, req, res)
        json:()=>
          @sendJsonResponse(err, req, res)

    logErrorStack: (err)=>
      statusCode = err.statusCode or 0

      if _.contains(@EXCLUDE_STATUSCODE_FROM_LOGS, statusCode) is false
        Logger.error(err, "\n", err.stack, "\n", (err.data or ""))

    sendTextResponse: (err, req, res)->
      res.send(err.message)

    sendHtmlResponse: (err, req, res)->
      HtmlErrorRender.render(err, req, res)

    sendJsonResponse: (err, req, res)->
      res.json({error: err.message, data: err.data})
