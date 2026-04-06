import { createContext, useState } from 'react';
import { translations } from '../utils/i18n';

export const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('bicgn_lang') || 'fr');

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('bicgn_lang', newLang);
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[lang];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
