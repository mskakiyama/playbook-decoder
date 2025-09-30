import { Conference, Division, Team, Game } from "@/data/nflSchedule";

const ESPN_BASE_URL = "https://site.api.espn.com/apis/site/v2/sports/football/nfl";
const CACHE_KEY = "nfl_schedule_2025";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface CachedData {
  data: Conference[];
  timestamp: number;
}

// Team ID mappings for ESPN API
const TEAM_CONFERENCE_MAP: Record<string, { conference: string; division: string }> = {
  'BUF': { conference: 'AFC', division: 'East' },
  'MIA': { conference: 'AFC', division: 'East' },
  'NE': { conference: 'AFC', division: 'East' },
  'NYJ': { conference: 'AFC', division: 'East' },
  'BAL': { conference: 'AFC', division: 'North' },
  'CIN': { conference: 'AFC', division: 'North' },
  'CLE': { conference: 'AFC', division: 'North' },
  'PIT': { conference: 'AFC', division: 'North' },
  'HOU': { conference: 'AFC', division: 'South' },
  'IND': { conference: 'AFC', division: 'South' },
  'JAX': { conference: 'AFC', division: 'South' },
  'TEN': { conference: 'AFC', division: 'South' },
  'DEN': { conference: 'AFC', division: 'West' },
  'KC': { conference: 'AFC', division: 'West' },
  'LV': { conference: 'AFC', division: 'West' },
  'LAC': { conference: 'AFC', division: 'West' },
  'DAL': { conference: 'NFC', division: 'East' },
  'NYG': { conference: 'NFC', division: 'East' },
  'PHI': { conference: 'NFC', division: 'East' },
  'WAS': { conference: 'NFC', division: 'East' },
  'CHI': { conference: 'NFC', division: 'North' },
  'DET': { conference: 'NFC', division: 'North' },
  'GB': { conference: 'NFC', division: 'North' },
  'MIN': { conference: 'NFC', division: 'North' },
  'ATL': { conference: 'NFC', division: 'South' },
  'CAR': { conference: 'NFC', division: 'South' },
  'NO': { conference: 'NFC', division: 'South' },
  'TB': { conference: 'NFC', division: 'South' },
  'ARI': { conference: 'NFC', division: 'West' },
  'LA': { conference: 'NFC', division: 'West' },
  'SF': { conference: 'NFC', division: 'West' },
  'SEA': { conference: 'NFC', division: 'West' },
};

export class NFLScheduleAPI {
  static async fetchSchedule(): Promise<Conference[]> {
    // Check cache first
    const cached = this.getCachedSchedule();
    if (cached) {
      console.log("Using cached NFL schedule data");
      return cached;
    }

    try {
      console.log("Fetching 2025 NFL schedule from ESPN API...");
      const schedule = await this.fetchESPNSchedule();
      
      // Cache the response
      this.cacheSchedule(schedule);
      
      return schedule;
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

  private static async fetchESPNSchedule(): Promise<Conference[]> {
    const allGames: Map<string, Game[]> = new Map();
    const teamInfo: Map<string, { name: string; city: string; id: string }> = new Map();

    // Fetch all 18 weeks of the 2025 regular season
    for (let week = 1; week <= 18; week++) {
      try {
        const url = `${ESPN_BASE_URL}/scoreboard?seasontype=2&year=2025&week=${week}`;
        const response = await fetch(url);
        
        if (!response.ok) continue;
        
        const data = await response.json();
        
        // Process each game in the week
        for (const event of data.events || []) {
          const competition = event.competitions?.[0];
          if (!competition) continue;

          const homeTeam = competition.competitors?.find((c: any) => c.homeAway === 'home');
          const awayTeam = competition.competitors?.find((c: any) => c.homeAway === 'away');
          
          if (!homeTeam || !awayTeam) continue;

          const homeAbbr = homeTeam.team.abbreviation;
          const awayAbbr = awayTeam.team.abbreviation;
          
          // Store team info
          if (!teamInfo.has(homeAbbr)) {
            teamInfo.set(homeAbbr, {
              id: homeAbbr.toLowerCase(),
              name: homeTeam.team.displayName,
              city: homeTeam.team.location
            });
          }
          if (!teamInfo.has(awayAbbr)) {
            teamInfo.set(awayAbbr, {
              id: awayAbbr.toLowerCase(),
              name: awayTeam.team.displayName,
              city: awayTeam.team.location
            });
          }

          // Get game details
          const gameDate = new Date(event.date);
          const formattedDate = `${String(gameDate.getMonth() + 1).padStart(2, '0')}/${String(gameDate.getDate()).padStart(2, '0')}`;
          
          // Get broadcast info
          const broadcast = competition.broadcasts?.[0];
          const network = broadcast?.names?.[0] || broadcast?.market || "TBD";
          
          // Determine if divisional game
          const homeConf = TEAM_CONFERENCE_MAP[homeAbbr];
          const awayConf = TEAM_CONFERENCE_MAP[awayAbbr];
          const isDivisional = homeConf && awayConf && 
                              homeConf.conference === awayConf.conference && 
                              homeConf.division === awayConf.division;

          // Determine if primetime (evening games)
          const hour = gameDate.getHours();
          const isPrimetime = hour >= 19 || network.toLowerCase().includes('nbc') || 
                             network.toLowerCase().includes('espn') || 
                             network.toLowerCase().includes('amazon');

          // Create game for home team
          const homeGame: Game = {
            week,
            date: formattedDate,
            opponent: awayAbbr,
            isHome: true,
            time: gameDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            network,
            isDivisional,
            isPrimetime
          };

          // Create game for away team  
          const awayGame: Game = {
            week,
            date: formattedDate,
            opponent: homeAbbr,
            isHome: false,
            time: gameDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            network,
            isDivisional,
            isPrimetime
          };

          // Add games to team schedules
          if (!allGames.has(homeAbbr)) allGames.set(homeAbbr, []);
          if (!allGames.has(awayAbbr)) allGames.set(awayAbbr, []);
          
          allGames.get(homeAbbr)!.push(homeGame);
          allGames.get(awayAbbr)!.push(awayGame);
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.warn(`Failed to fetch week ${week}:`, error);
      }
    }

    // Add bye weeks for teams that don't have 18 games
    for (const [teamAbbr, games] of allGames.entries()) {
      if (games.length < 18) {
        const existingWeeks = new Set(games.map(g => g.week));
        for (let week = 1; week <= 18; week++) {
          if (!existingWeeks.has(week)) {
            games.push({
              week,
              date: "—",
              opponent: "BYE",
              isHome: true,
              time: "—",
              network: "—",
              isDivisional: false,
              isPrimetime: false,
              isBye: true
            });
          }
        }
        // Sort games by week
        games.sort((a, b) => a.week - b.week);
      }
    }

    // Organize into conference/division structure
    return this.organizeIntoConferences(allGames, teamInfo);
  }

  private static organizeIntoConferences(
    allGames: Map<string, Game[]>,
    teamInfo: Map<string, { name: string; city: string; id: string }>
  ): Conference[] {
    const conferences: Conference[] = [
      { name: 'AFC', color: 'hsl(214 100% 45%)', divisions: [] },
      { name: 'NFC', color: 'hsl(0 100% 50%)', divisions: [] }
    ];

    const divisions = ['East', 'North', 'South', 'West'];

    for (const conference of conferences) {
      for (const divisionName of divisions) {
        const division: Division = { name: divisionName, teams: [] };

        // Find all teams in this conference and division
        for (const [abbr, confDiv] of Object.entries(TEAM_CONFERENCE_MAP)) {
          if (confDiv.conference === conference.name && confDiv.division === divisionName) {
            const info = teamInfo.get(abbr);
            const games = allGames.get(abbr) || [];
            
            if (info && games.length > 0) {
              const team: Team = {
                id: info.id,
                name: info.name,
                abbreviation: abbr,
                city: info.city,
                projectedRecord: "—",
                games
              };
              division.teams.push(team);
            }
          }
        }

        if (division.teams.length > 0) {
          conference.divisions.push(division);
        }
      }
    }

    return conferences;
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

