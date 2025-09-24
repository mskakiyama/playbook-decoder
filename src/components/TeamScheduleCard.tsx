import { Team, Conference } from "@/data/nflSchedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Home, Plane, Trophy, Tv } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface TeamScheduleCardProps {
  team: Team;
  conference: Conference;
}

export function TeamScheduleCard({ team, conference }: TeamScheduleCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isAFC = conference.name === "AFC";

  const formatOpponent = (opponent: string) => {
    if (opponent === "BYE") return "BYE WEEK";
    return opponent;
  };

  const getGameRowClassName = (game: any) => {
    if (game.isBye) {
      return "bg-gradient-to-r from-neutral-gray/10 to-neutral-gray/20 hover:from-neutral-gray/20 hover:to-neutral-gray/30";
    }
    if (game.isDivisional) {
      return "bg-gradient-to-r from-touchdown-gold/10 to-touchdown-gold/20 hover:from-touchdown-gold/20 hover:to-touchdown-gold/30";
    }
    if (game.isPrimetime) {
      return "bg-gradient-to-r from-purple-500/10 to-purple-600/20 hover:from-purple-500/20 hover:to-purple-600/30";
    }
    return "hover:bg-muted/30";
  };

  const getNetworkBadgeColor = (network: string) => {
    switch (network.toLowerCase()) {
      case "nbc":
      case "sunday night football":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "espn":
      case "monday night football":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "amazon":
      case "thursday night football":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "netflix":
        return "bg-red-600/20 text-red-400 border-red-600/30";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  return (
    <Card className="bg-card/40 backdrop-blur-sm border-border/30 hover:bg-card/60 transition-all duration-300">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                  isAFC ? "bg-blue-500/20 text-blue-300" : "bg-red-500/20 text-red-300"
                )}>
                  {team.abbreviation}
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-foreground">
                    {team.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {team.projectedRecord}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {team.city}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronDown className={cn(
                "h-5 w-5 transition-transform duration-200",
                isOpen && "rotate-180"
              )} />
            </div>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="overflow-hidden rounded border border-border/30">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20 hover:bg-muted/30">
                    <TableHead className="w-16 text-xs font-semibold">Week</TableHead>
                    <TableHead className="w-20 text-xs font-semibold">Date</TableHead>
                    <TableHead className="text-xs font-semibold">Opponent</TableHead>
                    <TableHead className="w-20 text-xs font-semibold">Time</TableHead>
                    <TableHead className="w-16 text-xs font-semibold">TV</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.games.map((game, index) => (
                    <TableRow
                      key={index}
                      className={cn(
                        "transition-colors duration-200",
                        getGameRowClassName(game)
                      )}
                    >
                      <TableCell className="font-mono text-sm font-medium">
                        {game.week}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {game.date}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {!game.isBye && (
                            <div className="flex items-center gap-1">
                              {game.isHome ? (
                                <Home className="h-3 w-3 text-field-green" />
                              ) : (
                                <Plane className="h-3 w-3 text-muted-foreground" />
                              )}
                            </div>
                          )}
                          <span className={cn(
                            "font-medium",
                            game.isBye && "text-muted-foreground italic",
                            game.isDivisional && "text-touchdown-gold",
                            game.isPrimetime && "text-purple-400"
                          )}>
                            {formatOpponent(game.opponent)}
                          </span>
                          {game.isPrimetime && (
                            <Trophy className="h-3 w-3 text-purple-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {game.time}
                      </TableCell>
                      <TableCell>
                        {game.network !== "—" && (
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs font-medium",
                              getNetworkBadgeColor(game.network)
                            )}
                          >
                            <Tv className="h-3 w-3 mr-1" />
                            {game.network}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Game Type Legend */}
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-gradient-to-r from-touchdown-gold/30 to-touchdown-gold/50" />
                <span className="text-muted-foreground">Divisional</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-gradient-to-r from-purple-500/30 to-purple-600/50" />
                <span className="text-muted-foreground">Primetime</span>
              </div>
              <div className="flex items-center gap-1">
                <Home className="h-3 w-3 text-field-green" />
                <span className="text-muted-foreground">Home</span>
              </div>
              <div className="flex items-center gap-1">
                <Plane className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Away</span>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}