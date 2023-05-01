const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
require('dotenv').config();
module.exports = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: path.resolve(__dirname, 'README.md'),
              to: path.resolve(__dirname, '.next/README.md'),
            },
          ],
        })
      );
    }
    return config;
  },
};
