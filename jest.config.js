/** @type {import('jest').Config} */
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['./src/**/*.js'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageThreshold: {
    global: {
      branches: 62,
      functions: 84,
      lines: 89,
      statements: 89,
    },
  },
  maxWorkers: 1,
  moduleFileExtensions: ['js', 'json'],
  rootDir: '.',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.js'],
  setupFiles: ['./test/testSetup.js'],
};
