import { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

export const useTranslatedText = (originalText: string) => {
  const [translatedText, setTranslatedText] = useState(originalText);
  const { translate, currentLanguage } = useTranslation();

  useEffect(() => {
    const translateText = async () => {
      if (currentLanguage === 'en') {
        setTranslatedText(originalText);
        return;
      }

      try {
        const result = await translate(originalText);
        setTranslatedText(result);
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslatedText(originalText);
      }
    };

    translateText();
  }, [originalText, currentLanguage, translate]);

  return translatedText;
};