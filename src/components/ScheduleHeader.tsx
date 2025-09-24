import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { searchTeams, Team } from "@/data/nflSchedule";
import { cn } from "@/lib/utils";
import { LanguageDropdown } from "@/components/ui/language-dropdown";

interface ScheduleHeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

export function ScheduleHeader({ onSearch, searchQuery }: ScheduleHeaderProps) {
  const [searchResults, setSearchResults] = useState<Team[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (query: string) => {
    onSearch(query);
    
    if (query.trim()) {
      const results = searchTeams(query);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleTeamSelect = (team: Team) => {
    onSearch(team.name);
    setShowResults(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-background/80 via-background/90 to-background/80 border-b border-border/50 shadow-glass">
      <div className="container mx-auto px-6 py-2">
        {/* Header Content */}
        <div className="flex items-center justify-between">
          {/* Spacer for balance */}
          <div className="w-20"></div>
          
          {/* Main Title */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              2025 NFL Schedule
            </h1>
          </div>

          {/* Language Dropdown */}
          <div className="flex justify-end w-20">
            <LanguageDropdown />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className={cn(
                "pl-10 pr-4 py-3 text-base",
                "bg-card/40 backdrop-blur-sm border-border/50",
                "focus:border-primary/50 focus:ring-primary/20",
                "transition-all duration-300"
              )}
            />
          </div>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-card/95 backdrop-blur-lg border border-border/50 rounded-lg shadow-glass-hover z-10">
              {searchResults.map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleTeamSelect(team)}
                  className={cn(
                    "w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors",
                    "first:rounded-t-lg last:rounded-b-lg",
                    "flex items-center justify-between"
                  )}
                >
                  <div>
                    <div className="font-medium text-foreground">{team.name}</div>
                    <div className="text-sm text-muted-foreground">{team.city}</div>
                  </div>
                  <div className="text-sm font-mono text-muted-foreground">
                    {team.abbreviation}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {showResults && searchResults.length === 0 && searchQuery.trim() && (
            <div className="absolute top-full mt-2 w-full bg-card/95 backdrop-blur-lg border border-border/50 rounded-lg shadow-glass-hover z-10">
              <div className="px-4 py-3 text-center text-muted-foreground">
                No teams found for "{searchQuery}"
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}