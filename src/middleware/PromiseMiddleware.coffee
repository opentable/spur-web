module.exports = (Promise, _, BaseMiddleware)->

  new class PromiseMiddleware extends BaseMiddleware

    configure:(app)->
      super

      app.response.jsonAsync = (args...)->
        Promise.all(args)
          .then (results)=>
            @json.apply(@, results)
          .catch(@req.next)

      app.response.renderAsync = (view, properties={})->
        Promise.props(properties)
          .then (props)=>
            @render(view, props)
          .catch(@req.next)

      app.response.sendAsync = (args...)->
        Promise.all(args)
          .then (results)=>
            @send.apply(@, results)
          .catch(@req.next)

      app.response.sendStatusAsync = (args...)->
        Promise.all(args)
          .then (results)=>
            @sendStatus(_.first(results).status)
          .catch(@req.next)

      app.response.formatAsync = (documentKey, potentialPromise)->
        Promise.cast(potentialPromise)
          .then (results)=>
            @format {
              html: ()=>
                @type("text/javascript")
                @send("document.#{documentKey} = #{JSON.stringify(results)};")
              json: ()=>
                @json(results)
            }
          .catch(@req.next)
