import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '@/components/ui/tubelight-navbar';
import {
  Home,
  Calendar,
  BookOpen,
  Trophy,
  Loader2,
  RefreshCw,
  Activity,
} from 'lucide-react';
import playerImage from '@/assets/player.svg';
import player2Image from '@/assets/player2.svg';
import { LanguageDropdown } from '@/components/ui/language-dropdown';
import { useTranslation } from 'react-i18next';
import { useNFLStandings } from '@/hooks/useNFLStandings';
import { StandingsFilters } from '@/components/StandingsFilters';
import { PlayoffPicture } from '@/components/PlayoffPicture';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { NFLStandingsAPI } from '@/lib/nfl-standings-api';
import { LiveGamesTicker } from '@/components/LiveGamesTicker';
import { AdvancedStandingsTable } from '@/components/AdvancedStandingsTable';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { RealTimeStandingsAPI, TeamAnalytics } from '@/lib/real-time-standings-api';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export default function StandingsRealtime() {
  const { t } = useTranslation();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const [conferenceFilter, setConferenceFilter] = useState('all');
  const [divisionFilter, setDivisionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'visual'>('table');

  // Fetch standings data
  const { data: standingsData, isLoading, isError, refetch } = useNFLStandings();

  // Real-time updates
  const { liveGames, lastUpdated, updateCount, refreshNow, getTimeSinceUpdate } = useRealTimeUpdates(true);

  const navItems = [
    { name: t('common.home'), url: '/', icon: Home },
    { name: t('common.schedule'), url: '/schedule', icon: Calendar },
    { name: t('standings.title'), url: '/standings', icon: Trophy },
    { name: t('common.glossary'), url: '/glossary', icon: BookOpen },
  ];

  // Clear cache on mount for fresh data
  useEffect(() => {
    NFLStandingsAPI.clearCache();
  }, []);

  // Generate analytics for all teams
  const enhancedConferences = useMemo(() => {
    if (!standingsData) return [];

    return standingsData.conferences.map((conf) => ({
      ...conf,
      divisions: conf.divisions.map((div) => ({
        ...div,
        teams: div.teams.map((team) =>
          RealTimeStandingsAPI.generateTeamAnalytics(team, liveGames)
        ),
      })),
    }));
  }, [standingsData, liveGames, updateCount]);

  // Filter conferences based on filters
  const filteredConferences = useMemo(() => {
    if (!enhancedConferences) return [];

    let conferences = [...enhancedConferences];

    // Conference filter
    if (conferenceFilter !== 'all') {
      conferences = conferences.filter((conf) => conf.name === conferenceFilter);
    }

    // Division and search filters
    conferences = conferences
      .map((conf) => ({
        ...conf,
        divisions: conf.divisions
          .filter((div) => divisionFilter === 'all' || div.name === divisionFilter)
          .map((div) => ({
            ...div,
            teams: div.teams.filter((team) => {
              if (!searchQuery) return true;
              const query = searchQuery.toLowerCase();
              return (
                team.team.toLowerCase().includes(query) ||
                team.abbreviation.toLowerCase().includes(query)
              );
            }),
          }))
          .filter((div) => div.teams.length > 0),
      }))
      .filter((conf) => conf.divisions.length > 0);

    return conferences;
  }, [enhancedConferences, conferenceFilter, divisionFilter, searchQuery]);

  const hasResults = filteredConferences.length > 0;
  const liveGameCount = liveGames.filter((g) => g.status === 'LIVE').length;

  const handleRefresh = () => {
    refreshNow();
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Live Games Ticker */}
      {liveGameCount > 0 && <LiveGamesTicker games={liveGames} />}

      {/* Hero Header */}
      <header className="relative h-80 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero backdrop-blur-sm">
          {/* Animated neon grid background */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(hsl(var(--neon-cyan)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-cyan)) 1px, transparent 1px)',
                backgroundSize: '50px 50px',
              }}
            />
          </div>
        </div>

        {/* Header Controls - Left Side */}
        <div className="absolute top-6 left-6 z-20">
          {user ? (
            <Button variant="outline" onClick={signOut} className="border-neon-cyan/40 hover:bg-neon-cyan/10">
              {t('common.signOut')}
            </Button>
          ) : (
            <ShimmerButton onClick={() => navigate('/auth')}>
              <span className="text-sm font-medium">{t('common.signIn')}</span>
            </ShimmerButton>
          )}
        </div>

        {/* Header Controls - Right Side */}
        <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
          <LanguageDropdown />
          {/* Live Indicator */}
          {liveGameCount > 0 && (
            <Badge className="bg-neon-green/20 text-neon-green border-neon-green/40 animate-pulse-neon px-3 py-1.5">
              <Activity className="w-3 h-3 mr-1.5 animate-pulse" />
              {liveGameCount} LIVE
            </Badge>
          )}
        </div>

        <div className="relative z-10 flex items-center justify-center max-w-4xl mx-auto px-6">
          <img
            src={playerImage}
            alt="Football Player"
            className="hidden sm:block w-20 h-20 md:w-24 md:h-24 object-contain"
          />
          <div className="text-center mx-8">
            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-oswald font-bold mb-4 bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-pink bg-clip-text text-transparent leading-tight uppercase">
              LIVE NFL STANDINGS & ANALYTICS
            </h1>
            <p className="text-lg sm:text-xl text-foreground/90 leading-normal">
              Real-Time Updates • Advanced Metrics • Playoff Tracking
            </p>
          </div>
          <img
            src={player2Image}
            alt="Football Player 2"
            className="hidden sm:block w-20 h-20 md:w-24 md:h-24 object-contain"
          />
        </div>
      </header>

      {/* Navigation Menu */}
      <NavBar items={navItems} />

      {/* Update Info Bar */}
      <div className="bg-card-glass backdrop-blur-md border-b border-border/30 py-3">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse-neon" />
              <span className="text-sm text-muted-foreground">
                Updated <span className="text-neon-cyan font-mono">{getTimeSinceUpdate()}</span>
              </span>
            </div>
            {standingsData && (
              <span className="text-sm text-muted-foreground">
                Week <span className="font-mono font-bold text-foreground">{standingsData.week}</span> • 2024-2025 Season
              </span>
            )}
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="gap-2 border-neon-cyan/40 hover:bg-neon-cyan/10"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="container mx-auto px-6 pt-6">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
          <TabsList className="bg-card-glass backdrop-blur-md border border-neon-cyan/20">
            <TabsTrigger value="table" className="data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan">
              <Trophy className="w-4 h-4 mr-2" />
              Table View
            </TabsTrigger>
            <TabsTrigger value="visual" className="data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan">
              <Activity className="w-4 h-4 mr-2" />
              Visual Analytics
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Filters */}
      <div className="mt-6">
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
            <div className="relative">
              <Loader2 className="h-16 w-16 animate-spin text-neon-cyan" />
              <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-neon-pink blur-sm" />
            </div>
            <p className="text-lg text-muted-foreground mt-6">{t('common.loading')}</p>
            <p className="text-sm text-neon-cyan mt-2">Fetching real-time data...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-12">
            <div className="bg-card-glass backdrop-blur-md border border-interception-red/30 rounded-lg p-8 max-w-md mx-auto shadow-neon-pink">
              <h3 className="text-xl font-semibold text-interception-red mb-2">{t('common.error')}</h3>
              <p className="text-muted-foreground mb-4">{t('standings.errorMessage')}</p>
              <Button onClick={handleRefresh} variant="outline" className="gap-2 border-neon-cyan/40">
                <RefreshCw className="h-4 w-4" />
                {t('standings.retry')}
              </Button>
            </div>
          </div>
        )}

        {/* Standings Content */}
        {!isLoading && !isError && standingsData && (
          <div className="space-y-12">
            {/* No Results Message */}
            {!hasResults && (
              <div className="text-center py-12">
                <div className="bg-card-glass backdrop-blur-md border border-border/30 rounded-lg p-8 max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{t('standings.noResults')}</h3>
                  <p className="text-muted-foreground">{t('standings.noResultsMessage')}</p>
                </div>
              </div>
            )}

            {/* Conferences */}
            {hasResults && (
              <Accordion type="multiple" defaultValue={['AFC', 'NFC']} className="space-y-6">
                {filteredConferences.map((conference) => (
                  <AccordionItem
                    key={conference.name}
                    value={conference.name}
                    className="bg-card-glass backdrop-blur-md border border-neon-cyan/20 rounded-lg overflow-hidden shadow-glass"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-neon-cyan/5">
                      <div className="flex items-center space-x-4">
                        <div
                          className={cn(
                            'w-4 h-4 rounded-full shadow-neon-cyan',
                            conference.name === 'AFC'
                              ? 'bg-gradient-to-r from-interception-red to-neon-pink'
                              : 'bg-gradient-to-r from-neon-blue to-neon-cyan'
                          )}
                        />
                        <span className="font-oswald font-bold text-2xl uppercase tracking-wider">
                          {conference.name}
                        </span>
                        {conference.divisions.some((div) => div.teams.some((t) => t.isLive)) && (
                          <Badge className="bg-neon-green/20 text-neon-green border-neon-green/40 animate-pulse-neon">
                            LIVE
                          </Badge>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="space-y-8">
                        {conference.divisions.map((division) => (
                          <div key={division.name} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-oswald font-bold text-foreground flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-neon-cyan shadow-neon-cyan" />
                                {conference.name} {division.name}
                              </h3>
                              {division.teams.some((t) => t.isLive) && (
                                <Badge
                                  variant="outline"
                                  className="bg-neon-green/10 text-neon-green border-neon-green/40 animate-pulse-neon"
                                >
                                  <Activity className="w-3 h-3 mr-1" />
                                  LIVE
                                </Badge>
                              )}
                            </div>
                            <AdvancedStandingsTable
                              teams={division.teams as TeamAnalytics[]}
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
            {!isLoading &&
              !isError &&
              standingsData &&
              !searchQuery &&
              conferenceFilter === 'all' &&
              divisionFilter === 'all' && (
                <div className="mt-16">
                  <PlayoffPicture standingsData={standingsData} />
                </div>
              )}

            {/* View Schedule Button */}
            <div className="text-center pt-8">
              <Button
                onClick={() => navigate(`/schedule?week=${standingsData.week}`)}
                className="gap-2 bg-gradient-to-r from-neon-cyan to-neon-blue hover:shadow-neon-cyan transition-all"
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
      <footer className="border-t border-neon-cyan/20 bg-card-glass backdrop-blur-md mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-muted-foreground space-y-2">
            <p className="text-sm flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse-neon" />
              Real-time data powered by ESPN API
            </p>
            <p className="text-xs opacity-75">
              Updates automatically every 30-60 seconds during live games
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
