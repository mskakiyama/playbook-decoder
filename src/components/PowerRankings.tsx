import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface PowerRankingTeam {
  rank: number;
  team: string;
  abbreviation: string;
  record: string;
  wins: number;
  losses: number;
  ties: number;
  rankChange: number;
}

const powerRankingsData: PowerRankingTeam[] = [
  { rank: 1, team: "Philadelphia Eagles", abbreviation: "PHI", record: "4-1", wins: 4, losses: 1, ties: 0, rankChange: 1 },
  { rank: 2, team: "Detroit Lions", abbreviation: "DET", record: "4-1", wins: 4, losses: 1, ties: 0, rankChange: 1 },
  { rank: 3, team: "Buffalo Bills", abbreviation: "BUF", record: "4-1", wins: 4, losses: 1, ties: 0, rankChange: -2 },
  { rank: 4, team: "Tampa Bay Buccaneers", abbreviation: "TB", record: "4-1", wins: 4, losses: 1, ties: 0, rankChange: 1 },
  { rank: 5, team: "Indianapolis Colts", abbreviation: "IND", record: "4-1", wins: 4, losses: 1, ties: 0, rankChange: 4 },
  { rank: 6, team: "San Francisco 49ers", abbreviation: "SF", record: "4-1", wins: 4, losses: 1, ties: 0, rankChange: 7 },
  { rank: 7, team: "Washington Commanders", abbreviation: "WAS", record: "3-2", wins: 3, losses: 2, ties: 0, rankChange: 5 },
  { rank: 8, team: "Los Angeles Rams", abbreviation: "LAR", record: "3-2", wins: 3, losses: 2, ties: 0, rankChange: -4 },
  { rank: 9, team: "Green Bay Packers", abbreviation: "GB", record: "2-2-1", wins: 2, losses: 2, ties: 1, rankChange: -2 },
  { rank: 10, team: "Denver Broncos", abbreviation: "DEN", record: "3-2", wins: 3, losses: 2, ties: 0, rankChange: 4 },
  { rank: 11, team: "Seattle Seahawks", abbreviation: "SEA", record: "3-2", wins: 3, losses: 2, ties: 0, rankChange: 0 },
  { rank: 12, team: "Jacksonville Jaguars", abbreviation: "JAX", record: "4-1", wins: 4, losses: 1, ties: 0, rankChange: 5 },
  { rank: 13, team: "Los Angeles Chargers", abbreviation: "LAC", record: "3-2", wins: 3, losses: 2, ties: 0, rankChange: -5 },
  { rank: 14, team: "Kansas City Chiefs", abbreviation: "KC", record: "2-3", wins: 2, losses: 3, ties: 0, rankChange: -8 },
  { rank: 15, team: "New England Patriots", abbreviation: "NE", record: "2-3", wins: 2, losses: 3, ties: 0, rankChange: 8 },
  { rank: 16, team: "Pittsburgh Steelers", abbreviation: "PIT", record: "3-1", wins: 3, losses: 1, ties: 0, rankChange: -1 },
  { rank: 17, team: "Houston Texans", abbreviation: "HOU", record: "2-3", wins: 2, losses: 3, ties: 0, rankChange: 7 },
  { rank: 18, team: "Atlanta Falcons", abbreviation: "ATL", record: "2-2", wins: 2, losses: 2, ties: 0, rankChange: -2 },
  { rank: 19, team: "Minnesota Vikings", abbreviation: "MIN", record: "3-2", wins: 3, losses: 2, ties: 0, rankChange: 1 },
  { rank: 20, team: "Chicago Bears", abbreviation: "CHI", record: "2-2", wins: 2, losses: 2, ties: 0, rankChange: 1 },
  { rank: 21, team: "Baltimore Ravens", abbreviation: "BAL", record: "1-4", wins: 1, losses: 4, ties: 0, rankChange: -11 },
  { rank: 22, team: "Dallas Cowboys", abbreviation: "DAL", record: "2-2-1", wins: 2, losses: 2, ties: 1, rankChange: -3 },
  { rank: 23, team: "Arizona Cardinals", abbreviation: "ARI", record: "2-3", wins: 2, losses: 3, ties: 0, rankChange: -5 },
  { rank: 24, team: "Cincinnati Bengals", abbreviation: "CIN", record: "2-3", wins: 2, losses: 3, ties: 0, rankChange: -2 },
  { rank: 25, team: "Carolina Panthers", abbreviation: "CAR", record: "2-3", wins: 2, losses: 3, ties: 0, rankChange: 4 },
  { rank: 26, team: "New Orleans Saints", abbreviation: "NO", record: "1-4", wins: 1, losses: 4, ties: 0, rankChange: 5 },
  { rank: 27, team: "Cleveland Browns", abbreviation: "CLE", record: "1-4", wins: 1, losses: 4, ties: 0, rankChange: -2 },
  { rank: 28, team: "New York Giants", abbreviation: "NYG", record: "1-4", wins: 1, losses: 4, ties: 0, rankChange: -2 },
  { rank: 29, team: "Tennessee Titans", abbreviation: "TEN", record: "1-4", wins: 1, losses: 4, ties: 0, rankChange: 3 },
  { rank: 30, team: "Las Vegas Raiders", abbreviation: "LV", record: "1-4", wins: 1, losses: 4, ties: 0, rankChange: -3 },
  { rank: 31, team: "Miami Dolphins", abbreviation: "MIA", record: "1-4", wins: 1, losses: 4, ties: 0, rankChange: -1 },
  { rank: 32, team: "New York Jets", abbreviation: "NYJ", record: "0-5", wins: 0, losses: 5, ties: 0, rankChange: -4 },
];

type SortField = "rank" | "record";
type SortDirection = "asc" | "desc";

export function PowerRankings() {
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    const sorted = [...powerRankingsData];

    sorted.sort((a, b) => {
      let comparison = 0;

      if (sortField === "rank") {
        comparison = a.rank - b.rank;
      } else if (sortField === "record") {
        // Sort by wins first, then by losses (fewer losses is better)
        const aWinPct = a.wins / (a.wins + a.losses + a.ties * 0.5);
        const bWinPct = b.wins / (b.wins + b.losses + b.ties * 0.5);
        comparison = bWinPct - aWinPct; // Higher win percentage first
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [sortField, sortDirection]);

  const getRankChangeIcon = (change: number) => {
    if (change > 0) {
      return <ArrowUp className="h-4 w-4 text-green-500" />;
    } else if (change < 0) {
      return <ArrowDown className="h-4 w-4 text-red-500" />;
    } else {
      return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRowClassName = (rank: number) => {
    if (rank <= 5) {
      return "bg-green-500/10 hover:bg-green-500/20 border-l-4 border-l-green-500";
    } else if (rank >= 28) {
      return "bg-red-500/10 hover:bg-red-500/20 border-l-4 border-l-red-500";
    }
    return "hover:bg-muted/50";
  };

  return (
    <Card className="bg-card/40 backdrop-blur-sm border-border/30">
      <CardHeader>
        <CardTitle className="font-oswald text-2xl">2025 NFL Power Rankings</CardTitle>
        <CardDescription>
          Sharp Football Analysis • Week 6, October 2025
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border/30 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/50">
                <TableHead 
                  className="w-[80px] cursor-pointer select-none font-bold"
                  onClick={() => handleSort("rank")}
                >
                  <div className="flex items-center gap-2">
                    Rank
                    {sortField === "rank" && (
                      sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="font-bold">Team</TableHead>
                <TableHead 
                  className="cursor-pointer select-none font-bold"
                  onClick={() => handleSort("record")}
                >
                  <div className="flex items-center gap-2">
                    Record
                    {sortField === "record" && (
                      sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right font-bold">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((team) => (
                <TableRow 
                  key={team.abbreviation}
                  className={cn("transition-colors", getRowClassName(team.rank))}
                >
                  <TableCell className="font-bold text-lg">
                    {team.rank}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold">{team.team}</span>
                      <span className="text-xs text-muted-foreground">{team.abbreviation}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono font-semibold">
                    {team.record}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {getRankChangeIcon(team.rankChange)}
                      <span className={cn(
                        "font-semibold text-sm",
                        team.rankChange > 0 && "text-green-500",
                        team.rankChange < 0 && "text-red-500",
                        team.rankChange === 0 && "text-muted-foreground"
                      )}>
                        {team.rankChange > 0 ? `+${team.rankChange}` : team.rankChange}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex items-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500/30 border-l-2 border-l-green-500"></div>
            <span>Top 5 Teams</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500/30 border-l-2 border-l-red-500"></div>
            <span>Bottom 5 Teams</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
