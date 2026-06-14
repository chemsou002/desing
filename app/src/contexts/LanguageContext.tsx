import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import i18n from '@/i18n';

interface LanguageContextType {
  currentLang: string;
  direction: 'rtl' | 'ltr';
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLang: 'ar',
  direction: 'rtl',
  setLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(i18n.language || 'ar');
  const direction = currentLang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = currentLang;
  }, [direction, currentLang]);

  const setLanguage = useCallback((lang: string) => {
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLang, direction, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
