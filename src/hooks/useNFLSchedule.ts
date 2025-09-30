import { useQuery } from "@tanstack/react-query";
import { NFLScheduleAPI } from "@/lib/nfl-schedule-api";
import { nflScheduleData } from "@/data/nflSchedule";
import { Conference } from "@/data/nflSchedule";

export const useNFLSchedule = () => {
  const dateKey = new Date().toISOString().split('T')[0]; // Daily cache refresh
  
  return useQuery<Conference[], Error>({
    queryKey: ["nfl-schedule", "2025", dateKey],
    queryFn: async () => {
      try {
        const data = await NFLScheduleAPI.fetchSchedule();
        
        // Validate the fetched data
        const teamCount = data.reduce((total, conf) => 
          total + conf.divisions.reduce((divTotal, div) => divTotal + div.teams.length, 0), 0
        );
        
        console.log(`Schedule loaded with ${teamCount} teams`);
        
        // If we don't have all 32 teams, use static data
        if (teamCount < 32) {
          console.warn(`Only ${teamCount} teams in schedule, using static data`);
          return nflScheduleData;
        }
        
        return data;
      } catch (error) {
        console.error("API fetch failed, using static data:", error);
        return nflScheduleData;
      }
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    retry: 1, // Reduce retries since we have good fallback
    retryDelay: 1000,
  });
};
