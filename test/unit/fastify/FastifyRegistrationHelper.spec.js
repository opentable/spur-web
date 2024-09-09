const FastifyRegistrationHelper = require('../../../src/fastify/FastifyRegistrationHelper');

describe('FastifyRegistrationHelper', () => {
  it('will collect all routes', () => {
    // Arrange
    const getCallback = () => 'get';
    const postCallback = () => 'post';
    const putCallback = () => 'put';
    const deleteCallback = () => 'delete';
    const patchCallback = () => 'patch';
    const optionsCallback = () => 'options';
    const headCallback = () => 'head';
    const traceCallback = () => 'trace';
    const allCallback = () => 'all';

    const controller = {
      register: (app) => {
        app.get('/', getCallback);
        app.post('/post', postCallback);
        app.put('/put', putCallback);
        app.delete('/delete', deleteCallback);
        app.patch('/patch', patchCallback);
        app.options('/options', optionsCallback);
        app.head('/head', headCallback);
        app.trace('/trace', traceCallback);
        app.all('/all', allCallback);
      }
    };

    const app = new FastifyRegistrationHelper();

    // Act
    controller.register(app);

    // Assert
    expect(app.getRoutes()).toEqual({
      'GET': [['/', getCallback], ['/all', allCallback]],
      'POST': [['/post', postCallback], ['/all', allCallback]],
      'PUT': [['/put', putCallback], ['/all', allCallback]],
      'DELETE': [['/delete', deleteCallback], ['/all', allCallback]],
      'PATCH': [['/patch', patchCallback], ['/all', allCallback]],
      'OPTIONS': [['/options', optionsCallback], ['/all', allCallback]],
      'HEAD': [['/head', headCallback], ['/all', allCallback]],
      'TRACE': [['/trace', traceCallback], ['/all', allCallback]],
    });
  });

  it('will register view engine when calling app.engine(...) and app.set("views",...)', () => {
    // Arrange
    const engine = () => 'ejs';

    const controller = {
      register: (app) => {
        app.set('views', 'some/view/directory');
        app.engine('ejs', engine);
      }
    };

    const app = new FastifyRegistrationHelper();

    // Act
    controller.register(app);

    // Assert
    expect(app.getViewInfo()).toEqual({
      engine,
      viewDirectory: 'some/view/directory',
      viewExtension: 'ejs',
    });
  });

  it('will throw an error when calling app.set("view engine",...)', () => {
    // Arrange
    const controller = {
      register: (app) => {
        app.set('view engine', 'ejs');
      }
    };

    const app = new FastifyRegistrationHelper();

    // Act & Assert
    expect(() => controller.register(app))
      .toThrow('app.set("view engine", ...) is not supported by Fastify, use app.engine(viewExtension, engine) instead');
  });

  it.each`
  method        | testCase
  ${'set'}      | ${'set() with unsupported parameter'}
  ${'enable'}   | ${'enable()'}
  ${'enabled'}  | ${'enabled()'}
  ${'disable'}  | ${'disable()'}
  ${'disabled'} | ${'disabled()'}
  ${'param'}    | ${'param()'}
  ${'path'}     | ${'path()'}
  ${'use'}      | ${'use()'}
  `('will throw an error when calling app.$testCase', ({ method }) => {
    // Arrange
    const controller = {
      register: (app) => {
        app[method]();
      }
    };

    const app = new FastifyRegistrationHelper();

    // Act & Assert
    expect(() => controller.register(app)).toThrow();
  });
});
