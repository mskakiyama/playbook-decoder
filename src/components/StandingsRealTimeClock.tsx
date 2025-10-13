import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface StandingsRealTimeClockProps {
  isRefetching: boolean;
  onRefresh: () => void;
}

export const StandingsRealTimeClock = ({ isRefetching, onRefresh }: StandingsRealTimeClockProps) => {
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate seconds since last update
  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
      setSecondsSinceUpdate(seconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  // Reset last updated when refetch completes
  useEffect(() => {
    if (!isRefetching) {
      setLastUpdated(new Date());
      setSecondsSinceUpdate(0);
    }
  }, [isRefetching]);

  const getTimeSinceUpdate = () => {
    if (secondsSinceUpdate < 60) {
      return t('standings.secondsAgo', { count: secondsSinceUpdate });
    }
    const minutes = Math.floor(secondsSinceUpdate / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  };

  // Calculate next update countdown (5 minutes = 300 seconds)
  const nextUpdateIn = 300 - (secondsSinceUpdate % 300);

  return (
    <div className="flex flex-col items-end gap-2">
      {/* Current Time */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span className="font-mono">
          {format(currentTime, 'MMM dd, yyyy • HH:mm:ss')}
        </span>
      </div>

      {/* Last Updated */}
      <div className="flex items-center gap-3">
        <div className="text-sm">
          <span className="text-muted-foreground">{t('standings.lastUpdated')}: </span>
          <span className={`font-medium ${secondsSinceUpdate < 10 ? 'text-primary animate-pulse' : ''}`}>
            {getTimeSinceUpdate()}
          </span>
        </div>

        {/* Refresh Button */}
        <Button
          onClick={onRefresh}
          disabled={isRefetching}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          {t('standings.refresh')}
        </Button>
      </div>

      {/* Next Update Countdown */}
      <div className="text-xs text-muted-foreground">
        {t('standings.nextUpdateIn', { count: nextUpdateIn })}
      </div>
    </div>
  );
};
