import { useQuery } from '@tanstack/react-query';
import { NFLStandingsAPI, StandingsData } from '@/lib/nfl-standings-api';

export const useNFLStandings = () => {
  const isGameSeason = NFLStandingsAPI.isGameSeason();
  
  return useQuery<StandingsData>({
    queryKey: ['nfl-standings'],
    queryFn: NFLStandingsAPI.fetchStandings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: isGameSeason ? 5 * 60 * 1000 : false, // Auto-refetch during game season
    refetchOnWindowFocus: true,
    retry: 2,
  });
};
