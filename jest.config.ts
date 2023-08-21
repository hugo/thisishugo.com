module.exports = {
  verbose: true,
  bail: 1,
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx$': 'ts-jest',
    '^.+\\.ts$': 'ts-jest',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/fileTransformer.js',
  },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/'],
}
