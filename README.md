# spur-web

Common node modules and express middleware that are designed to be the boilerplate of a node web app. Extends the 'spur-common' NPM module.

The project is still a work in progress. We are in the middle of making adjustments and are starting to dogfood the module in our own applications.

[![NPM version](https://badge.fury.io/js/spur-web.png)](http://badge.fury.io/js/spur-web)
[![Build Status](https://travis-ci.org/opentable/spur-web.png?branch=master)](https://travis-ci.org/opentable/spur-web)

## Installing

```bash
$ npm install spur-web --save
```

## What is injected by default?

To see the latest list of the default dependencies that are injected, check out the [injector.coffee](src/injector.coffee) file.

Libraries: (injection alias/library)

```javascript
  {
...
  }
```

Others:

```javascript
  {
...
  }
```

Directory contents from src/:

```javascript
  [
...
  ]
```

Note: Any injectors in which you merge this library to will get all of these dependencies by default.

## Usage

### src/injector.js

```javascript
var spur = require("spur-ioc");
var spurWeb = require("spur-web");

module.exports = function(){
  // define a  new injector
  var ioc = spur.create("demo");

  // register node modules to be injected
  ioc.registerLibraries({
    ...
  });

  // register already constructed objects such as globals
  ioc.registerDependencies({
    ...
  });

  // register folders in your project to be autoinjected
  ioc.registerFolders(__dirname, [
    "demo"
  ]);

  // THIS IS THE IMPORTANT PART: Merge the spur-web dependencies to your local container
  ioc.merge(spurWeb())

  return ioc;
}
```

### start.js

```javascript
injector = require "./src/injector"

injector().inject (UncaughtHander, Logger)->

  Logger.info "Starting app..."

  // Here you would inject your dependencies like WebServer or runtime class and start it.

  // Enabled the UncaughtHander
  UncaughtHander.listen()
```

