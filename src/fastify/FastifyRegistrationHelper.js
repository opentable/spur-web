class FastifyRegistrationHelper {
  #routes = {
    GET: [],
    POST: [],
    PUT: [],
    DELETE: [],
    PATCH: [],
    OPTIONS: [],
    HEAD: [],
    TRACE: [],
  };

  #engine;

  #viewDirectory;

  #viewExtension;

  #collectRouteDetails(method, ...args) {
    this.#routes[method].push(args);
  }

  #throwNotSupportedError(method, alternative) {
    const alternativeMessage = alternative ? `, use ${alternative} instead` : '';
    throw new Error(`app.${method} is not supported by Fastify${alternativeMessage}`);
  }

  all(...args) {
    ['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'OPTIONS', 'TRACE'].forEach((method) => {
      this.#collectRouteDetails(method, ...args);
    });
  }

  get(...args) {
    this.#collectRouteDetails('GET', ...args);
  }

  post(...args) {
    this.#collectRouteDetails('POST', ...args);
  }

  put(...args) {
    this.#collectRouteDetails('PUT', ...args);
  }

  delete(...args) {
    this.#collectRouteDetails('DELETE', ...args);
  }

  patch(...args) {
    this.#collectRouteDetails('PATCH', ...args);
  }

  options(...args) {
    this.#collectRouteDetails('OPTIONS', ...args);
  }

  head(...args) {
    this.#collectRouteDetails('HEAD', ...args);
  }

  trace(...args) {
    this.#collectRouteDetails('TRACE', ...args);
  }

  engine(viewExtension, engine) {
    this.#engine = engine;
    this.#viewExtension = viewExtension;
  }

  set(name, value) {
    switch (name) {
      case 'views':
        this.#viewDirectory = value;
        break;

      case 'view engine':
        this.#throwNotSupportedError('set("view engine", ...)', 'app.engine(viewExtension, engine)');

      default:
        this.#throwNotSupportedError(`set("${name}", ...)`);
    }
  }

  getRoutes() {
    return this.#routes;
  }

  getViewInfo() {
    return {
      engine: this.#engine,
      viewDirectory: this.#viewDirectory,
      viewExtension: this.#viewExtension,
    };
  }

  disable() {
    this.#throwNotSupportedError('disable(...)');
  }

  disabled() {
    this.#throwNotSupportedError('disabled(...)');
  }

  enable() {
    this.#throwNotSupportedError('enable(...)');
  }

  enabled() {
    this.#throwNotSupportedError('enabled(...)');
  }

  param() {
    this.#throwNotSupportedError('param(...)');
  }

  path() {
    this.#throwNotSupportedError('path(...)');
  }

  use() {
    this.#throwNotSupportedError('use(...)');
  }

  get isFastify() {
    return true;
  }
}

module.exports = FastifyRegistrationHelper;
