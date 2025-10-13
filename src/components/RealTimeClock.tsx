import { useState, useEffect } from "react";
import { Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface RealTimeClockProps {
  lastUpdated: Date;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const RealTimeClock = ({ lastUpdated, onRefresh, isRefreshing }: RealTimeClockProps) => {
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      const diff = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
      setSecondsSinceUpdate(diff);
    }, 1000);

    return () => clearInterval(timer);
  }, [lastUpdated]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const getTimeAgoText = (seconds: number) => {
    if (seconds < 60) return t('standings.secondsAgo', { count: seconds });
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 text-white/90">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        <span className="font-mono text-lg">{formatTime(currentTime)}</span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-sm">
          {t('standings.lastUpdatedAt')}: <span className="font-medium">{getTimeAgoText(secondsSinceUpdate)}</span>
        </div>
        
        <Button
          onClick={onRefresh}
          disabled={isRefreshing}
          size="sm"
          variant="outline"
          className="gap-2 border-white/20 hover:border-primary"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{t('standings.refresh')}</span>
        </Button>
      </div>
    </div>
  );
};