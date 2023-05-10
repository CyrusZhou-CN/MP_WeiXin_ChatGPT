// next.config.js
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
require('dotenv').config();
const { i18n } = require('./next-i18next.config.js')
const { loadCustomBuildParams } = require('./next-utils.config')
const { esmExternals = false, tsconfigPath } = loadCustomBuildParams()

module.exports = {
  experimental: {
    esmExternals,
  },
  i18n,
  reactStrictMode: true,
  typescript: {
    tsconfigPath,
  },
  webpack: (config, { isServer }) => {
    config.resolve.modules.push(path.resolve('./'));
    if (isServer) {
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: path.resolve(__dirname, 'README.md'),
              to: path.resolve(__dirname, '.next/README.md'),
            },
            {
              from: path.resolve(__dirname, 'README.IT.md'),
              to: path.resolve(__dirname, '.next/README.IT.md'),
            },
            {
              from: path.resolve(__dirname, 'README.EN.md'),
              to: path.resolve(__dirname, '.next/README.EN.md'),
            },
          ],
        })
      );
    }
    return config;
  },
};
