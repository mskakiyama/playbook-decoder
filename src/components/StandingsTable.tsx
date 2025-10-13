import { useState } from "react";
import { TeamStandings } from "@/lib/nfl-standings-api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Trophy, TrendingUp, TrendingDown, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface StandingsTableProps {
  teams: TeamStandings[];
  divisionName: string;
  conferenceName: string;
}

type SortField = 'rank' | 'team' | 'winPct' | 'div' | 'conf' | 'pf' | 'pa' | 'streak';
type SortDirection = 'asc' | 'desc';

export const StandingsTable = ({ teams, divisionName, conferenceName }: StandingsTableProps) => {
  const { t } = useTranslation();
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1 inline opacity-40" />;
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-1 inline text-primary" />
      : <ArrowDown className="h-4 w-4 ml-1 inline text-primary" />;
  };

  const sortedTeams = [...teams].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'team':
        return multiplier * a.team.localeCompare(b.team);
      case 'winPct':
        return multiplier * (a.winPct - b.winPct);
      case 'pf':
        return multiplier * (a.pf - b.pf);
      case 'pa':
        return multiplier * (a.pa - b.pa);
      case 'streak':
        const aNum = parseInt(a.streak.replace(/[WL]/, '')) * (a.streak.includes('W') ? 1 : -1);
        const bNum = parseInt(b.streak.replace(/[WL]/, '')) * (b.streak.includes('W') ? 1 : -1);
        return multiplier * (aNum - bNum);
      case 'rank':
      default:
        return multiplier * (a.rank - b.rank);
    }
  });

  const getStreakIndicator = (streak: string) => {
    if (streak.includes('W')) {
      const wins = parseInt(streak.replace('W', ''));
      if (wins >= 3) return <span className="text-success-green">🔥</span>;
      return <TrendingUp className="h-4 w-4 text-success-green inline" />;
    }
    if (streak.includes('L')) {
      const losses = parseInt(streak.replace('L', ''));
      if (losses >= 3) return <span className="text-destructive">❄️</span>;
      return <TrendingDown className="h-4 w-4 text-destructive inline" />;
    }
    return null;
  };

  const isWildCardContender = (rank: number, winPct: number) => {
    // Wild card contenders: ranks 2-4 with decent win percentage
    return rank >= 2 && rank <= 4 && winPct >= 0.400;
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border/30 bg-card/20 backdrop-blur-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-border/30 hover:bg-transparent">
            <TableHead 
              className="w-12 text-center cursor-pointer hover:text-primary transition-colors"
              onClick={() => handleSort('rank')}
            >
              {t('standings.rank')}
              {getSortIcon('rank')}
            </TableHead>
            <TableHead 
              className="min-w-[180px] cursor-pointer hover:text-primary transition-colors"
              onClick={() => handleSort('team')}
            >
              {t('standings.team')}
              {getSortIcon('team')}
            </TableHead>
            <TableHead className="text-center">{t('standings.record')}</TableHead>
            <TableHead 
              className="text-center hidden sm:table-cell cursor-pointer hover:text-primary transition-colors"
              onClick={() => handleSort('winPct')}
            >
              {t('standings.winPct')}
              {getSortIcon('winPct')}
            </TableHead>
            <TableHead className="text-center hidden md:table-cell">{t('standings.div')}</TableHead>
            <TableHead className="text-center hidden md:table-cell">{t('standings.conf')}</TableHead>
            <TableHead 
              className="text-center hidden lg:table-cell cursor-pointer hover:text-primary transition-colors"
              onClick={() => handleSort('pf')}
            >
              {t('standings.pf')}
              {getSortIcon('pf')}
            </TableHead>
            <TableHead 
              className="text-center hidden lg:table-cell cursor-pointer hover:text-primary transition-colors"
              onClick={() => handleSort('pa')}
            >
              {t('standings.pa')}
              {getSortIcon('pa')}
            </TableHead>
            <TableHead className="text-center hidden xl:table-cell">{t('standings.home')}</TableHead>
            <TableHead className="text-center hidden xl:table-cell">{t('standings.away')}</TableHead>
            <TableHead 
              className="text-center cursor-pointer hover:text-primary transition-colors"
              onClick={() => handleSort('streak')}
            >
              {t('standings.streak')}
              {getSortIcon('streak')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTeams.map((team) => (
            <TableRow
              key={team.abbreviation}
              className={cn(
                "border-border/30 transition-colors",
                team.rank === 1 && "bg-success-green/10 hover:bg-success-green/15",
                isWildCardContender(team.rank, team.winPct) && "bg-primary/5 hover:bg-primary/10"
              )}
            >
              <TableCell className="text-center font-medium">
                {team.rank === 1 ? (
                  <span className="flex items-center justify-center gap-1">
                    <Trophy className="h-4 w-4 text-touchdown-gold" />
                    {team.rank}
                  </span>
                ) : (
                  team.rank
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {team.logo && (
                    <img 
                      src={team.logo} 
                      alt={`${team.team} logo`} 
                      className="h-6 w-6 object-contain"
                    />
                  )}
                  <div>
                    <div className="font-medium text-foreground">{team.team}</div>
                    <div className="text-xs text-muted-foreground sm:hidden">
                      {team.winPct.toFixed(3)}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center font-mono text-sm">
                {team.record}
              </TableCell>
              <TableCell className="text-center font-mono text-sm hidden sm:table-cell">
                {team.winPct.toFixed(3)}
              </TableCell>
              <TableCell className="text-center font-mono text-xs text-muted-foreground hidden md:table-cell">
                {team.div}
              </TableCell>
              <TableCell className="text-center font-mono text-xs text-muted-foreground hidden md:table-cell">
                {team.conf}
              </TableCell>
              <TableCell className="text-center font-mono text-sm hidden lg:table-cell">
                {team.pf}
              </TableCell>
              <TableCell className="text-center font-mono text-sm hidden lg:table-cell">
                {team.pa}
              </TableCell>
              <TableCell className="text-center font-mono text-xs text-muted-foreground hidden xl:table-cell">
                {team.home}
              </TableCell>
              <TableCell className="text-center font-mono text-xs text-muted-foreground hidden xl:table-cell">
                {team.away}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  {getStreakIndicator(team.streak)}
                  <span className="font-medium text-sm">{team.streak}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
