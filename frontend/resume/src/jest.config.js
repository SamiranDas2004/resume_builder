import { defaults } from 'jest-config';

export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'js', 'jsx'],
  extensionsToTreatAsEsm: ['.jsx'],
};
