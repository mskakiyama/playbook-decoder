import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Users, 
  Clock, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Star,
  Share2
} from "lucide-react";
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

interface PlayCardProps {
  play: Play;
  expanded?: boolean;
}

export const PlayCard = ({ play, expanded = false }: PlayCardProps) => {
  if (!play) return null;

  const getSuccessRate = () => {
    // Mock success rate calculation based on play result
    if (play.result === "Touchdown") return 95;
    if (play.result === "First Down") return 85;
    if (play.result === "Interception") return 15;
    if (play.yards > 0) return 70;
    return 45;
  };

  const getPlayTypeDetails = () => {
    switch (play.playType) {
      case "passing":
        return {
          icon: <Target className="h-4 w-4" />,
          color: "bg-primary",
          analysis: "Air raid attack targeting intermediate routes with quick release timing."
        };
      case "rushing":
        return {
          icon: <TrendingUp className="h-4 w-4" />,
          color: "bg-success-green", 
          analysis: "Power ground game utilizing gap schemes and lead blocking concepts."
        };
      default:
        return {
          icon: <Star className="h-4 w-4" />,
          color: "bg-accent",
          analysis: "Special teams execution focusing on field position and coverage."
        };
    }
  };

  const playDetails = getPlayTypeDetails();
  const successRate = getSuccessRate();

  return (
    <Card className={cn(
      "p-6 bg-card-glass backdrop-blur-xl border border-white/20 shadow-glass transition-all duration-300 hover:shadow-glass-hover",
      play.keyPlay && "border-accent/60 shadow-[0_0_30px_hsl(var(--accent)/0.3)]",
      expanded && "bg-gradient-glass-primary"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg text-white backdrop-blur-sm border border-white/20", playDetails.color)}>
            {playDetails.icon}
          </div>
          <div>
            <h3 className="text-xl font-semibold flex items-center gap-2 leading-tight">
              {play.description}
              {play.keyPlay && <Star className="h-4 w-4 text-accent animate-pulse" />}
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Q{play.quarter} {play.time}
              </span>
              <span>{play.yardLine}</span>
              <span>
                {play.down > 0 ? `${play.down}${play.down === 1 ? 'st' : play.down === 2 ? 'nd' : play.down === 3 ? 'rd' : 'th'} & ${play.distance}` : 'Kickoff'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            className={cn(
              "font-semibold",
              play.success ? "bg-success-green" : "bg-interception-red"
            )}
          >
            {play.result}
          </Badge>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Play Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gradient-glass-secondary backdrop-blur-lg rounded-xl border border-white/10">
          <div className={cn(
            "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
            play.yards > 0 ? "from-success-green to-field-green" : "from-interception-red to-accent"
          )}>
            {play.yards > 0 ? `+${play.yards}` : play.yards}
          </div>
          <div className="text-xs text-muted-foreground">Yards</div>
        </div>
        <div className="text-center p-3 bg-gradient-glass-primary backdrop-blur-lg rounded-xl border border-white/10">
          <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {successRate}%
          </div>
          <div className="text-xs text-muted-foreground">Success Rate</div>
        </div>
        <div className="text-center p-3 bg-gradient-glass-accent backdrop-blur-lg rounded-xl border border-white/10">
          <div className="text-2xl font-bold bg-gradient-to-r from-field-green to-touchdown-gold bg-clip-text text-transparent">
            {play.players.length}
          </div>
          <div className="text-xs text-muted-foreground">Key Players</div>
        </div>
      </div>

      {/* Success Rate Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Play Success Probability</span>
          <span className="text-sm text-muted-foreground">{successRate}%</span>
        </div>
        <Progress 
          value={successRate} 
          className="h-2"
        />
      </div>

      {expanded && (
        <>
          {/* Players Involved */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Key Players
            </h4>
            <div className="flex flex-wrap gap-2">
              {play.players.map((player, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {player}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tactical Analysis */}
          <div className="p-4 bg-gradient-glass-primary backdrop-blur-lg rounded-xl border border-white/20 shadow-glass">
            <h4 className="font-semibold mb-2 text-primary">Coach's Analysis</h4>
            <p className="text-sm text-muted-foreground mb-3">
              {playDetails.analysis}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Play className="h-3 w-3" />
              <span>Difficulty: {play.distance > 10 ? "High" : play.distance > 5 ? "Medium" : "Low"}</span>
              <span>•</span>
              <span>Situation: {play.down >= 3 ? "Critical" : "Standard"}</span>
            </div>
          </div>

          {/* Video Placeholder */}
          <div className="mt-6 p-8 bg-gradient-glass-accent backdrop-blur-lg rounded-xl border border-white/10 border-dashed text-center shadow-glass">
            <div className="p-3 bg-gradient-glass-primary rounded-full w-fit mx-auto mb-3">
              <Play className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">Play Highlight Video</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Coming soon - Full game footage with play breakdown
            </p>
          </div>
        </>
      )}
    </Card>
  );
};