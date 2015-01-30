describe "BaseMiddleware", ->

  beforeEach ->
    injector().inject (@BaseMiddleware, @Logger)=>

      @Logger.useRecorder()



  it "should exist", ->
    expect(@BaseMiddleware).to.exist

  it "should log subclass registration", ->
    self = this
    myMiddleware =
      new class MyMiddleware extends @BaseMiddleware

        configure:()->
          super
          self.Logger.info("Subclass called")


    myMiddleware.configure("app")
    expect(@Logger.recorded.info).to.deep.equal [
      [ 'Registering Middleware: MyMiddleware' ],
      [ 'Subclass called' ]
    ]


