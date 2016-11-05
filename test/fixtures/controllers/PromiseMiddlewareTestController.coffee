module.exports = (BaseController, Promise)->

  new class PromiseMiddlewareTestController extends BaseController

    configure: (app)->
      super
      app.get "/promise-middleware-test--jsonasync", @getJsonAsync
      app.get "/promise-middleware-test--renderasync", @getRenderAsync
      app.get "/promise-middleware-test--sendAsync", @getSendAsync
      app.get "/promise-middleware-test--sendStatusAsync", @getSendStatusAsync
      app.get "/promise-middleware-test--formatAsync", @getFormatAsync

    getJsonAsync: (req, res)=>
      res.jsonAsync(Promise.resolve("jsonAsync success"))

    getRenderAsync: (req, res)=>
      res.renderAsync("renderView", Promise.resolve({microapp: "renderAsync success"}))

    getSendAsync: (req, res)=>
      res.sendAsync(Promise.resolve("sendAsync success"))

    getSendStatusAsync: (req, res)=>
      res.sendStatusAsync(Promise.resolve({status: 200}))

    getFormatAsync: (req, res)=>
      res.formatAsync(Promise.resolve("formatAsync success"))
