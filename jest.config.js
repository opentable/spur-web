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
      statements: 89
    }
  },
  moduleFileExtensions: ['js','json'],
  rootDir: '.',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.js'],
  testResultsProcessor: 'jest-teamcity-reporter',
  setupFiles: ['./test/testSetup.js'],
};
