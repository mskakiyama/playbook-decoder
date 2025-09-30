import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface StandingsFiltersProps {
  conferenceFilter: string;
  divisionFilter: string;
  searchQuery: string;
  onConferenceChange: (value: string) => void;
  onDivisionChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export const StandingsFilters = ({
  conferenceFilter,
  divisionFilter,
  searchQuery,
  onConferenceChange,
  onDivisionChange,
  onSearchChange
}: StandingsFiltersProps) => {
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-40 backdrop-blur-xl bg-gradient-to-r from-background/80 via-background/90 to-background/80 shadow-glass">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Select value={conferenceFilter} onValueChange={onConferenceChange}>
              <SelectTrigger className="w-full sm:w-[150px] bg-card/40 backdrop-blur-sm border-border/30">
                <SelectValue placeholder={t('standings.conference')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('standings.allConferences')}</SelectItem>
                <SelectItem value="AFC">AFC</SelectItem>
                <SelectItem value="NFC">NFC</SelectItem>
              </SelectContent>
            </Select>

            <Select value={divisionFilter} onValueChange={onDivisionChange}>
              <SelectTrigger className="w-full sm:w-[150px] bg-card/40 backdrop-blur-sm border-border/30">
                <SelectValue placeholder={t('standings.division')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('standings.allDivisions')}</SelectItem>
                <SelectItem value="East">{t('standings.east')}</SelectItem>
                <SelectItem value="North">{t('standings.north')}</SelectItem>
                <SelectItem value="South">{t('standings.south')}</SelectItem>
                <SelectItem value="West">{t('standings.west')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder={t('standings.searchTeams')}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-card/40 backdrop-blur-sm border-border/30 focus:border-primary/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
