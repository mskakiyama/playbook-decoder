import { useState, useEffect } from "react";
import { ScheduleHeader } from "@/components/ScheduleHeader";
import { ConferenceAccordion } from "@/components/ConferenceAccordion";
import { useNFLSchedule } from "@/hooks/useNFLSchedule";
import { useTranslatedSchedule } from "@/hooks/useTranslatedSchedule";
import { NFLScheduleAPI } from "@/lib/nfl-schedule-api";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { useNavigate } from "react-router-dom";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Home, Calendar, BookOpen, Trophy, Loader2, RefreshCw } from "lucide-react";
import playerImage from "@/assets/player.svg";
import player2Image from "@/assets/player2.svg";
import { LanguageDropdown } from "@/components/ui/language-dropdown";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function Schedule() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch schedule data
  const { data: scheduleData, isLoading, isError, error, refetch } = useNFLSchedule();
  
  // Translate schedule data
  const { translatedConferences, isTranslating } = useTranslatedSchedule(scheduleData || []);

  const navItems = [
    { name: t('common.home'), url: '/', icon: Home },
    { name: t('common.schedule'), url: '/schedule', icon: Calendar },
    { name: t('standings.title'), url: '/standings', icon: Trophy },
    { name: t('common.glossary'), url: '/glossary', icon: BookOpen }
  ];

  // Automatically clear cache on mount to get fresh data
  useEffect(() => {
    NFLScheduleAPI.clearCache();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Header */}
      <header className="relative h-80 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero backdrop-blur-sm"></div>
        
        {/* Header Controls */}
        <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
          <LanguageDropdown />
          {user ? (
            <Button variant="glass" onClick={signOut} className="shadow-glass">
              {t('common.signOut')}
            </Button>
          ) : (
            <ShimmerButton onClick={() => navigate('/auth')} className="shadow-glass">
              <span className="text-sm font-medium">{t('common.signIn')}</span>
            </ShimmerButton>
          )}
        </div>

        <div className="relative z-10 flex items-center justify-center max-w-4xl mx-auto px-6">
          <img src={playerImage} alt="Football Player" className="hidden sm:block w-20 h-20 md:w-24 md:h-24 object-contain" />
          <div className="text-center mx-8">
            <h1 className="text-3xl sm:text-4xl font-oswald font-bold text-white mb-4 bg-gradient-to-r from-white via-primary-foreground to-field-green bg-clip-text text-transparent leading-tight lg:text-7xl">
              {t('schedule.title')}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 leading-normal">
              {t('schedule.subtitle')}
            </p>
          </div>
          <img src={player2Image} alt="Football Player 2" className="hidden sm:block w-20 h-20 md:w-24 md:h-24 object-contain" />
        </div>
      </header>

      {/* Navigation Menu */}
      <NavBar items={navItems} />

      {/* Header */}
      <div className="mt-2">
        <ScheduleHeader 
          onSearch={setSearchQuery}
          searchQuery={searchQuery}
        />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-4">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">{t('common.loading')}</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-12">
            <div className="bg-destructive/10 backdrop-blur-sm border border-destructive/30 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-destructive mb-2">
                {t('common.error')}
              </h3>
              <p className="text-muted-foreground mb-4">
                Unable to load schedule. Please try again.
              </p>
              <Button 
                onClick={() => refetch()} 
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Schedule Content */}
        {!isLoading && !isError && translatedConferences && (
          <div className="space-y-8">
            {isTranslating && (
              <div className="bg-primary/10 backdrop-blur-sm border border-primary/30 rounded-lg p-3 text-center">
                <p className="text-sm text-primary">Translating schedule data...</p>
              </div>
            )}
            
            {translatedConferences.map((conference) => (
              <ConferenceAccordion
                key={conference.name}
                conference={conference}
                searchQuery={searchQuery}
              />
            ))}

            {/* No Results Message */}
            {searchQuery && 
             translatedConferences.every(conference => 
               conference.divisions.every(division =>
                 !division.teams.some(team =>
                   team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   team.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   team.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
                 )
               )
             ) && (
               <div className="text-center py-12">
                <div className="bg-card/40 backdrop-blur-sm border border-border/30 rounded-lg p-8 max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t('schedule.noTeamsFound')}
                  </h3>
                  <p className="text-muted-foreground">
                    No teams match your search for "{searchQuery}". Try searching by team name, city, or abbreviation.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-card/20 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              Data from{" "}
              <a 
                href="https://www.nfl.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                NFL.com
              </a>
              {" "}– Updated as of September 2025
            </p>
            <p className="text-xs mt-2 opacity-75">
              Regular season schedule subject to change. Check official NFL sources for the most current information.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}