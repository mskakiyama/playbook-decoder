import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Trophy, Clock, Loader2, Filter } from "lucide-react";
import { useAllGames } from "@/hooks/useNFLData";
import { useState } from "react";

interface GameSelectorProps {
  selectedGame: string;
  onGameChange: (game: string) => void;
}

export const GameSelector = ({ selectedGame, onGameChange }: GameSelectorProps) => {
  const { data: games, isLoading } = useAllGames();
  const [selectedSeason, setSelectedSeason] = useState<string>(new Date().getFullYear().toString());
  const [selectedType, setSelectedType] = useState<string>('all');
  
  const currentGame = games?.find(game => game.id === selectedGame);
  const currentYear = new Date().getFullYear();

  // Get past 5 seasons including current year
  const pastFiveYears = Array.from({length: 5}, (_, i) => currentYear - i);
  const availableSeasons = [...new Set(games?.map(game => game.season))].sort((a, b) => b - a);
  const seasons = pastFiveYears;
  const seasonTypes = [...new Set(games?.map(game => game.seasonType))];

  // Filter games based on selected season and type
  const filteredGames = games?.filter(game => {
    const seasonMatch = game.season.toString() === selectedSeason;
    const typeMatch = selectedType === 'all' || game.seasonType === selectedType;
    return seasonMatch && typeMatch;
  });

  // Show completed games (games that have already happened)
  const completedGames = filteredGames?.filter(game => 
    game.quarter === 'Final' || game.quarter === 'F'
  );
  
  // Debug logging
  console.log('All games:', games?.length);
  console.log('Selected season:', selectedSeason);
  console.log('Filtered games for season:', filteredGames?.length);
  console.log('Completed games for season:', completedGames?.length);

  // Find the most current upcoming game for the dropdown label
  const upcomingGame = completedGames?.[0]; // Show first completed game

  return (
    <Card className="p-6 bg-card-glass backdrop-blur-xl border border-white/20 shadow-glass transition-all duration-300 hover:shadow-glass-hover">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-glass-accent rounded-lg backdrop-blur-sm">
          <Trophy className="h-5 w-5 text-accent" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Select Game</h2>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Select value={selectedSeason} onValueChange={setSelectedSeason}>
          <SelectTrigger className="bg-muted backdrop-blur-md border border-white/20">
            <SelectValue placeholder="All Seasons" />
          </SelectTrigger>
          <SelectContent className="bg-card-glass backdrop-blur-xl border border-white/20">
            {seasons.map(season => (
              <SelectItem key={season} value={season.toString()}>{season}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="bg-muted backdrop-blur-md border border-white/20">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="bg-card-glass backdrop-blur-xl border border-white/20">
            <SelectItem value="all">All Types</SelectItem>
            {seasonTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Select value={selectedGame} onValueChange={onGameChange} disabled={isLoading}>
        <SelectTrigger className="w-full bg-muted backdrop-blur-md border border-white/20 hover:bg-primary-glass transition-all duration-300">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading games...</span>
            </div>
          ) : upcomingGame ? (
            <div className="flex justify-between items-center w-full">
              <div>
                <div className="font-semibold">
                  {upcomingGame.awayTeam} @ {upcomingGame.homeTeam}
                </div>
                <div className="text-sm text-muted-foreground">
                  {upcomingGame.week} • {upcomingGame.date}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">
                  {upcomingGame.awayScore} - {upcomingGame.homeScore}
                </div>
              </div>
            </div>
          ) : (
            <SelectValue placeholder="Choose a game" />
          )}
        </SelectTrigger>
        <SelectContent className="bg-card-glass backdrop-blur-xl border border-white/20 max-h-96">
          {completedGames?.map((game) => (
            <SelectItem key={game.id} value={game.id} className="focus:bg-primary-glass backdrop-blur-sm">
              <div className="flex justify-between items-center w-full">
                <div>
                  <div className="font-semibold">
                    {game.awayTeam} @ {game.homeTeam}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {game.week} • {game.date} • {game.season}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {game.awayScore} - {game.homeScore}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {game.quarter}
                  </div>
                </div>
              </div>
            </SelectItem>
          )) || []}
          {(!completedGames || completedGames.length === 0) && (
            <div className="p-4 text-center text-muted-foreground">
              No completed games available for this season
            </div>
          )}
        </SelectContent>
      </Select>

      {/* Current Game Display */}
      {currentGame && (
        <div className="mt-6 p-4 bg-gradient-glass-primary backdrop-blur-md rounded-xl border border-white/20 shadow-glass">
          <div className="grid grid-cols-3 items-center text-center">
            <div>
              <div className="font-bold text-lg">{currentGame.awayTeam}</div>
              <div className="text-2xl font-bold text-accent animate-score-pop bg-gradient-to-r from-accent to-touchdown-gold bg-clip-text text-transparent">
                {currentGame.awayScore}
              </div>
            </div>
            <div className="text-muted-foreground">
              <div className="text-sm">VS</div>
              <div className="font-semibold">{currentGame.quarter}</div>
            </div>
            <div>
              <div className="font-bold text-lg">{currentGame.homeTeam}</div>
              <div className="text-2xl font-bold text-accent animate-score-pop bg-gradient-to-r from-accent to-touchdown-gold bg-clip-text text-transparent">
                {currentGame.homeScore}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};