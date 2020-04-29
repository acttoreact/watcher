const testRegex = '(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|js?|tsx?|ts?)$';

module.exports = {
  testRegex,
  transform: {
    '^.+\\.jsx?$': require.resolve('babel-jest'),
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/dist/**"
  ],
  coverageReporters: ['text', 'lcov', 'json', 'html'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.jest.json',
    },
  },
};