import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Home, Calendar, Trophy, BookOpen } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StandingsFilters } from "@/components/StandingsFilters";
import { StandingsTable } from "@/components/StandingsTable";
import { PlayoffPicture } from "@/components/PlayoffPicture";
import { StandingsRealTimeClock } from "@/components/StandingsRealTimeClock";
import { useNFLStandings } from "@/hooks/useNFLStandings";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const Standings = () => {
  const { t } = useTranslation();
  const { data: standingsData, isLoading, error, refetch, isRefetching } = useNFLStandings();
  const [conferenceFilter, setConferenceFilter] = useState("all");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-background/95 via-background/98 to-background/95 border-b border-border/40">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent" style={{ fontFamily: 'Oswald, sans-serif' }}>
                {t('standings.pageTitle')}
              </h1>
              <p className="text-muted-foreground mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {t('standings.subtitle')}
              </p>
            </div>
            <StandingsRealTimeClock 
              isRefetching={isRefetching} 
              onRefresh={() => refetch()} 
            />
          </div>
          <NavBar items={navItems} />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
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
                  <h2 className="text-3xl font-bold text-primary" style={{ fontFamily: 'Oswald, sans-serif' }}>
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
                        />
                      );
                    })}
                  </div>
                </div>

                {/* NFC */}
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-primary" style={{ fontFamily: 'Oswald, sans-serif' }}>
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
      <footer className="mt-16 py-8 border-t border-border/40">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>{t('standings.dataSource')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Standings;
