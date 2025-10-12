import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export interface PowerRanking {
  id: string;
  rank: number;
  team: string;
  abbreviation: string;
  record: string;
  wins: number;
  losses: number;
  ties: number;
  rank_change: number;
  week: number;
  season: number;
  source: string;
  created_at: string;
  updated_at: string;
}

export function usePowerRankings(week: number = 6, season: number = 2025) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["power_rankings", week, season],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("power_rankings")
        .select("*")
        .eq("week", week)
        .eq("season", season)
        .order("rank", { ascending: true });

      if (error) {
        console.error("Error fetching power rankings:", error);
        throw error;
      }

      return data as PowerRanking[];
    },
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("power_rankings_changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "power_rankings",
          filter: `week=eq.${week},season=eq.${season}`,
        },
        (payload) => {
          console.log("Power rankings updated:", payload);
          // Invalidate and refetch the query when data changes
          queryClient.invalidateQueries({ queryKey: ["power_rankings", week, season] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [week, season, queryClient]);

  return query;
}
