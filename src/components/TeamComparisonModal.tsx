import { TeamStandings } from "@/lib/nfl-standings-api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TeamComparisonModalProps {
  teams: TeamStandings[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TeamComparisonModal = ({ teams, open, onOpenChange }: TeamComparisonModalProps) => {
  if (teams.length === 0) return null;

  const stats = [
    { label: "Record", getValue: (t: TeamStandings) => t.record },
    { label: "Win %", getValue: (t: TeamStandings) => t.winPct.toFixed(3) },
    { label: "Points For", getValue: (t: TeamStandings) => t.pf },
    { label: "Points Against", getValue: (t: TeamStandings) => t.pa },
    { label: "Point Diff", getValue: (t: TeamStandings) => t.pf - t.pa },
    { label: "Division", getValue: (t: TeamStandings) => t.div },
    { label: "Conference", getValue: (t: TeamStandings) => t.conf },
    { label: "Home", getValue: (t: TeamStandings) => t.home },
    { label: "Away", getValue: (t: TeamStandings) => t.away },
    { label: "Streak", getValue: (t: TeamStandings) => t.streak },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-oswald">Team Comparison</DialogTitle>
          <DialogDescription>
            Head-to-head comparison of selected teams
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Team Headers */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${teams.length}, 1fr)` }}>
            <div className="font-bold text-muted-foreground">Stat</div>
            {teams.map(team => (
              <div key={team.abbreviation} className="flex flex-col items-center gap-2">
                {team.logo && (
                  <img src={team.logo} alt={team.team} className="h-12 w-12 object-contain" />
                )}
                <div className="text-center">
                  <div className="font-bold text-sm">{team.team}</div>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {team.abbreviation}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Rows */}
          {stats.map((stat, idx) => (
            <div 
              key={stat.label} 
              className={cn(
                "grid gap-4 py-3 border-b border-border/30",
                idx % 2 === 0 && "bg-card/20"
              )}
              style={{ gridTemplateColumns: `200px repeat(${teams.length}, 1fr)` }}
            >
              <div className="font-medium text-sm">{stat.label}</div>
              {teams.map(team => {
                const value = stat.getValue(team);
                const isNumeric = typeof value === 'number';
                const isBest = isNumeric && teams.every(t => {
                  const otherValue = stat.getValue(t);
                  return typeof otherValue === 'number' ? value >= otherValue : true;
                });

                return (
                  <div 
                    key={team.abbreviation} 
                    className={cn(
                      "text-center font-mono text-sm",
                      isBest && "text-success-green font-bold"
                    )}
                  >
                    {value}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
