import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, TrendingDown, Target } from "lucide-react";
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

interface PlayTimelineProps {
  plays: Play[];
  selectedPlay: number;
  onPlaySelect: (index: number) => void;
}

export const PlayTimeline = ({ plays, selectedPlay, onPlaySelect }: PlayTimelineProps) => {
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
    <Card className="p-6 bg-card-glass backdrop-blur-xl border border-white/20 shadow-glass">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-glass-primary rounded-lg backdrop-blur-sm">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-xl font-bold">Play Timeline</h2>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
        {plays.map((play, index) => (
          <div
            key={play.id}
            onClick={() => onPlaySelect(index)}
            className={cn(
              "relative p-4 rounded-xl border cursor-pointer transition-all duration-300 backdrop-blur-lg",
              selectedPlay === index 
                ? "bg-gradient-glass-primary border-primary/50 shadow-glass animate-play-highlight" 
                : "bg-card-glass border-white/10 hover:bg-gradient-glass-secondary hover:shadow-glass"
            )}
          >
            {/* Key Play Indicator */}
            {play.keyPlay && (
              <div className="absolute -left-2 top-4">
                <Target className="h-4 w-4 text-accent animate-pulse" />
              </div>
            )}

            <div className="flex justify-between items-start mb-2">
              <div className="text-sm text-muted-foreground">
                Q{play.quarter} {play.time}
              </div>
              {getResultIcon(play.success)}
            </div>

            <div className="flex justify-between items-center mb-2">
              <Badge className={getPlayTypeColor(play.playType)} variant="secondary">
                {play.playType.toUpperCase()}
              </Badge>
              <div className="text-sm font-semibold">
                {play.down > 0 ? `${play.down}${play.down === 1 ? 'st' : play.down === 2 ? 'nd' : play.down === 3 ? 'rd' : 'th'} & ${play.distance}` : 'KO'}
              </div>
            </div>

            <div className="text-sm font-medium mb-1">
              {play.description}
            </div>

            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{play.yardLine}</span>
              <span className={cn(
                "font-semibold",
                play.yards > 0 ? "text-success-green" : "text-interception-red"
              )}>
                {play.yards > 0 ? `+${play.yards}` : play.yards} yds
              </span>
            </div>

            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {play.result}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};