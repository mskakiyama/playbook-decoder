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
}

const filterOptions = [
  { id: "all", label: "All Plays", icon: Star, count: 24 },
  { id: "passing", label: "Passing", icon: Target, count: 14 },
  { id: "rushing", label: "Rushing", icon: TrendingUp, count: 8 },
  { id: "special", label: "Special Teams", icon: RotateCcw, count: 2 }
];

export const FilterBar = ({ activeFilter, onFilterChange }: FilterBarProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Filters</h2>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search plays, players, or teams..."
          className="pl-10 bg-muted/50 border-primary/30"
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
                "w-full justify-between h-auto p-3 transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg" 
                  : "hover:bg-primary/10 hover:text-primary"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                <span className="font-medium">{filter.label}</span>
              </div>
              <Badge 
                variant={isActive ? "secondary" : "outline"}
                className={cn(
                  "text-xs",
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
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">
          QUICK FILTERS
        </h3>
        <div className="space-y-2">
          <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
            🏆 Touchdown Plays (4)
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
            🚫 Turnovers (2)
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
            ⭐ Key Plays (6)
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
            🎯 Red Zone (5)
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilter !== "all" && (
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            ACTIVE FILTERS
          </h3>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant="secondary" 
              className="bg-primary/20 text-primary cursor-pointer hover:bg-primary/30"
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