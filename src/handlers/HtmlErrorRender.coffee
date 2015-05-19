module.exports = ()->

  class HtmlErrorRender

    @render: (err, req, res)->
      new HtmlErrorRender().render(err, req, res)

    render: (@error, @request, @response)=>
      @response.send @error.stack
