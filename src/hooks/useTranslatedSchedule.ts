import { useState, useEffect } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { Team, Conference } from '@/data/nflSchedule';

interface TranslationCache {
  [key: string]: {
    [lang: string]: string;
  };
}

const translationCache: TranslationCache = {};

export const useTranslatedSchedule = (conferences: Conference[]) => {
  const { i18n } = useI18nTranslation();
  const [translatedConferences, setTranslatedConferences] = useState<Conference[]>(conferences);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const translateSchedule = async () => {
      const currentLang = i18n.language;
      
      // If English, return original data
      if (currentLang === 'en') {
        setTranslatedConferences(conferences);
        return;
      }

      setIsTranslating(true);

      try {
        const translated = await Promise.all(
          conferences.map(async (conference) => ({
            ...conference,
            divisions: await Promise.all(
              conference.divisions.map(async (division) => ({
                ...division,
                teams: await Promise.all(
                  division.teams.map(async (team) => ({
                    ...team,
                    name: await translateText(team.name, currentLang),
                    city: await translateText(team.city, currentLang),
                    games: await Promise.all(
                      team.games.map(async game => ({
                        ...game,
                        opponent: game.isBye ? await translateText('BYE WEEK', currentLang, true) : game.opponent
                      }))
                    )
                  }))
                )
              }))
            )
          }))
        );

        setTranslatedConferences(translated);
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslatedConferences(conferences);
      } finally {
        setIsTranslating(false);
      }
    };

    translateSchedule();
  }, [conferences, i18n.language]);

  return { translatedConferences, isTranslating };
};

async function translateText(text: string, targetLang: string, isStatic = false): Promise<string> {
  // Check cache first
  if (translationCache[text]?.[targetLang]) {
    return translationCache[text][targetLang];
  }

  // For simple static translations
  if (isStatic) {
    const staticTranslations: { [key: string]: { [lang: string]: string } } = {
      'BYE WEEK': {
        es: 'SEMANA DE DESCANSO',
        fr: 'SEMAINE DE REPOS',
        de: 'SPIELFREIE WOCHE',
        it: 'SETTIMANA DI RIPOSO',
        pt: 'SEMANA DE FOLGA',
        ja: 'バイウィーク',
        zh: '轮空周'
      }
    };

    const translated = staticTranslations[text]?.[targetLang] || text;
    
    // Cache it
    if (!translationCache[text]) {
      translationCache[text] = {};
    }
    translationCache[text][targetLang] = translated;
    
    return translated;
  }

  // For team/city names, return original for now
  // In a production app, you would call a translation API here
  // For now, we keep English names as they are proper nouns
  return text;
}
