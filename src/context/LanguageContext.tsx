'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, translations, getBilingualText as getBilingualTextUtil } from '@/lib/i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (keyPath: string, params?: Record<string, string | number>) => string;
  getBilingualText: (field: any, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'us_garment_lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ne'); // Defaulting to Nepali or stored language
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (savedLang === 'en' || savedLang === 'ne') {
        setLanguageState(savedLang);
        document.documentElement.lang = savedLang;
      } else {
        document.documentElement.lang = 'ne';
      }
    } catch (e) {
      console.error('Failed to read language from localStorage:', e);
    } finally {
      setMounted(true);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch (e) {
      console.error('Failed to save language to localStorage:', e);
    }
  }, []);

  const t = useCallback(
    (keyPath: string, params?: Record<string, string | number>): string => {
      const keys = keyPath.split('.');
      let current: any = translations[language];

      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = current[k];
        } else {
          // Fallback to English if missing in Nepali
          let fallbackCurrent: any = translations['en'];
          for (const fk of keys) {
            if (fallbackCurrent && typeof fallbackCurrent === 'object' && fk in fallbackCurrent) {
              fallbackCurrent = fallbackCurrent[fk];
            } else {
              return keyPath;
            }
          }
          current = fallbackCurrent;
          break;
        }
      }

      if (typeof current !== 'string') {
        return keyPath;
      }

      let result = current;
      if (params) {
        Object.entries(params).forEach(([pKey, pValue]) => {
          result = result.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pValue));
        });
      }

      return result;
    },
    [language]
  );

  const getBilingualText = useCallback(
    (field: any, fallback: string = ''): string => {
      return getBilingualTextUtil(field, language, fallback);
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getBilingualText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
