const ESPN_BASE_URL = "https://site.api.espn.com/apis/site/v2/sports/football/nfl";
const ESPN_CORE_URL = "https://sports.core.api.espn.com/v2/sports/football/leagues/nfl";

// ESPN API Types
export interface ESPNGame {
  id: string;
  date: string;
  name: string;
  shortName: string;
  competitions: Array<{
    id: string;
    date: string;
    attendance: number;
    type: {
      id: string;
      abbreviation: string;
    };
    timeValid: boolean;
    neutralSite: boolean;
    conferenceCompetition: boolean;
    playByPlayAvailable: boolean;
    recent: boolean;
    venue: {
      id: string;
      fullName: string;
      address: {
        city: string;
        state: string;
      };
    };
    competitors: Array<{
      id: string;
      uid: string;
      type: string;
      order: number;
      homeAway: string;
      winner: boolean;
      team: {
        id: string;
        uid: string;
        location: string;
        name: string;
        abbreviation: string;
        displayName: string;
        shortDisplayName: string;
        color: string;
        alternateColor: string;
        isActive: boolean;
        venue: {
          id: string;
        };
        links: Array<{
          rel: string[];
          href: string;
          text: string;
          isExternal: boolean;
          isPremium: boolean;
        }>;
        logo: string;
      };
      score: string;
      linescores: Array<{
        value: number;
      }>;
      statistics: any[];
      records: Array<{
        name: string;
        abbreviation: string;
        type: string;
        summary: string;
      }>;
    }>;
    notes: any[];
    status: {
      clock: number;
      displayClock: string;
      period: number;
      type: {
        id: string;
        name: string;
        state: string;
        completed: boolean;
        description: string;
        detail: string;
        shortDetail: string;
      };
    };
    broadcasts: any[];
    leaders: any[];
    format: {
      regulation: {
        periods: number;
      };
    };
    startDate: string;
    geoBroadcasts: any[];
    headlines: any[];
  }>;
  links: any[];
  weather?: {
    displayValue: string;
    temperature: number;
    highTemperature: number;
    conditionId: string;
    link: {
      rel: string[];
      href: string;
    };
  };
  status: {
    clock: number;
    displayClock: string;
    period: number;
    type: {
      id: string;
      name: string;
      state: string;
      completed: boolean;
      description: string;
      detail: string;
      shortDetail: string;
    };
  };
  season: {
    year: number;
    type: number;
    name: string;
    displayName: string;
  };
  week: {
    number: number;
  };
}

export interface ESPNScoreboard {
  leagues: Array<{
    id: string;
    uid: string;
    name: string;
    abbreviation: string;
    slug: string;
    season: {
      year: number;
      startDate: string;
      endDate: string;
      displayName: string;
      type: {
        id: string;
        type: number;
        name: string;
        abbreviation: string;
      };
    };
    logos: Array<{
      href: string;
      width: number;
      height: number;
      alt: string;
      rel: string[];
      lastUpdated: string;
    }>;
    calendarType: string;
    calendarIsWhitelist: boolean;
    calendarStartDate: string;
    calendarEndDate: string;
    calendar: string[];
  }>;
  season: {
    type: number;
    year: number;
  };
  week: {
    number: number;
  };
  events: ESPNGame[];
}

export interface ESPNPlayByPlay {
  id: string;
  plays: Array<{
    id: string;
    sequenceNumber: string;
    type: {
      id: string;
      text: string;
      abbreviation: string;
    };
    text: string;
    awayScore: number;
    homeScore: number;
    period: {
      number: number;
      displayValue: string;
    };
    clock: {
      displayValue: string;
    };
    scoringPlay: boolean;
    wallclock: string;
    modified: string;
    coordinate: {
      x: number;
      y: number;
    };
    team: {
      id: string;
    };
    participants: Array<{
      athlete: {
        id: string;
        fullName: string;
        displayName: string;
        shortName: string;
        links: Array<{
          rel: string[];
          href: string;
        }>;
        headshot: string;
        jersey: string;
        position: {
          abbreviation: string;
          displayName: string;
        };
        team: {
          id: string;
        };
        active: boolean;
      };
    }>;
    drive?: {
      description: string;
      start: {
        yardLine: number;
        text: string;
      };
      timeElapsed: {
        displayValue: string;
      };
    };
    start?: {
      down: number;
      distance: number;
      yardLine: number;
      team: {
        id: string;
      };
      yardsToEndzone: number;
      downDistanceText: string;
      shortDownDistanceText: string;
      possessionText: string;
      team_abbreviation: string;
    };
    end?: {
      down: number;
      distance: number;
      yardLine: number;
      team: {
        id: string;
      };
      yardsToEndzone: number;
      downDistanceText: string;
      shortDownDistanceText: string;
      possessionText: string;
      team_abbreviation: string;
    };
    statYardage?: number;
  }>;
}

// API Functions
export const fetchNFLScoreboard = async (): Promise<ESPNScoreboard> => {
  const response = await fetch(`${ESPN_BASE_URL}/scoreboard`);
  if (!response.ok) {
    throw new Error('Failed to fetch NFL scoreboard');
  }
  return response.json();
};

export const fetchHistoricalGames = async (year: number, seasonType: number, week?: number): Promise<ESPNScoreboard> => {
  let url = `${ESPN_BASE_URL}/scoreboard?seasonType=${seasonType}&seasonYear=${year}`;
  if (week) {
    url += `&week=${week}`;
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch historical games for ${year}`);
  }
  return response.json();
};

export const fetchAllHistoricalGames = async (): Promise<ESPNGame[]> => {
  const currentYear = new Date().getFullYear();
  const years = [2021, 2022, 2023, 2024, 2025];
  const allGames: ESPNGame[] = [];
  
  try {
    // Fetch games for each year and season type
    for (const year of years) {
      try {
        // Regular season (seasonType: 2) - fetch entire season at once
        console.log(`Fetching regular season games for ${year}...`);
        const regularSeasonData = await fetchHistoricalGames(year, 2);
        allGames.push(...regularSeasonData.events);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Playoffs (seasonType: 3) - fetch entire playoffs at once
        console.log(`Fetching playoff games for ${year}...`);
        const playoffData = await fetchHistoricalGames(year, 3);
        allGames.push(...playoffData.events);
        
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.warn(`Failed to fetch games for ${year}:`, error);
      }
    }
    
    console.log(`Successfully fetched ${allGames.length} historical games`);
  } catch (error) {
    console.error('Error fetching historical games:', error);
  }
  
  return allGames;
};

export const fetchPlayByPlay = async (eventId: string): Promise<ESPNPlayByPlay> => {
  const response = await fetch(`${ESPN_CORE_URL}/events/${eventId}/pbp`);
  if (!response.ok) {
    throw new Error(`Failed to fetch play-by-play for event ${eventId}`);
  }
  return response.json();
};

// Helper functions to transform ESPN data to our app format
export const transformESPNGameToAppGame = (espnGame: ESPNGame) => {
  const competition = espnGame.competitions[0];
  const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
  const awayTeam = competition.competitors.find(c => c.homeAway === 'away');
  
  // Determine season type
  const seasonType = espnGame.season?.type === 1 ? 'Preseason' : 
                     espnGame.season?.type === 3 ? 'Playoffs' : 'Regular Season';
  
  return {
    id: espnGame.id,
    homeTeam: homeTeam?.team.displayName || '',
    awayTeam: awayTeam?.team.displayName || '',
    homeScore: parseInt(homeTeam?.score || '0'),
    awayScore: parseInt(awayTeam?.score || '0'),
    quarter: competition.status.type.shortDetail,
    date: new Date(espnGame.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    week: espnGame.week ? `${seasonType} Week ${espnGame.week.number}` : seasonType,
    season: espnGame.season?.year || new Date().getFullYear(),
    seasonType: seasonType
  };
};

export const transformESPNPlayToAppPlay = (espnPlay: any, index: number) => {
  const playType = espnPlay.type?.text?.toLowerCase().includes('pass') ? 'passing' : 
                   espnPlay.type?.text?.toLowerCase().includes('rush') ? 'rushing' : 'special';
  
  const yardage = espnPlay.statYardage || 0;
  const success = yardage > 0 || espnPlay.scoringPlay;
  
  return {
    id: index + 1,
    quarter: espnPlay.period?.number || 1,
    time: espnPlay.clock?.displayValue || '0:00',
    down: espnPlay.start?.down || 1,
    distance: espnPlay.start?.distance || 10,
    yardLine: espnPlay.start?.possessionText || 'Unknown',
    playType,
    result: espnPlay.scoringPlay ? 'Touchdown' : (success ? 'Success' : 'Incomplete'),
    description: espnPlay.text || 'No description available',
    players: espnPlay.participants?.map((p: any) => p.athlete?.displayName).filter(Boolean) || [],
    yards: yardage,
    success,
    keyPlay: espnPlay.scoringPlay || Math.abs(yardage) > 15
  };
};