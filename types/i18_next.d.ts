/**i18next.d.ts
 * If you want to enable locale keys typechecking and enhance IDE experience.
 *
 * Requires `resolveJsonModule:true` in your tsconfig.json.
 *
 * @link https://www.i18next.com/overview/typescript
 */
import 'i18next'

import type common from '../public/locales/cn/common.json'
import type footer from '../public/locales/cn/footer.json'
import type admin from '../public/locales/cn/admin.json'

interface I18nNamespaces {
  common: typeof common
  footer: typeof footer
  admin: typeof admin
}

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: I18nNamespaces
  }
}