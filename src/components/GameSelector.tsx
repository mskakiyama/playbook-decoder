import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Trophy, Clock, Loader2 } from "lucide-react";
import { useNFLScoreboard } from "@/hooks/useNFLData";

interface GameSelectorProps {
  selectedGame: string;
  onGameChange: (game: string) => void;
}

export const GameSelector = ({ selectedGame, onGameChange }: GameSelectorProps) => {
  const { data: games, isLoading, error } = useNFLScoreboard();
  
  const currentGame = games?.find(game => game.id === selectedGame);

  if (error) {
    console.error('Failed to load games:', error);
  }

  return (
    <Card className="p-6 bg-card-glass backdrop-blur-xl border border-white/20 shadow-glass transition-all duration-300 hover:shadow-glass-hover">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-glass-accent rounded-lg backdrop-blur-sm">
          <Trophy className="h-5 w-5 text-accent" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Select Game</h2>
      </div>

      <Select value={selectedGame} onValueChange={onGameChange} disabled={isLoading}>
        <SelectTrigger className="w-full bg-muted backdrop-blur-md border border-white/20 hover:bg-primary-glass transition-all duration-300">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading games...</span>
            </div>
          ) : (
            <SelectValue placeholder="Choose a game" />
          )}
        </SelectTrigger>
        <SelectContent className="bg-card-glass backdrop-blur-xl border border-white/20">
          {games?.map((game) => (
            <SelectItem key={game.id} value={game.id} className="focus:bg-primary-glass backdrop-blur-sm">
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