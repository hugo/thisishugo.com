module.exports = {
  verbose: true,
  bail: 1,
  setupFilesAfterEnv: ['./tests/setup.ts'],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx$': 'babel-jest',
    '^.+\\.ts$': 'babel-jest',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/fileTransformer.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
}
