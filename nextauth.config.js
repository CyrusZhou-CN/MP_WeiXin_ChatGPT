// nextauth.config.js
const baseUrl = process.env.VERCEL_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
console.log('baseUrl:', baseUrl);
module.exports = {
    // ...其他配置项
    serverRuntimeConfig: {
      NEXTAUTH_URL: baseUrl,
    },
    env: {
      NEXTAUTH_URL: baseUrl,
    },
  };
  