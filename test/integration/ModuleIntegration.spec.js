const spur = require('spur-ioc');

// NEED to use require vs import to test module export for backward compatability
const mainModule = require('../../');

describe('Integration', function () {
  describe('Main Module Integration Tests', () => {
    beforeEach(() => {
      this.ioc = spur.create('test-spur-common');
      this.ioc.merge(mainModule());
    });

    it('base module dependencies are injectable', () => {
      this.ioc.inject((express, expressDevice, methodOverride, cookieParser, bodyParser, expressWinston) => {
        expect(express).toBeDefined();
        expect(expressDevice).toBeDefined();
        expect(methodOverride).toBeDefined();
        expect(cookieParser).toBeDefined();
        expect(bodyParser).toBeDefined();
        expect(expressWinston).toBeDefined();
      });
    });
  });
});
