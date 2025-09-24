import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TranslationContextType {
  currentLanguage: string;
  changeLanguage: (languageCode: string) => void;
  translate: (text: string, targetLang?: string) => Promise<string>;
  isTranslating: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

interface TranslationProviderProps {
  children: React.ReactNode;
}

// Cache for translations to avoid repeated API calls
const translationCache = new Map<string, string>();

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  const translate = async (text: string, targetLang?: string): Promise<string> => {
    const target = targetLang || currentLanguage;
    
    // If target is English or same as current, return original text
    if (target === 'en' || !text.trim()) {
      return text;
    }

    // Check cache first
    const cacheKey = `${text}:${target}`;
    const cached = translationCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      setIsTranslating(true);
      
      const { data, error } = await supabase.functions.invoke('translate', {
        body: {
          text,
          targetLanguage: target,
          sourceLanguage: 'en'
        }
      });

      if (error) {
        console.error('Translation error:', error);
        return text; // Return original text on error
      }

      const translatedText = data?.translatedText || text;
      
      // Cache the translation
      translationCache.set(cacheKey, translatedText);
      
      return translatedText;
    } catch (error) {
      console.error('Translation failed:', error);
      return text; // Return original text on error
    } finally {
      setIsTranslating(false);
    }
  };

  const changeLanguage = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('selectedLanguage', languageCode);
  };

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const value: TranslationContextType = {
    currentLanguage,
    changeLanguage,
    translate,
    isTranslating,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};