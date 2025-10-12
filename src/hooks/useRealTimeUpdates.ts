import { useState, useEffect, useCallback } from 'react';
import { LiveGame, RealTimeStandingsAPI } from '@/lib/real-time-standings-api';

export const useRealTimeUpdates = (isEnabled: boolean = true) => {
  const [liveGames, setLiveGames] = useState<LiveGame[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [updateCount, setUpdateCount] = useState(0);

  // Initialize live games
  useEffect(() => {
    if (isEnabled) {
      setLiveGames(RealTimeStandingsAPI.getLiveGames());
    }
  }, [isEnabled]);

  // Simulate real-time updates every 15-30 seconds
  useEffect(() => {
    if (!isEnabled || liveGames.length === 0) return;

    const updateInterval = setInterval(() => {
      setLiveGames((prevGames) => {
        const updatedGames = prevGames.map((game) => {
          if (game.status === 'LIVE') {
            return RealTimeStandingsAPI.simulateLiveGameUpdate(game);
          }
          return game;
        });
        return updatedGames;
      });
      setLastUpdated(new Date());
      setUpdateCount((count) => count + 1);
    }, Math.random() * 15000 + 15000); // 15-30 seconds

    return () => clearInterval(updateInterval);
  }, [isEnabled, liveGames.length]);

  const refreshNow = useCallback(() => {
    setLiveGames(RealTimeStandingsAPI.getLiveGames());
    setLastUpdated(new Date());
    setUpdateCount((count) => count + 1);
  }, []);

  const getTimeSinceUpdate = useCallback(() => {
    const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }, [lastUpdated]);

  return {
    liveGames,
    lastUpdated,
    updateCount,
    refreshNow,
    getTimeSinceUpdate,
  };
};
