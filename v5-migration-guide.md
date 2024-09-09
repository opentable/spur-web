# Migrating from v4 to v5

Version 5 introduces the option to enable [fastify](https://fastify.dev).

---

## Using `express`

If using express is still desired you don't need to do anything to migrate to v5
> _NOTE: this assumes neither BaseWebServer method `startInternal` or `getCloseAsync` has not been overwritten as they are no longer supported._

### New Features
* The start method now accepts an options object which accepts a `keepAliveTimeout` value.
* the start method now resolves with the server object so adding/setting additional properties can be achieved easily, via the `server.app` property.

```javascript
WebServer.start({ keepAliveTimeout: 3200 })
  .then(({ app, server }) => {
    // Execute other logic after the server has started
  });
```
---

## Using `fastify`

If using fastify is desired, this can be enabled via a boolean flag when calling the start method:
```javascript
WebServer.start({ withFastify: true });
```

An effort to maintain the existing interface has been made, however, some methods just aren't supported by `fastify`

| Existing                         | Change Required | Note                                   |
| -------------------------------- | :-------------: | -------------------------------------- |
| `app.engine(engine)`             | No              | `@fastify/view` only supports some [engines](https://www.npmjs.com/package/@fastify/view) |
| `app.set('view engine', engine)` | No              | See note above about supported engines |
| `app.set('views', viewDir)`      | No              | Still need to call `app.engine`        |
| `app.set(...)`                   | Yes             | Not supported by fastify               |
| `app.disable(...)`               | Yes             | Not supported by fastify               |
| `app.disabled(...)`              | Yes             | Not supported by fastify               |
| `app.enable(...)`                | Yes             | Not supported by fastify               |
| `app.enabled(...)`               | Yes             | Not supported by fastify               |
| `app.param(...)`                 | Yes             | Not supported by fastify               |
| `app.path(...)`                  | Yes             | Not supported by fastify               |
| `app.use(...)`                   | Yes             | Not supported by fastify               |
| `app.locals`                     | Yes             | Not supported by fastify               |
| `app.mountpath`                  | Yes             | Not supported by fastify               |

### Other changes
The `startInternal` and `getCloseAsync` methods have been removed from the `BaseWebServer` class. If a derived class has been created which overwrites either one, then the code will need to be updated as they will no longer be called.



