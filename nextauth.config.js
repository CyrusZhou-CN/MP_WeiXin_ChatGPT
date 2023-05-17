// nextauth.config.js

module.exports = {
    // ...其他配置项
    serverRuntimeConfig: {
      NEXTAUTH_URL: process.env.VERCEL_URL ,
    },
    env: {
      NEXTAUTH_URL: process.env.VERCEL_URL,
    },
  };
  