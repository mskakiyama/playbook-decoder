import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Minus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePowerRankings } from "@/hooks/usePowerRankings";

type SortField = "rank" | "record";
type SortDirection = "asc" | "desc";

export function PowerRankings() {
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  
  const { data: rankingsData, isLoading, isError } = usePowerRankings(6, 2025);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!rankingsData) return [];
    
    const sorted = [...rankingsData];

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
  }, [rankingsData, sortField, sortDirection]);

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

  if (isLoading) {
    return (
      <Card className="bg-card/40 backdrop-blur-sm border-border/30">
        <CardHeader>
          <CardTitle className="font-oswald text-2xl">2025 NFL Power Rankings</CardTitle>
          <CardDescription>
            Sharp Football Analysis • Week 6, October 2025
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading power rankings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="bg-card/40 backdrop-blur-sm border-border/30">
        <CardHeader>
          <CardTitle className="font-oswald text-2xl">2025 NFL Power Rankings</CardTitle>
          <CardDescription>
            Sharp Football Analysis • Week 6, October 2025
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-destructive mb-2">Error loading power rankings</p>
            <p className="text-sm text-muted-foreground">Please try again later</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                      {getRankChangeIcon(team.rank_change)}
                      <span className={cn(
                        "font-semibold text-sm",
                        team.rank_change > 0 && "text-green-500",
                        team.rank_change < 0 && "text-red-500",
                        team.rank_change === 0 && "text-muted-foreground"
                      )}>
                        {team.rank_change > 0 ? `+${team.rank_change}` : team.rank_change}
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
