import { useState, useEffect } from "react";
import { GameSelector } from "@/components/GameSelector";
import { PlayTimeline } from "@/components/PlayTimeline";
import { PlayCard } from "@/components/PlayCard";
import { FilterBar } from "@/components/FilterBar";
import { useAllGames, usePlayByPlay } from "@/hooks/useNFLData";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import AuthGuard from "@/components/AuthGuard";
import playerImage from "@/assets/player.svg";
import player2Image from "@/assets/player2.svg";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { useNavigate } from "react-router-dom";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Home, Calendar, BookOpen, Trophy, Loader2 } from "lucide-react";
import { LanguageDropdown } from "@/components/ui/language-dropdown";
import { useTranslation } from "react-i18next";
const IndexContent = () => {
  const { t } = useTranslation();
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedPlay, setSelectedPlay] = useState(0);
  const [playFilter, setPlayFilter] = useState("all");
  const {
    data: games
  } = useAllGames();
  const {
    data: plays,
    isLoading: playsLoading
  } = usePlayByPlay(selectedGame);
  const {
    signOut,
    user
  } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth if this is first visit and not authenticated
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisitedAuth');
    if (!hasVisited && !user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const navItems = [
    { name: t('common.home'), url: '/', icon: Home },
    { name: t('common.schedule'), url: '/schedule', icon: Calendar },
    { name: t('common.glossary'), url: '/glossary', icon: BookOpen }
  ];

  // Set most recent completed game with available play-by-play data as default
  useEffect(() => {
    if (games && games.length > 0 && !selectedGame) {
      // Filter to 2025 season completed games with play-by-play data, prioritize earlier weeks
      const completedGames = games
        .filter(game => {
          const isCompleted = game.quarter === 'Final' || game.quarter === 'F';
          const is2025 = game.season === 2025;
          const hasPlayByPlay = (game as any).playByPlayAvailable !== false; // Include if undefined or true
          return isCompleted && is2025 && hasPlayByPlay;
        })
        .sort((a, b) => {
          // Sort by week first (ascending to prioritize earlier weeks), then by date
          const weekA = parseInt(a.week?.match(/\d+/)?.[0] || '0');
          const weekB = parseInt(b.week?.match(/\d+/)?.[0] || '0');
          if (weekA !== weekB) return weekA - weekB;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      
      if (completedGames.length > 0) {
        // Select the most recent game with available play-by-play data
        setSelectedGame(completedGames[0].id);
        console.log('Selected game:', completedGames[0].homeTeam, 'vs', completedGames[0].awayTeam);
      } else {
        // Fallback to any completed 2025 game if no games with playByPlayAvailable flag
        const fallbackGames = games
          .filter(game => {
            const isCompleted = game.quarter === 'Final' || game.quarter === 'F';
            const is2025 = game.season === 2025;
            return isCompleted && is2025;
          })
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        if (fallbackGames.length > 0) {
          setSelectedGame(fallbackGames[0].id);
          console.log('Fallback selected game:', fallbackGames[0].homeTeam, 'vs', fallbackGames[0].awayTeam);
        }
      }
    }
  }, [games, selectedGame]);

  // Reset selected play when game changes
  useEffect(() => {
    setSelectedPlay(0);
  }, [selectedGame]);

  const filteredPlays = playFilter === "all" ? plays || [] : (plays || []).filter(play => play.playType === playFilter);
  const safeSelectedPlay = Math.min(selectedPlay, Math.max(0, filteredPlays.length - 1));
  return <div className="min-h-screen bg-black">
      {/* Hero Header */}
      <header className="relative h-80 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero backdrop-blur-sm"></div>
        
        {/* Header Controls - Left Side */}
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

        {/* Header Controls - Right Side */}
        <div className="absolute top-6 right-6 z-20">
          <LanguageDropdown />
        </div>

        <div className="relative z-10 flex items-center justify-center max-w-4xl mx-auto px-6">
          <img src={playerImage} alt="Football Player" className="hidden sm:block w-20 h-20 md:w-24 md:h-24 object-contain" />
          <div className="text-center mx-8">
          <h1 className="text-3xl sm:text-4xl font-impact font-bold text-white mb-4 bg-gradient-to-r from-white via-primary-foreground to-field-green bg-clip-text text-transparent leading-tight lg:text-7xl whitespace-nowrap">
            {t('home.title')}
          </h1>
            <p className="text-lg sm:text-xl text-white/90 leading-normal">
              {t('home.subtitle')}
            </p>
          </div>
          <img src={player2Image} alt="Football Player 2" className="hidden sm:block w-20 h-20 md:w-24 md:h-24 object-contain" />
        </div>
      </header>

      {/* Navigation Menu */}
      <NavBar items={navItems} />

      <main className="container mx-auto px-6 py-8 space-y-8 bg-transparent">
        {/* Game Selection & Filters */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <GameSelector selectedGame={selectedGame} onGameChange={setSelectedGame} />
          </div>
          <aside className="h-full">
            <FilterBar activeFilter={playFilter} onFilterChange={setPlayFilter} plays={plays} />
          </aside>
        </section>

        {/* Horizontal Play Timeline - Below Game Selector */}
        <section className="-mx-6">
          {playsLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading plays...</span>
            </div>
          ) : (
            <PlayTimeline plays={filteredPlays} selectedPlay={safeSelectedPlay} onPlaySelect={setSelectedPlay} />
          )}
        </section>

        {/* Play Details */}
        <section className="space-y-8">
          {/* Selected Play Card with Integrated Diagram */}
          {playsLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            filteredPlays.length > 0 && filteredPlays[safeSelectedPlay] && <PlayCard play={filteredPlays[safeSelectedPlay]} expanded={true} />
          )}
        </section>
      </main>
    </div>;
};
const Index = () => {
  return <IndexContent />;
};
export default Index;