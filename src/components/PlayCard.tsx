import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Users, 
  Clock, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Star,
  Share2,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generatePlaySummary } from "@/utils/play-summary-generator";

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

  const getPlayTypeDetails = () => {
    switch (play.playType) {
      case "passing":
        return {
          icon: <Target className="h-4 w-4" />,
          color: "bg-primary"
        };
      case "rushing":
        return {
          icon: <TrendingUp className="h-4 w-4" />,
          color: "bg-success-green"
        };
      default:
        return {
          icon: <Star className="h-4 w-4" />,
          color: "bg-accent"
        };
    }
  };

  const playDetails = getPlayTypeDetails();
  const playSummary = generatePlaySummary(play);
  
  // Generate YouTube search URL for play highlights
  const getYouTubeSearchQuery = () => {
    const query = `${play.description} NFL highlight`;
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  };

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
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-gradient-glass-secondary backdrop-blur-lg rounded-xl border border-white/10">
          <div className={cn(
            "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
            play.yards > 0 ? "from-success-green to-field-green" : "from-interception-red to-accent"
          )}>
            {play.yards > 0 ? `+${play.yards}` : play.yards}
          </div>
          <div className="text-xs text-muted-foreground">Yards</div>
        </div>
        <div className="text-center p-3 bg-gradient-glass-accent backdrop-blur-lg rounded-xl border border-white/10">
          <div className="text-2xl font-bold bg-gradient-to-r from-field-green to-touchdown-gold bg-clip-text text-transparent">
            {play.players.length}
          </div>
          <div className="text-xs text-muted-foreground">Key Players</div>
        </div>
      </div>

      {/* Play Summary */}
      <div className="mb-6 p-4 bg-gradient-glass-primary backdrop-blur-lg rounded-xl border border-white/20">
        <h4 className="font-semibold mb-2 text-primary flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Play Summary
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {playSummary}
        </p>
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

          {/* YouTube Video */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Play className="h-4 w-4 text-primary" />
                Play Highlight
              </h4>
              <a 
                href={getYouTubeSearchQuery()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                Search on YouTube →
              </a>
            </div>
            <div className="relative rounded-xl overflow-hidden border border-white/20 shadow-glass bg-gradient-glass-accent backdrop-blur-lg">
              <div className="relative pt-[56.25%]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="p-4 bg-gradient-glass-primary rounded-full w-fit mx-auto mb-3">
                      <Play className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Click "Search on YouTube" to find this play
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Highlight videos available on YouTube
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};