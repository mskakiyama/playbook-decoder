import { useQuery } from "@tanstack/react-query";
import { NFLScheduleAPI } from "@/lib/nfl-schedule-api";
import { nflScheduleData } from "@/data/nflSchedule";
import { Conference } from "@/data/nflSchedule";

export const useNFLSchedule = () => {
  return useQuery<Conference[], Error>({
    queryKey: ["nfl-schedule", "2025"],
    queryFn: async () => {
      try {
        return await NFLScheduleAPI.fetchSchedule();
      } catch (error) {
        console.error("API fetch failed, falling back to static data:", error);
        // Fallback to static data if API fails
        return nflScheduleData;
      }
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days (previously cacheTime)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
