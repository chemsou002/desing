import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ar from './ar.json';
import en from './en.json';

const LANGUAGE_STORAGE_KEY = 'electrohub_language';

// Custom language detector that checks localStorage first
const customDetector = {
  name: 'customLocalStorage',
  lookup() {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'ar' || stored === 'en') {
      return stored;
    }
    return undefined;
  },
  cacheUserLanguage(lng: string) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    fallbackLng: 'ar',
    lng: customDetector.lookup() || 'ar',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
    },
  });

export default i18n;
