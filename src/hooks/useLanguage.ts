import { useState, useEffect } from 'react';
import { Language } from '../lib/translations';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    // Get saved language from localStorage or default to 'en'
    const saved = localStorage.getItem('language');
    return (saved === 'fr' || saved === 'en') ? saved : 'en';
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(current => current === 'en' ? 'fr' : 'en');
  };

  return {
    language,
    setLanguage,
    toggleLanguage
  };
}