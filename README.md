<img src="https://opentable.github.io/spur/logos/Spur-Web.png?rand=1" width="100%" alt="Spur: Web" />

Common node modules and express middleware that are designed to be the boilerplate of a node web app.

[![NPM version](https://badge.fury.io/js/spur-web.png)](http://badge.fury.io/js/spur-web)
[![Build Status](https://travis-ci.org/opentable/spur-web.png?branch=master)](https://travis-ci.org/opentable/spur-web)

# About the Spur Framework

The Spur Framework is a collection of commonly used Node.JS libraries used to create common application types with shared libraries.

[Visit NPMJS.org for a full list of Spur Framework libraries](https://www.npmjs.com/browse/keyword/spur-framework) >>

# Topics

- [Quick start](#quick-start)
    - [Usage](#usage)
- [API Reference](API.md)
- [Available dependencies in injector](#available-dependencies-in-injector)
- [Contributing](#contributing)
- [License](#license)

# Quick start

## Installing

`Dependencies:`
```bash
$ npm install --save coffee-script
$ npm install --save spur-ioc spur-common spur-config
```

`Module:`
```bash
$ npm install --save spur-web
```

* Note: Coffee-script is not required, but for the simplification of the examples, we are using coffee-script. ES5 and ES6 can also be used.

## Usage

This example shows one of the most basic examples of setting up a spur web server. For a fully detailed example, [please view the example here](https://github.com/opentable/spur-examples/tree/master/spur-web).

#### `src/config/*`

For an example of the configuration, please take a look at this example: [spur-example/spur-web/src/config/](https://github.com/opentable/spur-examples/tree/master/spur-web/src/config)

#### `src/injector.coffee`

```coffeescript
spur       = require "spur-ioc"
spurWeb    = require "spur-web"
spurCommon = require "spur-common"

module.exports = ()->

  ioc = spur.create("demo")

  # Register configuration
  registerConfig(ioc, path.join(__dirname, "./config"))

  ioc.merge(spurCommon())
  ioc.merge(spurWeb())

  # register folders in your project to be auto-injected
  ioc.registerFolders __dirname, [
    "controllers/",
    "runtime/",
  ]

  ioc
```

#### `src/runtime/WebServer.coffee`

```coffeescript
module.exports = (BaseWebServer, path, Logger, HtmlErrorRenderExtension)->

  new class WebServer extends BaseWebServer

    # Add additional changes to the middleware by overriding the method
    registerDefaultMiddleware: ->
      super

    registerEjsTemplates: ->

      @logSectionHeader("EJS Template Registration")

      @app.set('view engine', 'ejs')
      @app.set('views', path.join(__dirname, "../views"))
```

#### `src/views/hello.ejs`

```html
<html>
  <head>
     <meta charset="utf-8">
  </head>
<body>

  <h1><%= data.user %></h1>

</body>
</html>
```

#### `src/controllers/HelloController.coffee`

Files ending in `*Controller.coffee` are auto registered as controllers.

```coffeescript
module.exports = (BaseController)->

  new class HelloController extends BaseController

    configure:(app)->
      super

      app.get "/", @getRoot
      app.get "/hello", @getHello

    getRoot: (req, res, next)=>
      res.status(200).send("This is the root page defined in HelloController.coffee.")

    getHello: (req, res, next)=>
      model = {
        user: req.query.user or "John Doe"
      }

      res.render "hello.ejs", model
```

#### `start.coffee`

```javascript
injector = require "./src/injector"

injector().inject (UncaughtHander, Logger)->

  UncaughtHander.listen()

  BuildDetailsService.initialize()
  .then (details)->

    Logger.info "BUILD VERSION: #{details.buildVersion}"
    Logger.info "NODE_ENV: #{nodeProcess.env.NODE_ENV}"
    Logger.info "PORT: #{config.Port}"
    Logger.info "CONFIG: #{configLoader.configName}"

    WebServer.start()
    .then ->
      # Execute other logic after the server has started

```

# Available dependencies in injector

To see the latest list of the default dependencies that are injected, check out the [injector.coffee](src/injector.coffee) file. Here is a short list of of all of the dependencies available:

### System dependencies

| Name  | Original Module Name | Description |
| :---- | :----                | :----       |
|       |                      |             |


### Libraries

List of external dependencies used and exposed by spur-web. They can be found at npmjs.org using their original names.

| Name    | Original Module Name                     |
| :----   | :----                                    |
| **dep** | [dep](https://www.npmjs.org/package/dep) |

### Local dependecies

All of the files under the `src/` directory are made available when this module is merged into another injector. The following list are the notable dependencies available.

| Name    | Source                      | Description |
| :----   | :----                       | :----       |
| **dep** | [code](src/core/dep.coffee) | desc        |


# Contributing

## We accept pull requests

Please send in pull requests and they will be reviewed in a timely manner. Please review this [generic guide to submitting a good pull requests](https://github.com/blog/1943-how-to-write-the-perfect-pull-request). The only things we ask in addition are the following:

 * Please submit small pull requests
 * Provide a good description of the changes
 * Code changes must include tests
 * Be nice to each other in comments. :innocent:

## Style guide

The majority of the settings are controlled using an [EditorConfig](.editorconfig) configuration file. To use it [please download a plugin](http://editorconfig.org/#download) for your editor of choice.

## All tests should pass

To run the test suite, first install the dependancies, then run `npm test`

```bash
$ npm install
$ npm test
```

# License

[MIT](LICENSE)



