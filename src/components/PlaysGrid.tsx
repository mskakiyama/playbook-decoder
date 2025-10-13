import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, TrendingDown, Target, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Play {
  id: number;
  quarter: number;
  time: string;
  down: number;
  distance: number;
  yardLine: string;
  playType: string;
  result: string;
  description: string;
  players: string[];
  yards: number;
  success: boolean;
  keyPlay: boolean;
}

interface PlaysGridProps {
  plays: Play[];
  onPlaySelect: (index: number) => void;
}

export const PlaysGrid = ({ plays, onPlaySelect }: PlaysGridProps) => {
  const getPlayTypeColor = (type: string) => {
    switch (type) {
      case "passing": return "bg-primary text-primary-foreground";
      case "rushing": return "bg-success-green text-white";
      case "special": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getResultIcon = (success: boolean) => {
    return success ? (
      <TrendingUp className="h-4 w-4 text-success-green" />
    ) : (
      <TrendingDown className="h-4 w-4 text-interception-red" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Clock className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">All Plays ({plays.length})</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plays.map((play, index) => (
          <Card
            key={play.id}
            onClick={() => onPlaySelect(index)}
            className={cn(
              "relative p-4 cursor-pointer bg-card-glass backdrop-blur-lg border border-white/20 shadow-glass",
              "transition-all duration-300 hover:shadow-glass-hover hover:scale-105 hover:bg-gradient-glass-primary"
            )}
          >
            {/* Key Play Indicator */}
            {play.keyPlay && (
              <div className="absolute -top-2 -right-2">
                <Target className="h-5 w-5 text-accent animate-pulse bg-background rounded-full p-1" />
              </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <Badge className={getPlayTypeColor(play.playType)} variant="secondary">
                  {play.playType.toUpperCase()}
                </Badge>
                {getResultIcon(play.success)}
              </div>
              <div className="text-sm text-muted-foreground">
                Q{play.quarter} {play.time}
              </div>
            </div>

            {/* Down and Distance */}
            <div className="flex justify-between items-center mb-3">
              <div className="text-sm font-semibold">
                {play.down > 0 ? `${play.down}${play.down === 1 ? 'st' : play.down === 2 ? 'nd' : play.down === 3 ? 'rd' : 'th'} & ${play.distance}` : 'Kickoff'}
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                {play.yardLine}
              </div>
            </div>

            {/* Description */}
            <div className="text-sm font-medium mb-3 line-clamp-2">
              {play.description}
            </div>

            {/* Players */}
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-3 w-3 text-muted-foreground" />
              <div className="text-xs text-muted-foreground truncate">
                {play.players.join(", ")}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="text-xs">
                {play.result}
              </Badge>
              <span className={cn(
                "text-sm font-semibold",
                play.yards > 0 ? "text-success-green" : "text-interception-red"
              )}>
                {play.yards > 0 ? `+${play.yards}` : play.yards} yds
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};