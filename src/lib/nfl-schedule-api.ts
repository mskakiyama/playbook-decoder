import { Conference } from "@/data/nflSchedule";

const API_BASE_URL = "https://api.nflglossary.com/v1";
const CACHE_KEY = "nfl_schedule_2025";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface CachedData {
  data: Conference[];
  timestamp: number;
}

export class NFLScheduleAPI {
  static async fetchSchedule(): Promise<Conference[]> {
    // Check cache first
    const cached = this.getCachedSchedule();
    if (cached) {
      console.log("Using cached NFL schedule data");
      return cached;
    }

    try {
      console.log("Fetching NFL schedule from API...");
      const response = await fetch(`${API_BASE_URL}/schedule/2025`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: Conference[] = await response.json();
      
      // Cache the response
      this.cacheSchedule(data);
      
      return data;
    } catch (error) {
      console.error("Failed to fetch NFL schedule:", error);
      
      // Try to return stale cache if available
      const staleCache = this.getStaleCache();
      if (staleCache) {
        console.log("Using stale cache due to API error");
        return staleCache;
      }
      
      throw error;
    }
  }

  private static getCachedSchedule(): Conference[] | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp }: CachedData = JSON.parse(cached);
      const age = Date.now() - timestamp;

      if (age < CACHE_TTL) {
        return data;
      }

      return null;
    } catch (error) {
      console.error("Error reading cache:", error);
      return null;
    }
  }

  private static getStaleCache(): Conference[] | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data }: CachedData = JSON.parse(cached);
      return data;
    } catch (error) {
      return null;
    }
  }

  private static cacheSchedule(data: Conference[]): void {
    try {
      const cacheData: CachedData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Error caching schedule:", error);
    }
  }

  static clearCache(): void {
    localStorage.removeItem(CACHE_KEY);
  }
}
