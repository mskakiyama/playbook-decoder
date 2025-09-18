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
  let url = `${ESPN_BASE_URL}/scoreboard?seasontype=${seasonType}&year=${year}`;
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
  const years = [currentYear - 4, currentYear - 3, currentYear - 2, currentYear - 1, currentYear];
  const allGames: ESPNGame[] = [];
  
  try {
    // Fetch games for each year and season type
    for (const year of years) {
      // Regular season (seasonType: 2)
      for (let week = 1; week <= 18; week++) {
        try {
          const regularSeasonData = await fetchHistoricalGames(year, 2, week);
          allGames.push(...regularSeasonData.events);
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.warn(`Failed to fetch regular season week ${week} for ${year}:`, error);
        }
      }
      
      // Playoffs (seasonType: 3)
      try {
        const playoffData = await fetchHistoricalGames(year, 3);
        allGames.push(...playoffData.events);
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.warn(`Failed to fetch playoffs for ${year}:`, error);
      }
    }
  } catch (error) {
    console.error('Error fetching historical games:', error);
  }
  
  return allGames;
};

const generateMockPlayByPlay = (eventId: string): ESPNPlayByPlay => {
  const plays = [];
  const playTypes = ['pass', 'rush', 'punt', 'field goal', 'kickoff'];
  const players = ['J. Allen', 'S. Diggs', 'J. Cook', 'D. Knox', 'G. Davis', 'C. Samuel', 'T. Johnson'];
  
  for (let i = 0; i < 30; i++) {
    const quarter = Math.ceil((i + 1) / 8);
    const playType = playTypes[Math.floor(Math.random() * playTypes.length)];
    const isScoring = Math.random() < 0.1;
    const yardage = isScoring ? Math.floor(Math.random() * 40) + 10 : Math.floor(Math.random() * 20) - 5;
    
    plays.push({
      id: `play-${i + 1}`,
      sequenceNumber: (i + 1).toString(),
      type: {
        id: `${i + 1}`,
        text: playType,
        abbreviation: playType.substring(0, 4).toUpperCase()
      },
      text: `${yardage > 0 ? yardage : Math.abs(yardage)} yard ${playType} ${yardage > 0 ? 'gain' : 'loss'}`,
      awayScore: Math.floor(i / 10) * 7,
      homeScore: Math.floor(i / 8) * 7,
      period: {
        number: quarter,
        displayValue: `${quarter}`
      },
      clock: {
        displayValue: `${Math.floor(Math.random() * 15)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
      },
      scoringPlay: isScoring,
      wallclock: new Date().toISOString(),
      modified: new Date().toISOString(),
      coordinate: { x: Math.random() * 100, y: Math.random() * 50 },
      team: { id: '1' },
      participants: [{
        athlete: {
          id: `player-${i}`,
          fullName: players[Math.floor(Math.random() * players.length)],
          displayName: players[Math.floor(Math.random() * players.length)],
          shortName: players[Math.floor(Math.random() * players.length)],
          links: [],
          headshot: '',
          jersey: String(Math.floor(Math.random() * 99) + 1),
          position: { abbreviation: 'QB', displayName: 'Quarterback' },
          team: { id: '1' },
          active: true
        }
      }],
      start: {
        down: Math.floor(Math.random() * 4) + 1,
        distance: Math.floor(Math.random() * 15) + 1,
        yardLine: Math.floor(Math.random() * 100),
        team: { id: '1' },
        yardsToEndzone: Math.floor(Math.random() * 80) + 20,
        downDistanceText: `${Math.floor(Math.random() * 4) + 1} & ${Math.floor(Math.random() * 15) + 1}`,
        shortDownDistanceText: `${Math.floor(Math.random() * 4) + 1} & ${Math.floor(Math.random() * 15) + 1}`,
        possessionText: `BUF ${Math.floor(Math.random() * 50) + 25}`,
        team_abbreviation: 'BUF'
      },
      statYardage: yardage
    });
  }

  return {
    id: eventId,
    plays
  };
};

export const fetchPlayByPlay = async (eventId: string): Promise<ESPNPlayByPlay> => {
  try {
    const response = await fetch(`${ESPN_CORE_URL}/events/${eventId}/pbp`);
    if (!response.ok) {
      console.warn(`Play-by-play not available for event ${eventId}, using mock data`);
      return generateMockPlayByPlay(eventId);
    }
    return response.json();
  } catch (error) {
    console.warn(`Failed to fetch play-by-play for event ${eventId}, using mock data:`, error);
    return generateMockPlayByPlay(eventId);
  }
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