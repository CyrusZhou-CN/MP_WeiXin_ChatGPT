module.exports = {
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
  