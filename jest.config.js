// jest.config.js
const dotenv = require('dotenv');
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
const envConfig = dotenv.config({ path: envFile }).parsed;

module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./jest.setup.js'],
    // other Jest config options...
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
      '^.+\\.ts?$': 'ts-jest',
      "^.+\\.js$": "babel-jest"
    },
    globals: {
      "ts-jest": {
        tsconfig: "tsconfig.json",
        diagnostics: false,
      }
    }
  }
  