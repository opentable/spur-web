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

      unless err.statusCode
        err = SpurErrors.InternalServerError.create(err.message, err)

      @appendRequestData(err, req)
      @logErrorStack(err)

      res.status(err.statusCode)

      res.format
        text:()=>
          @sendTextResponse(err, req, res)
        html:()=>
          @sendHtmlResponse(err, req, res)
        json:()=>
          @sendJsonResponse(err, req, res)

      next()

    logErrorStack: (err)->
      statusCode = err.statusCode or 0

      unless _.contains(@EXCLUDE_STATUSCODE_FROM_LOGS, statusCode)
        Logger.error(err, "\n", err.stack, "\n", (err.data or ""))

    appendRequestData: (err, req)->
      err.data ?= {}
      err.data = _.extend err.data, {
        url: req.url
      }

    sendTextResponse: (err, req, res)->
      res.send(err.message)

    sendHtmlResponse: (err, req, res)->
      HtmlErrorRender.render(err, req, res)

    sendJsonResponse: (err, req, res)->
      res.json({error: err.message, data: err.data})
