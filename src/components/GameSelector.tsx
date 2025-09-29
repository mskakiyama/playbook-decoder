import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Trophy, Clock, Loader2, Calendar } from "lucide-react";
import { useAllGames } from "@/hooks/useNFLData";
import { useState } from "react";

interface GameSelectorProps {
  selectedGame: string;
  onGameChange: (game: string) => void;
}

export const GameSelector = ({ selectedGame, onGameChange }: GameSelectorProps) => {
  const { data: games, isLoading } = useAllGames();
  const [selectedWeek, setSelectedWeek] = useState<string>('all');
  
  const currentGame = games?.find(game => game.id === selectedGame);
  
  // Get unique weeks from 2025 season games, sorted by week number
  const weeks2025 = games
    ?.filter(game => game.season === 2025)
    ?.map(game => game.week)
    .filter((week, index, self) => week && self.indexOf(week) === index)
    .sort((a, b) => {
      // Extract numeric week from strings like "Regular Season Week 1"
      const getWeekNumber = (weekStr: string) => {
        const match = weekStr.match(/Week (\d+)/);
        return match ? parseInt(match[1]) : 0;
      };
      
      // Sort preseason first, then regular season, then playoffs
      const aIsPreseason = a.includes('Preseason');
      const bIsPreseason = b.includes('Preseason');
      const aIsPlayoff = a.includes('Playoff');
      const bIsPlayoff = b.includes('Playoff');
      
      if (aIsPreseason && !bIsPreseason) return -1;
      if (!aIsPreseason && bIsPreseason) return 1;
      if (aIsPlayoff && !bIsPlayoff) return 1;
      if (!aIsPlayoff && bIsPlayoff) return -1;
      
      return getWeekNumber(a) - getWeekNumber(b);
    }) || [];

  // Filter games for 2025 season and selected week
  const filteredGames = games?.filter(game => {
    const seasonMatch = game.season === 2025;
    const weekMatch = selectedWeek === 'all' || game.week === selectedWeek;
    return seasonMatch && weekMatch;
  });

  // Show completed games (games that have already happened)
  const completedGames = filteredGames?.filter(game => 
    game.quarter === 'Final' || game.quarter === 'F'
  );
  
  // Debug logging
  console.log('All games:', games?.length);
  console.log('Filtered games for 2025 season:', filteredGames?.length);
  console.log('Completed games for 2025 season:', completedGames?.length);

  // Find the most current upcoming game for the dropdown label
  const upcomingGame = completedGames?.[0]; // Show first completed game

  return (
    <Card className="p-6 bg-card-glass backdrop-blur-xl border border-white/20 shadow-glass transition-all duration-300 hover:shadow-glass-hover">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-glass-accent rounded-lg backdrop-blur-sm">
          <Trophy className="h-5 w-5 text-accent" />
        </div>
        <h2 className="text-xl font-semibold leading-tight text-foreground">Select Game</h2>
      </div>

      {/* Week Filter */}
      <div className="mb-4 flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Select value={selectedWeek} onValueChange={setSelectedWeek}>
          <SelectTrigger className="bg-muted backdrop-blur-md border border-white/20">
            <SelectValue placeholder="All Weeks" />
          </SelectTrigger>
          <SelectContent className="bg-card-glass backdrop-blur-xl border border-white/20">
            <SelectItem value="all">All Weeks</SelectItem>
            {weeks2025.map(week => (
              <SelectItem key={week} value={week}>{week}</SelectItem>
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
          {completedGames?.map((game, index) => (
            <SelectItem key={`${game.id}-${index}`} value={game.id} className="focus:bg-primary-glass backdrop-blur-sm">
              <div className="flex justify-between items-center w-full">
                <div>
                  <div className="font-semibold">
                    {game.awayTeam} @ {game.homeTeam}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {game.week} • {game.date}
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
              No completed games available for 2025 season
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