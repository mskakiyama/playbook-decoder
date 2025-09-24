import { useState } from "react";
import { ScheduleHeader } from "@/components/ScheduleHeader";
import { ConferenceAccordion } from "@/components/ConferenceAccordion";
import { nflScheduleData } from "@/data/nflSchedule";
import { cn } from "@/lib/utils";

export default function Schedule() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <ScheduleHeader 
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {nflScheduleData.map((conference) => (
            <ConferenceAccordion
              key={conference.name}
              conference={conference}
              searchQuery={searchQuery}
            />
          ))}

          {/* No Results Message */}
          {searchQuery && 
           nflScheduleData.every(conference => 
             conference.divisions.every(division =>
               !division.teams.some(team =>
                 team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 team.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 team.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
               )
             )
           ) && (
            <div className="text-center py-12">
              <div className="bg-card/40 backdrop-blur-sm border border-border/30 rounded-lg p-8 max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Teams Found
                </h3>
                <p className="text-muted-foreground">
                  No teams match your search for "{searchQuery}".
                  Try searching by team name, city, or abbreviation.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-card/20 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              Data from{" "}
              <a 
                href="https://www.nfl.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                NFL.com
              </a>
              {" "}– Updated as of September 2025
            </p>
            <p className="text-xs mt-2 opacity-75">
              Regular season schedule subject to change. Check official NFL sources for the most current information.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}