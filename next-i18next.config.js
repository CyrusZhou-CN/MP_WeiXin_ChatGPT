// next-i18next.config.js
/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
    debug: process.env.NODE_ENV === 'development',
    i18n: {
        locales: ['cn', 'it', 'en'],
        defaultLocale: 'cn',
        localePath: require('path').resolve('./public/locales'),
        localesPath: './public/locales',
        localeDetection: false,
    },
    reloadOnPrerender: process.env.NODE_ENV === 'development',
}