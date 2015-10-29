describe "BaseMiddleware", ->

  beforeEach ->
    injector().inject (@BaseMiddleware, @Logger)=>

      @Logger.useRecorder()

  it "should log subclass registration", ->
    self = this
    myMiddleware =
      new class MyMiddleware extends @BaseMiddleware

        configure:()->
          super
          self.Logger.log("Subclass called")

    myMiddleware.configure("app")

    expect(@Logger.recorded.log).to.deep.equal [
      [ 'Subclass called' ]
    ]
    expect(@Logger.recorded.info).to.deep.equal [
      [ 'Registering Middleware: MyMiddleware' ]
    ]


