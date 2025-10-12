import { TeamAnalytics } from '@/lib/real-time-standings-api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Minus, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdvancedStandingsTableProps {
  teams: TeamAnalytics[];
  divisionName: string;
  conferenceName: string;
}

export const AdvancedStandingsTable = ({
  teams,
  divisionName,
  conferenceName,
}: AdvancedStandingsTableProps) => {
  return (
    <div className="relative">
      <Table>
        <TableHeader>
          <TableRow className="border-border/30 hover:bg-transparent">
            <TableHead className="w-12 text-center">#</TableHead>
            <TableHead className="min-w-[180px]">Team</TableHead>
            <TableHead className="text-center">Record</TableHead>
            <TableHead className="text-center">Win%</TableHead>
            <TableHead className="text-center">PF</TableHead>
            <TableHead className="text-center">PA</TableHead>
            <TableHead className="text-center">Diff</TableHead>
            <TableHead className="text-center">Streak</TableHead>
            <TableHead className="text-center">Playoff%</TableHead>
            <TableHead className="text-center">Off EPA</TableHead>
            <TableHead className="text-center">Def EPA</TableHead>
            <TableHead className="text-center">Success%</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team, index) => (
            <TableRow
              key={team.abbreviation}
              className={cn(
                'border-border/30 transition-all duration-500',
                'hover:bg-card-glass',
                team.isLive && 'bg-neon-green/5 border-neon-green/40 animate-glow-pulse'
              )}
            >
              {/* Rank */}
              <TableCell className="text-center font-mono font-bold">
                <div className="flex items-center justify-center gap-1">
                  {index + 1}
                  {team.rankChange > 0 && (
                    <ArrowUp className="w-3 h-3 text-neon-green" />
                  )}
                  {team.rankChange < 0 && (
                    <ArrowDown className="w-3 h-3 text-interception-red" />
                  )}
                </div>
              </TableCell>

              {/* Team */}
              <TableCell>
                <div className="flex items-center gap-3">
                  {team.isLive && (
                    <Badge
                      variant="outline"
                      className="bg-neon-green/20 text-neon-green border-neon-green/40 animate-pulse-neon text-[10px] px-1.5"
                    >
                      LIVE
                    </Badge>
                  )}
                  <div>
                    <div className="font-oswald font-bold">{team.team}</div>
                    <div className="text-xs text-muted-foreground">
                      {team.abbreviation} • {team.div}
                    </div>
                  </div>
                </div>
              </TableCell>

              {/* Record */}
              <TableCell className="text-center">
                <span className="font-mono font-semibold">{team.record}</span>
              </TableCell>

              {/* Win% */}
              <TableCell className="text-center">
                <span className={cn(
                  'font-mono font-semibold',
                  team.winPct >= 0.600 ? 'text-neon-green' : 
                  team.winPct >= 0.400 ? 'text-foreground' : 
                  'text-interception-red'
                )}>
                  {team.winPct.toFixed(3)}
                </span>
              </TableCell>

              {/* PF */}
              <TableCell className="text-center">
                <span className="font-mono text-neon-cyan">{team.pf}</span>
              </TableCell>

              {/* PA */}
              <TableCell className="text-center">
                <span className="font-mono text-neon-pink">{team.pa}</span>
              </TableCell>

              {/* Diff */}
              <TableCell className="text-center">
                <span
                  className={cn(
                    'font-mono font-bold',
                    team.pf - team.pa > 0 ? 'text-neon-green' : 'text-interception-red'
                  )}
                >
                  {team.pf - team.pa > 0 ? '+' : ''}
                  {team.pf - team.pa}
                </span>
              </TableCell>

              {/* Streak */}
              <TableCell className="text-center">
                <Badge
                  variant="outline"
                  className={cn(
                    'font-mono text-[10px]',
                    team.streak.includes('W')
                      ? 'bg-neon-green/10 text-neon-green border-neon-green/40'
                      : team.streak.includes('L')
                      ? 'bg-interception-red/10 text-interception-red border-interception-red/40'
                      : 'bg-muted/10 text-muted-foreground border-muted/40'
                  )}
                >
                  {team.streak}
                </Badge>
              </TableCell>

              {/* Playoff% */}
              <TableCell className="text-center">
                <div className="flex flex-col items-center gap-1">
                  <span className={cn(
                    'font-mono font-semibold text-sm',
                    team.playoffProbability >= 75 ? 'text-neon-green' :
                    team.playoffProbability >= 50 ? 'text-neon-cyan' :
                    team.playoffProbability >= 25 ? 'text-neon-orange' :
                    'text-muted-foreground'
                  )}>
                    {team.playoffProbability.toFixed(0)}%
                  </span>
                  <div className="w-12 h-1 bg-muted/20 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        team.playoffProbability >= 75 ? 'bg-neon-green' :
                        team.playoffProbability >= 50 ? 'bg-neon-cyan' :
                        team.playoffProbability >= 25 ? 'bg-neon-orange' :
                        'bg-muted-foreground'
                      )}
                      style={{ width: `${team.playoffProbability}%` }}
                    />
                  </div>
                </div>
              </TableCell>

              {/* Off EPA */}
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className={cn(
                    'font-mono text-sm',
                    team.offensiveEPA > 0.1 ? 'text-neon-green' :
                    team.offensiveEPA > 0 ? 'text-neon-cyan' :
                    'text-interception-red'
                  )}>
                    {team.offensiveEPA > 0 ? '+' : ''}{team.offensiveEPA.toFixed(2)}
                  </span>
                  {team.offensiveEPA > 0.1 && <TrendingUp className="w-3 h-3 text-neon-green" />}
                  {team.offensiveEPA < -0.05 && <TrendingDown className="w-3 h-3 text-interception-red" />}
                </div>
              </TableCell>

              {/* Def EPA */}
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className={cn(
                    'font-mono text-sm',
                    team.defensiveEPA < -0.1 ? 'text-neon-green' :
                    team.defensiveEPA < 0 ? 'text-neon-cyan' :
                    'text-interception-red'
                  )}>
                    {team.defensiveEPA > 0 ? '+' : ''}{team.defensiveEPA.toFixed(2)}
                  </span>
                  {team.defensiveEPA < -0.1 && <TrendingUp className="w-3 h-3 text-neon-green" />}
                  {team.defensiveEPA > 0.05 && <TrendingDown className="w-3 h-3 text-interception-red" />}
                </div>
              </TableCell>

              {/* Success% */}
              <TableCell className="text-center">
                <span className={cn(
                  'font-mono text-sm',
                  team.successRate >= 50 ? 'text-neon-green' :
                  team.successRate >= 45 ? 'text-neon-cyan' :
                  'text-muted-foreground'
                )}>
                  {team.successRate.toFixed(1)}%
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
