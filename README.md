<img src="https://opentable.github.io/spur/logos/Spur-Web.png?rand=1" width="100%" alt="Spur: Web" />

Common node modules and express middleware that are designed to be the boilerplate of a node web app.

  [![NPM Version][npm-version-image]][npm-url]
  [![NPM Install Size][npm-install-size-image]][npm-install-size-url]
  [![NPM Downloads][npm-downloads-image]][npm-downloads-url]

# About the Spur Framework

The Spur Framework is a collection of commonly used Node.JS libraries used to create common application types with shared libraries.

[Visit NPMJS.org for a full list of Spur Framework libraries](https://www.npmjs.com/browse/keyword/spur-framework) >>

# Topics

- [Quick start](#quick-start)
    - [Usage](#usage)
- [Available dependencies in injector](#available-dependencies-in-injector)
- [Contributing](#contributing)
- [License](#license)

# Quick start

## Installing

`Dependencies:`
```shell
$ npm install --save spur-ioc spur-common spur-config
```

`Module:`
```shell
$ npm install --save spur-web
```

**Note:** The example code below expects that you are using Node 6. We follow the active [Node LTS schedule](https://github.com/nodejs/LTS).

## Usage

#### `src/config/*`

For an example of the configuration, please take a look at this example: [example/src/config/](example/src/config).

#### `src/injector.js`

```javascript
const path = require('path');
const spur = require('spur-ioc');
const spurCommon = require('spur-common');
const registerConfig = require('spur-common/registerConfig');
const spurWeb = require('spur-web');

module.exports = function () {
  const ioc = spur.create('example');

  // Register configuration
  registerConfig(ioc, path.join(__dirname, './config'));


  ioc.merge(spurCommon());
  ioc.merge(spurWeb());

  // register folders in your project to be auto-injected
  ioc.registerFolders(__dirname, [
    'controllers/',
    'runtime/'
  ]);

  return ioc;
};
```

#### `src/runtime/WebServer.js`

```javascript
module.exports = function (BaseWebServer, path) {
  class WebServer extends BaseWebServer {

    // Add additional changes to the middleware by overriding the method
    registerDefaultMiddleware() {
      super.registerDefaultMiddleware();
      this.registerEjsTemplates();
    }

    registerEjsTemplates() {
      this.logSectionHeader('EJS Template Registration');

      this.app.set('view engine', 'ejs');
      this.app.set('views', path.join(__dirname, '../views'));
    }
  }

  // Assure there is just one instance
  return new WebServer();
};
```

#### `src/views/hello.ejs`

```html
<html>
  <head>
     <meta charset="utf-8">
  </head>
<body>
  <h1><%= user %></h1>
</body>
</html>
```

#### `src/controllers/HelloController.js`

Files ending in `*Controller.js` are auto registered as controllers.

```javascript
module.exports = function (BaseController) {
  class HelloController extends BaseController {

    configure(app) {
      super.configure(app);

      app.get('/', this.getRoot.bind(this));
      app.get('/hello', this.getHello.bind(this));
    }

    getRoot(req, res) {
      res.status(200).send('This is the root page defined in HelloController.js.');
    }

    getHello(req, res) {
      const model = {
        user: req.query.user || 'John Doe'
      };

      res.render('hello', model);
    }

  }

  return new HelloController();
};
```

#### `start.js`

```javascript
const injector = require('./src/injector');

// IMPORTANT: The callback needs to be a function call vs. using a fat-arrow block. Fat-arrow is not supported yet.
injector().inject(function (UncaughtHandler, WebServer, Logger, config, configLoader, nodeProcess) {
  UncaughtHandler.listen();

  Logger.info(`NODE_ENV: ${nodeProcess.env.NODE_ENV}`);
  Logger.info(`PORT: ${config.Port}`);
  Logger.info(`CONFIG: ${configLoader.configName}`);

  WebServer.start()
  .then(() => {
    // Execute other logic after the server has started
  });
});
```

### Running example

```shell
$ npm start
```

# Available dependencies in injector

To see the latest list of the default dependencies that are injected, check out the [injector.js](src/injector.js) file. Here is a short list of of all of the dependencies available:

### Libraries

List of external dependencies used and exposed by spur-web. They can be found at npmjs.org using their original names.

| Name               | Original Module Name                                             |
| :----              | :----                                                            |
| **express**        | [express](https://www.npmjs.org/package/express)                 |
| **expressDevice**  | [express-device](https://www.npmjs.org/package/express-device)   |
| **methodOverride** | [method-override](https://www.npmjs.org/package/method-override) |
| **cookieParser**   | [cookie-parser](https://www.npmjs.org/package/cookie-parser)     |
| **bodyParser**     | [body-parser](https://www.npmjs.org/package/body-parser)         |
| **expressWinston** | [express-winston](https://www.npmjs.org/package/express-winston) |
| **ejs**            | [ejs](https://www.npmjs.org/package/ejs)                         |

### Local dependecies

All of the files under the `src/` directory are made available when this module is merged into another injector. The following list are the notable dependencies available.

#### Reusable

| Name                       | Source                                              | Description                                                                                                 |
| :----                      | :----                                               | :----                                                                                                       |
| **BaseController**         | [code](src/webserver/BaseController.js)         | A base class in order to be able to identify all of the controllers derived from it.                        |
| **BaseWebServer**          | [code](src/webserver/BaseWebServer.js)          | A base web server that sets all of the middleware mentioned here.                                           |
| **ControllerRegistration** | [code](src/webserver/ControllerRegistration.js) | Registers all of the controllers based on the BaseController type and also files that end with `Controller` |
| **BaseMiddleware**         | [code](src/middleware/BaseMiddleware.js)        | A base class in order to be able to identify all of the middleware derived from it.                         |

#### Used internally, but can be used/replaced

| Name                                | Source                                                        | Description                                                                                           |
| :----                               | :----                                                         | :----                                                                                                 |
| **HtmlErrorRender**                 | [code](src/handlers/HtmlErrorRender.js)                   | Sets basic error rendering for uncaught errors.                                                       |
| **DefaultMiddleware**               | [code](src/middleware/DefaultMiddleware.js)               | Registers default express middleware: cookie parser, body parser, method override, and express device |
| **ErrorMiddleware**                 | [code](src/middleware/ErrorMiddleware.js)                 | Adds error handling for unhandled errors for requests.                                                |
| **NoCacheMiddleware**               | [code](src/middleware/NoCacheMiddleware.js)               | Middleware for no cache headers |
| **PromiseMiddleware**               | [code](src/middleware/PromiseMiddleware.js)               | Extends the response object with functionality to be used through promises. It unwraps promises as they are being resolved. |
| **WinstonRequestLoggingMiddleware** | [code](src/middleware/WinstonRequestLoggingMiddleware.js) | Winston middleware for logging every request to the console log. |


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

```shell
$ npm install
$ npm test
```

# License

[MIT](LICENSE)

[npm-downloads-image]: https://badgen.net/npm/dm/spur-web
[npm-downloads-url]: https://npmcharts.com/compare/spur-web?minimal=true
[npm-install-size-image]: https://badgen.net/packagephobia/install/spur-web
[npm-install-size-url]: https://packagephobia.com/result?p=spur-web
[npm-url]: https://npmjs.org/package/spur-web
[npm-version-image]: https://badgen.net/npm/v/spur-web