import { useState, useEffect, useMemo } from "react";
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
import { useNFLStandings } from "@/hooks/useNFLStandings";
import { StandingsFilters } from "@/components/StandingsFilters";
import { StandingsTable } from "@/components/StandingsTable";
import { PlayoffPicture } from "@/components/PlayoffPicture";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { NFLStandingsAPI } from "@/lib/nfl-standings-api";

export default function Standings() {
  const { t } = useTranslation();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  
  const [conferenceFilter, setConferenceFilter] = useState("all");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch standings data
  const { data: standingsData, isLoading, isError, refetch } = useNFLStandings();

  const navItems = [
    { name: t('common.home'), url: '/', icon: Home },
    { name: t('common.schedule'), url: '/schedule', icon: Calendar },
    { name: t('standings.title'), url: '/standings', icon: Trophy },
    { name: t('common.glossary'), url: '/glossary', icon: BookOpen }
  ];

  // Clear cache on mount for fresh data
  useEffect(() => {
    NFLStandingsAPI.clearCache();
  }, []);

  // Filter conferences based on filters
  const filteredConferences = useMemo(() => {
    if (!standingsData) return [];

    let conferences = [...standingsData.conferences];

    // Conference filter
    if (conferenceFilter !== "all") {
      conferences = conferences.filter(conf => conf.name === conferenceFilter);
    }

    // Division and search filters
    conferences = conferences.map(conf => ({
      ...conf,
      divisions: conf.divisions
        .filter(div => divisionFilter === "all" || div.name === divisionFilter)
        .map(div => ({
          ...div,
          teams: div.teams.filter(team => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            return (
              team.team.toLowerCase().includes(query) ||
              team.abbreviation.toLowerCase().includes(query)
            );
          })
        }))
        .filter(div => div.teams.length > 0)
    })).filter(conf => conf.divisions.length > 0);

    return conferences;
  }, [standingsData, conferenceFilter, divisionFilter, searchQuery]);

  const hasResults = filteredConferences.length > 0;

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
              {t('standings.title')}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 leading-normal">
              {t('standings.subtitle')}
            </p>
          </div>
          <img src={player2Image} alt="Football Player 2" className="hidden sm:block w-20 h-20 md:w-24 md:h-24 object-contain" />
        </div>
      </header>

      {/* Navigation Menu */}
      <NavBar items={navItems} />

      {/* Filters */}
      <div className="mt-8">
        <StandingsFilters
          conferenceFilter={conferenceFilter}
          divisionFilter={divisionFilter}
          searchQuery={searchQuery}
          onConferenceChange={setConferenceFilter}
          onDivisionChange={setDivisionFilter}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
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
                {t('standings.errorMessage')}
              </p>
              <Button 
                onClick={() => refetch()} 
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {t('standings.retry')}
              </Button>
            </div>
          </div>
        )}

        {/* Standings Content */}
        {!isLoading && !isError && standingsData && (
          <div className="space-y-12">
            {/* Update Info */}
            <div className="text-center text-sm text-muted-foreground">
              <p>
                {t('standings.lastUpdated')}: {standingsData.lastUpdated} • {t('standings.week')} {standingsData.week}
              </p>
            </div>

            {/* No Results Message */}
            {!hasResults && (
              <div className="text-center py-12">
                <div className="bg-card/40 backdrop-blur-sm border border-border/30 rounded-lg p-8 max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t('standings.noResults')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('standings.noResultsMessage')}
                  </p>
                </div>
              </div>
            )}

            {/* Conferences */}
            {hasResults && (
              <Accordion type="multiple" defaultValue={["AFC", "NFC"]} className="space-y-6">
                {filteredConferences.map((conference) => (
                  <AccordionItem
                    key={conference.name}
                    value={conference.name}
                    className="bg-card/20 backdrop-blur-sm border border-border/30 rounded-lg overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full ${
                          conference.name === 'AFC' 
                            ? 'bg-gradient-to-r from-red-500 to-red-600'
                            : 'bg-gradient-to-r from-blue-500 to-blue-600'
                        }`}></div>
                        <span className="font-oswald font-bold text-2xl">{conference.name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="space-y-6">
                        {conference.divisions.map((division) => (
                          <div key={division.name} className="space-y-3">
                            <h3 className="text-lg font-sans font-bold text-foreground flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-primary"></span>
                              {conference.name} {division.name}
                            </h3>
                            <StandingsTable
                              teams={division.teams}
                              divisionName={division.name}
                              conferenceName={conference.name}
                            />
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}

            {/* Playoff Picture */}
            {!isLoading && !isError && standingsData && !searchQuery && conferenceFilter === "all" && divisionFilter === "all" && (
              <div className="mt-16">
                <PlayoffPicture standingsData={standingsData} />
              </div>
            )}

            {/* View Schedule Button */}
            <div className="text-center pt-8">
              <Button
                onClick={() => navigate(`/schedule?week=${standingsData.week}`)}
                className="gap-2"
                size="lg"
              >
                <Calendar className="h-5 w-5" />
                {t('standings.viewSchedule', { week: standingsData.week })}
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-card/20 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              {t('standings.dataSource')}
            </p>
            <p className="text-xs mt-2 opacity-75">
              {t('standings.disclaimer')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
