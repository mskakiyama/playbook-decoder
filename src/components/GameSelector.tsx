import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Trophy, Clock } from "lucide-react";

interface GameSelectorProps {
  selectedGame: string;
  onGameChange: (game: string) => void;
}

const mockGames = [
  {
    id: "chiefs-bills",
    homeTeam: "Kansas City Chiefs",
    awayTeam: "Buffalo Bills",
    homeScore: 28,
    awayScore: 24,
    quarter: "Final",
    date: "Dec 10, 2023",
    week: "Week 14"
  },
  {
    id: "cowboys-eagles",
    homeTeam: "Philadelphia Eagles", 
    awayTeam: "Dallas Cowboys",
    homeScore: 31,
    awayScore: 17,
    quarter: "Final",
    date: "Dec 10, 2023",
    week: "Week 14"
  },
  {
    id: "49ers-seahawks",
    homeTeam: "San Francisco 49ers",
    awayTeam: "Seattle Seahawks", 
    homeScore: 21,
    awayScore: 14,
    quarter: "Q4 2:15",
    date: "Dec 10, 2023",
    week: "Week 14"
  }
];

export const GameSelector = ({ selectedGame, onGameChange }: GameSelectorProps) => {
  const currentGame = mockGames.find(game => game.id === selectedGame);

  return (
    <Card className="p-6 bg-gradient-to-r from-card to-card/80 border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="h-5 w-5 text-accent" />
        <h2 className="text-xl font-bold text-foreground">Select Game</h2>
      </div>

      <Select value={selectedGame} onValueChange={onGameChange}>
        <SelectTrigger className="w-full bg-muted/50 border-primary/30">
          <SelectValue placeholder="Choose a game" />
        </SelectTrigger>
        <SelectContent className="bg-card border-primary/30">
          {mockGames.map((game) => (
            <SelectItem key={game.id} value={game.id} className="focus:bg-primary/20">
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
          ))}
        </SelectContent>
      </Select>

      {/* Current Game Display */}
      {currentGame && (
        <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="grid grid-cols-3 items-center text-center">
            <div>
              <div className="font-bold text-lg">{currentGame.awayTeam}</div>
              <div className="text-2xl font-bold text-accent animate-score-pop">
                {currentGame.awayScore}
              </div>
            </div>
            <div className="text-muted-foreground">
              <div className="text-sm">VS</div>
              <div className="font-semibold">{currentGame.quarter}</div>
            </div>
            <div>
              <div className="font-bold text-lg">{currentGame.homeTeam}</div>
              <div className="text-2xl font-bold text-accent animate-score-pop">
                {currentGame.homeScore}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};