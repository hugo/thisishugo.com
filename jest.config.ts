import type {Config} from 'jest'
import {defaultsESM} from 'ts-jest/presets/index.js'

module.exports = {
  preset: 'ts-jest',
  verbose: true,
  bail: 1,
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
  },
  transform: {
    ...defaultsESM.transform,
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/fileTransformer.js',
  },
  testEnvironment: 'jsdom',
} satisfies Config
