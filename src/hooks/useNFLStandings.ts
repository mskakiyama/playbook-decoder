import { useQuery } from '@tanstack/react-query';
import { NFLStandingsAPI, StandingsData } from '@/lib/nfl-standings-api';

export const useNFLStandings = () => {
  const gameTimeStatus = NFLStandingsAPI.isGameTime();
  
  return useQuery<StandingsData>({
    queryKey: ['nfl-standings'],
    queryFn: NFLStandingsAPI.fetchStandings,
    staleTime: gameTimeStatus.interval || 30 * 1000,
    refetchInterval: gameTimeStatus.interval || false,
    refetchOnWindowFocus: true,
    retry: 2,
  });
};
