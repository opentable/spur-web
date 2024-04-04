/** @type {import('jest').Config} */
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['./src/**/*.js'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageThreshold: {
    global: {
      branches: 88,
      functions: 98,
      lines: 98,
      statements: 98,
    },
  },
  maxWorkers: 1,
  moduleFileExtensions: ['js', 'json'],
  rootDir: '.',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.js'],
  setupFiles: ['./test/testSetup.js'],
};
