import { useQuery } from '@tanstack/react-query';
import { NFLStandingsAPI, StandingsData } from '@/lib/nfl-standings-api';

export const useNFLStandings = () => {
  const isGameSeason = NFLStandingsAPI.isGameSeason();
  
  return useQuery<StandingsData>({
    queryKey: ['nfl-standings'],
    queryFn: NFLStandingsAPI.fetchStandings,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: isGameSeason ? 30 * 1000 : false, // Auto-refetch every 30 seconds during game season
    refetchOnWindowFocus: true,
    retry: 2,
  });
};
