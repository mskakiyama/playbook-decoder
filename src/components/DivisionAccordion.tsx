import { Division, Conference } from "@/data/nflSchedule";
import { TeamScheduleCard } from "./TeamScheduleCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface DivisionAccordionProps {
  division: Division;
  conference: Conference;
  searchQuery: string;
}

export function DivisionAccordion({ division, conference, searchQuery }: DivisionAccordionProps) {
  // Filter teams based on search query
  const filteredTeams = division.teams.filter(team => {
    if (!searchQuery) return true;
    
    return team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           team.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
           team.abbreviation.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Don't render if no matching teams
  if (searchQuery && filteredTeams.length === 0) {
    return null;
  }

  const isAFC = conference.name === "AFC";

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={`${conference.name}-${division.name}`} className="border-none">
        <AccordionTrigger
          className={cn(
            "text-xl font-semibold px-4 py-3 rounded-lg hover:no-underline",
            "bg-gradient-to-r backdrop-blur-sm border border-border/20",
            "transition-all duration-300 hover:shadow-md",
            isAFC
              ? "from-blue-500/5 to-blue-600/10 text-blue-300 hover:from-blue-500/10 hover:to-blue-600/15"
              : "from-red-500/5 to-red-600/10 text-red-300 hover:from-red-500/10 hover:to-red-600/15"
          )}
        >
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isAFC ? "bg-blue-400" : "bg-red-400"
            )} />
            {conference.name} {division.name}
          </div>
        </AccordionTrigger>
        
        <AccordionContent className="pb-0 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTeams.map((team) => (
              <TeamScheduleCard
                key={team.id}
                team={team}
                conference={conference}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}