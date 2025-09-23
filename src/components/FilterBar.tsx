import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Filter, 
  Search, 
  Target, 
  TrendingUp, 
  Star,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  plays?: Array<{ playType: string }>;
}

export const FilterBar = ({ activeFilter, onFilterChange, plays = [] }: FilterBarProps) => {
  // Calculate dynamic counts based on actual plays data
  const allCount = plays.length;
  const passingCount = plays.filter(play => play.playType === 'passing').length;
  const rushingCount = plays.filter(play => play.playType === 'rushing').length;
  const specialCount = plays.filter(play => play.playType === 'special').length;

  const filterOptions = [
    { id: "all", label: "All Plays", icon: Star, count: allCount },
    { id: "passing", label: "Passing", icon: Target, count: passingCount },
    { id: "rushing", label: "Rushing", icon: TrendingUp, count: rushingCount },
    { id: "special", label: "Special Teams", icon: RotateCcw, count: specialCount }
  ];
  return (
    <Card className="p-6 bg-card-glass backdrop-blur-xl border border-white/20 shadow-glass">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-glass-accent rounded-lg backdrop-blur-sm">
          <Filter className="h-5 w-5 text-accent" />
        </div>
        <h2 className="text-xl font-semibold leading-tight">Filters</h2>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search plays, players, or teams..."
          className="pl-10 bg-muted backdrop-blur-md border border-white/20 hover:bg-primary-glass transition-all duration-300"
        />
      </div>

      {/* Play Type Filters */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">
          PLAY TYPES
        </h3>
        {filterOptions.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;
          
          return (
            <Button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-between h-auto p-3 backdrop-blur-lg border border-white/10 transition-all duration-300",
                isActive 
                  ? "bg-gradient-glass-primary text-primary-foreground shadow-glass" 
                  : "bg-card-glass hover:bg-gradient-glass-secondary hover:shadow-glass"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                <span className="font-medium">{filter.label}</span>
              </div>
              <Badge 
                variant={isActive ? "secondary" : "outline"}
                className={cn(
                  "text-xs backdrop-blur-sm",
                  isActive && "bg-primary-foreground/20 text-primary-foreground"
                )}
              >
                {filter.count}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Quick Filters */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">
          QUICK FILTERS
        </h3>
        <div className="space-y-2">
          <Button variant="ghost" size="sm" className="w-full justify-start text-sm bg-card-glass backdrop-blur-lg border border-white/5 hover:bg-gradient-glass-accent">
            🏆 Touchdown Plays (4)
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-sm bg-card-glass backdrop-blur-lg border border-white/5 hover:bg-gradient-glass-accent">
            🚫 Turnovers (2)
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-sm bg-card-glass backdrop-blur-lg border border-white/5 hover:bg-gradient-glass-accent">
            ⭐ Key Plays (6)
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-sm bg-card-glass backdrop-blur-lg border border-white/5 hover:bg-gradient-glass-accent">
            🎯 Red Zone (5)
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilter !== "all" && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            ACTIVE FILTERS
          </h3>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant="secondary" 
              className="bg-gradient-glass-primary backdrop-blur-lg text-primary cursor-pointer hover:bg-gradient-glass-secondary border border-white/20"
              onClick={() => onFilterChange("all")}
            >
              {filterOptions.find(f => f.id === activeFilter)?.label}
              <span className="ml-2">×</span>
            </Badge>
          </div>
        </div>
      )}
    </Card>
  );
};