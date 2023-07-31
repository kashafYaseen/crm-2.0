import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpApi from 'i18next-http-backend'

const initializeI18n = () => {
  i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(HttpApi)
    .init({
      supportedLngs: ['en', 'nl'],
      fallbackLng: 'en',
      detection: {
        order: ['cookie', 'htmlTag', 'localStorage', 'path', 'subdomain'],
        caches: ['cookie'],
      },
      backend: {
        loadPath: '/src/locale/{{lng}}/translation.json',
      },
      react: { useSuspense: false },
    })
}

export default initializeI18n
