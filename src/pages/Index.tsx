import { useState, useEffect } from "react";
import { GameSelector } from "@/components/GameSelector";
import { PlayTimeline } from "@/components/PlayTimeline";
import { PlayDiagram } from "@/components/PlayDiagram";
import { PlayCard } from "@/components/PlayCard";
import { FilterBar } from "@/components/FilterBar";
import { PlaysGrid } from "@/components/PlaysGrid";
import { useAllGames, usePlayByPlay } from "@/hooks/useNFLData";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import AuthGuard from "@/components/AuthGuard";
import playerImage from "@/assets/player.svg";
import player2Image from "@/assets/player2.svg";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { useNavigate } from "react-router-dom";
const IndexContent = () => {
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedPlay, setSelectedPlay] = useState(0);
  const [playFilter, setPlayFilter] = useState("all");
  const {
    data: games
  } = useAllGames();
  const {
    data: plays
  } = usePlayByPlay(selectedGame);
  const {
    signOut,
    user
  } = useAuth();
  const navigate = useNavigate();

  // Set first game as default when games load
  useEffect(() => {
    if (games && games.length > 0 && !selectedGame) {
      setSelectedGame(games[0].id);
    }
  }, [games, selectedGame]);
  const filteredPlays = playFilter === "all" ? plays || [] : (plays || []).filter(play => play.playType === playFilter);
  return <div className="min-h-screen bg-gradient-background">
      {/* Hero Header */}
      <header className="relative h-80 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero backdrop-blur-sm"></div>
        
        {/* Auth Button */}
        <div className="absolute top-6 right-6 z-20">
          {user ? (
            <Button variant="glass" onClick={signOut} className="shadow-glass">
              Sign Out
            </Button>
          ) : (
            <ShimmerButton onClick={() => navigate('/auth')} className="shadow-glass">
              <span className="text-sm font-medium">Sign In</span>
            </ShimmerButton>
          )}
        </div>

        <div className="relative z-10 flex items-center justify-center max-w-4xl mx-auto px-6">
          <img src={playerImage} alt="Football Player" className="hidden sm:block w-20 h-20 md:w-24 md:h-24 object-contain" />
          <div className="text-center mx-8">
          <h1 className="text-3xl sm:text-4xl font-oswald font-bold text-white mb-4 bg-gradient-to-r from-white via-primary-foreground to-field-green bg-clip-text text-transparent leading-tight lg:text-7xl">
            NFL Plays Breakdown
          </h1>
            <p className="text-lg sm:text-xl text-white/90 leading-normal">
              Deep dive into every play with interactive analysis
            </p>
          </div>
          <img src={player2Image} alt="Football Player 2" className="hidden sm:block w-20 h-20 md:w-24 md:h-24 object-contain" />
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Game Selection & Filters */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <GameSelector selectedGame={selectedGame} onGameChange={setSelectedGame} />
            
            {/* All Plays Grid - Shows when "All Plays" filter is selected */}
            {playFilter === "all" && <PlaysGrid plays={filteredPlays} onPlaySelect={setSelectedPlay} />}
          </div>
          <aside className="space-y-8">
            <FilterBar activeFilter={playFilter} onFilterChange={setPlayFilter} plays={plays} />
          </aside>
        </section>

        {/* Main Content Grid - Hidden when All Plays is selected */}
        {playFilter !== "all" && <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Play Timeline */}
            <aside className="xl:col-span-1">
              <PlayTimeline plays={filteredPlays} selectedPlay={selectedPlay} onPlaySelect={setSelectedPlay} />
            </aside>

            {/* Play Details & Diagram */}
            <div className="xl:col-span-2 space-y-8">
              {/* Selected Play Card */}
              {filteredPlays.length > 0 && filteredPlays[selectedPlay] && <PlayCard play={filteredPlays[selectedPlay]} expanded={true} />}

              {/* Interactive Play Diagram */}
              <PlayDiagram play={filteredPlays[selectedPlay]} />
            </div>
          </section>}
      </main>
    </div>;
};
const Index = () => {
  return <IndexContent />;
};
export default Index;