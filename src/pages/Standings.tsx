import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Home, Calendar, Trophy, BookOpen } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StandingsFilters } from "@/components/StandingsFilters";
import { StandingsTable } from "@/components/StandingsTable";
import { PlayoffPicture } from "@/components/PlayoffPicture";
import { StandingsRealTimeClock } from "@/components/StandingsRealTimeClock";
import { LiveGamesTicker } from "@/components/LiveGamesTicker";
import { useNFLStandings } from "@/hooks/useNFLStandings";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { useNavigate } from "react-router-dom";
import playerImage from "@/assets/player.svg";
import player2Image from "@/assets/player2.svg";
import { LanguageDropdown } from "@/components/ui/language-dropdown";
import { NFLStandingsAPI } from "@/lib/nfl-standings-api";

const Standings = () => {
  const { t } = useTranslation();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { data: standingsData, isLoading, error, refetch, isRefetching } = useNFLStandings();
  const [conferenceFilter, setConferenceFilter] = useState("all");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pull-to-refresh state
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const startYRef = useRef(0);
  
  const gameTimeStatus = NFLStandingsAPI.isGameTime();
  const liveGames = standingsData?.liveGames || [];

  const navItems = [
    { name: t('common.home'), url: '/', icon: Home },
    { name: t('common.schedule'), url: '/schedule', icon: Calendar },
    { name: t('standings.title'), url: '/standings', icon: Trophy },
    { name: t('common.glossary'), url: '/glossary', icon: BookOpen }
  ];

  // Flatten conferences structure for easier filtering
  const getAllTeams = () => {
    if (!standingsData) return [];
    const allTeams: any[] = [];
    standingsData.conferences.forEach(conf => {
      conf.divisions.forEach(div => {
        div.teams.forEach(team => {
          allTeams.push({
            ...team,
            conference: conf.name,
            division: div.name
          });
        });
      });
    });
    return allTeams;
  };

  const filterTeams = (teams: any[], conference?: string) => {
    return teams.filter(team => {
      const matchesConference = conferenceFilter === "all" || team.conference === conferenceFilter;
      const matchesDivision = divisionFilter === "all" || team.division === divisionFilter;
      const matchesSearch = searchQuery === "" || 
        team.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.abbreviation.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTabConference = !conference || team.conference === conference;
      
      return matchesConference && matchesDivision && matchesSearch && matchesTabConference;
    });
  };

  const getTeamsByDivision = (teams: any[], division: string) => {
    return teams.filter(team => team.division === division);
  };

  const allTeams = getAllTeams();

  // Pull-to-refresh handlers
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY !== 0) return;
      
      const currentY = e.touches[0].clientY;
      const distance = currentY - startYRef.current;
      
      if (distance > 0) {
        setPullDistance(Math.min(distance, 100));
        if (distance > 70) {
          setIsPulling(true);
        }
      }
    };

    const handleTouchEnd = () => {
      if (isPulling) {
        refetch();
      }
      setPullDistance(0);
      setIsPulling(false);
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, refetch]);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Header */}
      <header className="relative h-80 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero backdrop-blur-sm"></div>
        
        {/* Sign In/Out - Top Left */}
        <div className="absolute top-6 left-6 z-20">
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

        {/* Language Dropdown - Top Right */}
        <div className="absolute top-6 right-6 z-20">
          <LanguageDropdown />
        </div>

        {/* Center Content with Player Images */}
        <div className="relative z-10 flex items-center justify-center max-w-4xl mx-auto px-6">
          <img src={playerImage} alt="Football Player" className="hidden sm:block w-20 h-20 md:w-24 md:h-24 object-contain" />
          <div className="text-center mx-8">
            <h1 className="text-3xl sm:text-4xl font-oswald font-bold text-white mb-4 bg-gradient-to-r from-white via-primary-foreground to-field-green bg-clip-text text-transparent leading-tight lg:text-7xl">
              {t('standings.pageTitle')}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 leading-normal flex items-center justify-center gap-2 flex-wrap">
              {standingsData?.week && (
                <Badge variant="outline" className="bg-primary/20 text-primary border-primary/40 font-semibold">
                  Week {standingsData.week}
                </Badge>
              )}
              {gameTimeStatus.isGameDay && (
                <Badge className="bg-red-500/90 text-white border-red-400 animate-pulse font-semibold">
                  🔴 LIVE MODE - 15s Updates
                </Badge>
              )}
              <span>{t('standings.subtitle')}</span>
            </p>
          </div>
          <img src={player2Image} alt="Football Player 2" className="hidden sm:block w-20 h-20 md:w-24 md:h-24 object-contain" />
        </div>
      </header>

      {/* Navigation Menu */}
      <NavBar items={navItems} />

      {/* Pull to Refresh Indicator */}
      {pullDistance > 0 && (
        <div 
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center transition-all"
          style={{ height: `${pullDistance}px` }}
        >
          <div className="text-white text-sm font-medium">
            {isPulling ? '↻ Release to refresh' : '↓ Pull to refresh'}
          </div>
        </div>
      )}

      {/* Live Games Ticker */}
      {liveGames.length > 0 && (
        <div className="bg-black/80 backdrop-blur-sm border-b border-red-500/30">
          <LiveGamesTicker games={liveGames} />
        </div>
      )}

      {/* Update Info Bar */}
      <div className="bg-card/20 backdrop-blur-sm border-b border-border/30 py-3">
        <div className="container mx-auto px-6">
          <StandingsRealTimeClock isRefetching={isRefetching} onRefresh={() => refetch()} />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 bg-transparent">
        {/* Filters */}
        <StandingsFilters
          conferenceFilter={conferenceFilter}
          divisionFilter={divisionFilter}
          searchQuery={searchQuery}
          onConferenceChange={setConferenceFilter}
          onDivisionChange={setDivisionFilter}
          onSearchChange={setSearchQuery}
        />

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription className="flex items-center justify-between">
              <span>{t('standings.errorLoading')}</span>
              <Button onClick={() => refetch()} variant="outline" size="sm">
                {t('standings.retryLoad')}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-6">
            <Skeleton className="h-[600px] w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        )}

        {/* Standings Tables */}
        {!isLoading && standingsData && (
          <div className="space-y-8">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="all">{t('standings.allConferences')}</TabsTrigger>
                <TabsTrigger value="AFC">AFC</TabsTrigger>
                <TabsTrigger value="NFC">NFC</TabsTrigger>
              </TabsList>

              {/* All Conferences */}
              <TabsContent value="all" className="space-y-8">
                {/* AFC */}
                <div className="space-y-6">
                  <h2 className="text-3xl font-oswald font-bold text-primary">
                    AFC
                  </h2>
                  <div className="grid gap-6 lg:grid-cols-2">
                  {['North', 'South', 'East', 'West'].map(division => {
                      const teams = filterTeams(getTeamsByDivision(allTeams, division), 'AFC');
                      if (teams.length === 0) return null;
                      return (
                        <StandingsTable
                          key={`AFC-${division}`}
                          teams={teams}
                          divisionName={division}
                          conferenceName="AFC"
                          liveGames={liveGames}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* NFC */}
                <div className="space-y-6">
                  <h2 className="text-3xl font-oswald font-bold text-primary">
                    NFC
                  </h2>
                  <div className="grid gap-6 lg:grid-cols-2">
                  {['North', 'South', 'East', 'West'].map(division => {
                      const teams = filterTeams(getTeamsByDivision(allTeams, division), 'NFC');
                      if (teams.length === 0) return null;
                      return (
                        <StandingsTable
                          key={`NFC-${division}`}
                          teams={teams}
                          divisionName={division}
                          conferenceName="NFC"
                          liveGames={liveGames}
                        />
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              {/* AFC Only */}
              <TabsContent value="AFC">
                <div className="grid gap-6 lg:grid-cols-2">
                  {['North', 'South', 'East', 'West'].map(division => {
                    const teams = filterTeams(getTeamsByDivision(allTeams, division), 'AFC');
                    if (teams.length === 0) return null;
                    return (
                      <StandingsTable
                        key={`AFC-${division}`}
                        teams={teams}
                        divisionName={division}
                        conferenceName="AFC"
                        liveGames={liveGames}
                      />
                    );
                  })}
                </div>
              </TabsContent>

              {/* NFC Only */}
              <TabsContent value="NFC">
                <div className="grid gap-6 lg:grid-cols-2">
                  {['North', 'South', 'East', 'West'].map(division => {
                    const teams = filterTeams(getTeamsByDivision(allTeams, division), 'NFC');
                    if (teams.length === 0) return null;
                    return (
                      <StandingsTable
                        key={`NFC-${division}`}
                        teams={teams}
                        divisionName={division}
                        conferenceName="NFC"
                        liveGames={liveGames}
                      />
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>

            {/* Playoff Picture */}
            <div className="mt-12">
              <PlayoffPicture standingsData={standingsData} />
            </div>
          </div>
        )}

        {/* No Results */}
        {!isLoading && standingsData && 
         filterTeams(allTeams).length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('standings.noResults')}</p>
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
                href="https://www.espn.com/nfl/standings" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                ESPN
              </a>
              {" "}– Updated as of 2025-2026 Season
            </p>
            <p className="text-xs mt-2 opacity-75">
              Standings update every 30 seconds during game season. Check official NFL sources for the most current information.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Standings;
