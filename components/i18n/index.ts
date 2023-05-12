import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import cnCommon from '../../public/locales/cn/common.json'
import cnFooter from '../../public/locales/cn/footer.json'
import cnAdmin from '../../public/locales/cn/admin.json'
import enCommon from '../../public/locales/en/common.json'
import enFooter from '../../public/locales/en/footer.json'
import enAdmin from '../../public/locales/en/admin.json'
import itCommon from '../../public/locales/it/common.json'
import itFooter from '../../public/locales/it/footer.json'
import itAdmin from '../../public/locales/it/admin.json'

const resources = {
  cn: {
    common: cnCommon,
    footer: cnFooter,
    admin: cnAdmin,
  },
  en: {
    common: enCommon,
    footer: enFooter,
    admin: enAdmin,
  },
  it: {
    common: itCommon,
    footer: itFooter,
    admin: itAdmin,
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'cn',
  fallbackLng: 'cn',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n