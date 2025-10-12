import { useEffect, useRef } from 'react';
import { LiveGame } from '@/lib/real-time-standings-api';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface LiveGamesTickerProps {
  games: LiveGame[];
}

export const LiveGamesTicker = ({ games }: LiveGamesTickerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    let animationId: number;
    let scrollPosition = 0;

    const scroll = () => {
      scrollPosition += 0.5;
      if (scrollPosition >= scrollElement.scrollWidth / 2) {
        scrollPosition = 0;
      }
      scrollElement.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, []);

  if (games.length === 0) return null;

  const liveGames = games.filter((g) => g.status === 'LIVE');
  if (liveGames.length === 0) return null;

  // Duplicate games for seamless scrolling
  const displayGames = [...liveGames, ...liveGames];

  return (
    <div className="bg-card/40 backdrop-blur-md border-b border-border/30 py-4 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-3">
          <Badge
            className="bg-neon-green/20 text-neon-green border-neon-green/40 animate-pulse-neon px-3 py-1"
          >
            LIVE GAMES
          </Badge>
          <div className="h-px flex-1 bg-gradient-to-r from-neon-green/50 via-neon-cyan/50 to-transparent" />
        </div>
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-hidden"
          style={{ scrollBehavior: 'auto' }}
        >
          {displayGames.map((game, index) => (
            <LiveGameCard key={`${game.gameId}-${index}`} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
};

const LiveGameCard = ({ game }: { game: LiveGame }) => {
  const { homeTeam, awayTeam, quarter, timeRemaining } = game;
  const isCloseGame = Math.abs(homeTeam.score - awayTeam.score) <= 7;

  return (
    <div
      className={cn(
        'flex-shrink-0 bg-card-glass backdrop-blur-md rounded-lg border p-4 min-w-[320px]',
        'transition-all duration-300',
        isCloseGame
          ? 'border-neon-pink/40 shadow-neon-pink'
          : 'border-neon-cyan/30 shadow-glass'
      )}
    >
      {/* Quarter and Time */}
      <div className="flex justify-between items-center mb-3">
        <Badge
          variant="outline"
          className="bg-neon-green/10 text-neon-green border-neon-green/40 font-mono text-xs"
        >
          {quarter} {timeRemaining}
        </Badge>
        {isCloseGame && (
          <span className="text-xs text-neon-pink font-semibold animate-pulse">
            CLOSE GAME
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="space-y-2">
        {/* Away Team */}
        <div
          className={cn(
            'flex items-center justify-between p-2 rounded transition-all',
            awayTeam.possession && 'bg-primary-glass border-l-2 border-neon-cyan'
          )}
        >
          <div className="flex items-center gap-2">
            <span className="font-oswald font-bold text-sm">{awayTeam.abbr}</span>
            {awayTeam.possession && (
              <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse-neon" />
            )}
            {awayTeam.redZone && (
              <Badge
                variant="outline"
                className="bg-interception-red/20 text-interception-red border-interception-red/40 text-[10px] px-1"
              >
                RZ
              </Badge>
            )}
          </div>
          <span
            className={cn(
              'font-mono text-2xl font-bold',
              awayTeam.score > homeTeam.score
                ? 'text-neon-cyan'
                : 'text-muted-foreground'
            )}
          >
            {awayTeam.score}
          </span>
        </div>

        {/* Home Team */}
        <div
          className={cn(
            'flex items-center justify-between p-2 rounded transition-all',
            homeTeam.possession && 'bg-primary-glass border-l-2 border-neon-cyan'
          )}
        >
          <div className="flex items-center gap-2">
            <span className="font-oswald font-bold text-sm">{homeTeam.abbr}</span>
            {homeTeam.possession && (
              <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse-neon" />
            )}
            {homeTeam.redZone && (
              <Badge
                variant="outline"
                className="bg-interception-red/20 text-interception-red border-interception-red/40 text-[10px] px-1"
              >
                RZ
              </Badge>
            )}
          </div>
          <span
            className={cn(
              'font-mono text-2xl font-bold',
              homeTeam.score > awayTeam.score
                ? 'text-neon-cyan'
                : 'text-muted-foreground'
            )}
          >
            {homeTeam.score}
          </span>
        </div>
      </div>

      {/* Last Play */}
      <div className="mt-3 pt-3 border-t border-border/30">
        <p className="text-xs text-muted-foreground truncate">{game.lastPlay}</p>
      </div>
    </div>
  );
};
