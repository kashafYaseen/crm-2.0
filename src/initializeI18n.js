import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpApi from 'i18next-http-backend'

const initializeI18n = () => {
  return new Promise((resolve) => {
    i18n
      .use(initReactI18next)
      .use(LanguageDetector)
      .use(HttpApi)
      .init({
        supportedLngs: ['en', 'nl'],
        fallbackLng: 'en',
        detection: {
          order: ['path', 'cookie', 'htmlTag', 'localStorage', 'subdomain'],
        },
        backend: {
          loadPath: '/src/locale/{{lng}}.json',
        },
        react: { useSuspense: false },
      })
      .then(() => {
        resolve() // Resolve the promise once i18n is initialized
      })
  })
}

export default initializeI18n
