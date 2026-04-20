/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  // Transform ESM source files to CJS for Jest
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
      plugins: [
        // Transform import.meta.env to process.env for Jest compatibility
        'babel-plugin-transform-import-meta',
      ],
    }],
  },
  moduleNameMapper: {
    // Mock CSS/style imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Mock image imports
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/tests/__mocks__/fileMock.cjs',
  },
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(@reduxjs/toolkit|immer|react-redux|redux|redux-thunk|reselect)/)',
  ],
  // Setup environment variable stubs
  setupFiles: ['<rootDir>/tests/setup.js'],
};
