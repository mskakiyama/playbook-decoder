import { Conference } from "@/data/nflSchedule";
import { DivisionAccordion } from "./DivisionAccordion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface ConferenceAccordionProps {
  conference: Conference;
  searchQuery: string;
}

export function ConferenceAccordion({ conference, searchQuery }: ConferenceAccordionProps) {
  // Filter divisions that have matching teams
  const filteredDivisions = conference.divisions.filter(division => {
    if (!searchQuery) return true;
    
    return division.teams.some(team =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Don't render if no matching divisions
  if (searchQuery && filteredDivisions.length === 0) {
    return null;
  }

  const isAFC = conference.name === "AFC";
  
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={conference.name} className="border-none">
        <AccordionTrigger
          className={cn(
            "text-2xl font-bold px-6 py-4 rounded-lg mb-4 hover:no-underline",
            "bg-gradient-to-r backdrop-blur-sm border border-border/30",
            "transition-all duration-300 hover:shadow-glass-hover",
            isAFC 
              ? "from-blue-500/10 to-blue-600/20 text-blue-400 hover:from-blue-500/20 hover:to-blue-600/30" 
              : "from-red-500/10 to-red-600/20 text-red-400 hover:from-red-500/20 hover:to-red-600/30"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-3 h-3 rounded-full",
              isAFC ? "bg-blue-500" : "bg-red-500"
            )} />
            {conference.name} Conference
          </div>
        </AccordionTrigger>
        
        <AccordionContent className="pb-0">
          <div className="space-y-6 px-2">
            {filteredDivisions.map((division) => (
              <DivisionAccordion
                key={`${conference.name}-${division.name}`}
                division={division}
                conference={conference}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}