const path = require('path');
require('dotenv').config();
const { loadCustomBuildParams } = require('./next-utils.config')
const { esmExternals = false, tsconfigPath } = loadCustomBuildParams()
const { i18n } = require('./next-i18next.config');

module.exports = {
  i18n,
  serverRuntimeConfig: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  experimental: {
    esmExternals,
  },
  trailingSlash: true,
  reactStrictMode: true,
  typescript: {
    tsconfigPath,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 让 next-i18next 的客户端部分正常工作
      config.resolve.fallback.intl_pluralrules = require.resolve('intl-pluralrules')
    }
    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  module: {
    rules: [
      {
        test: /\.md$/,
        use: 'raw-loader',
      },
    ],
  },
};
