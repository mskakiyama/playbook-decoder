import { useQuery } from '@tanstack/react-query';
import { 
  fetchNFLScoreboard, 
  fetchPlayByPlay, 
  fetchAllHistoricalGames,
  transformESPNGameToAppGame, 
  transformESPNPlayToAppPlay 
} from '@/lib/espn-api';

export const useNFLScoreboard = () => {
  return useQuery({
    queryKey: ['nfl-scoreboard'],
    queryFn: fetchNFLScoreboard,
    refetchInterval: 30000, // Refetch every 30 seconds for live updates
    select: (data) => {
      return data.events.map(transformESPNGameToAppGame);
    },
  });
};

export const useHistoricalGames = () => {
  return useQuery({
    queryKey: ['nfl-historical-games'],
    queryFn: fetchAllHistoricalGames,
    staleTime: 1000 * 60 * 60, // 1 hour - historical data doesn't change often
    select: (data) => {
      return data.map(transformESPNGameToAppGame).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    },
  });
};

export const useAllGames = () => {
  const { data: currentGames, isLoading: currentLoading } = useNFLScoreboard();
  const { data: historicalGames, isLoading: historicalLoading } = useHistoricalGames();
  
  return {
    data: [...(currentGames || []), ...(historicalGames || [])],
    isLoading: currentLoading || historicalLoading,
  };
};

export const usePlayByPlay = (eventId: string | null) => {
  return useQuery({
    queryKey: ['play-by-play', eventId],
    queryFn: () => eventId ? fetchPlayByPlay(eventId) : Promise.resolve(null),
    enabled: !!eventId,
    refetchInterval: 15000, // Refetch every 15 seconds for live play updates
    select: (data) => {
      if (!data) return [];
      return data.plays.map(transformESPNPlayToAppPlay).reverse(); // Most recent plays first
    },
  });
};