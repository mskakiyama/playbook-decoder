const ESPN_BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl';
const CACHE_KEY = 'nfl_standings_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export interface TeamStandings {
  rank: number;
  team: string;
  abbreviation: string;
  record: string;
  winPct: number;
  div: string;
  conf: string;
  pf: number;
  pa: number;
  home: string;
  away: string;
  streak: string;
  logo?: string;
}

export interface DivisionStandings {
  name: string;
  teams: TeamStandings[];
}

export interface ConferenceStandings {
  name: string;
  divisions: DivisionStandings[];
}

export interface StandingsData {
  conferences: ConferenceStandings[];
  lastUpdated: string;
  week: number;
}

// Mock data fallback
const MOCK_STANDINGS: StandingsData = {
  conferences: [
    {
      name: "AFC",
      divisions: [
        {
          name: "East",
          teams: [
            { rank: 1, team: "Buffalo Bills", abbreviation: "BUF", record: "4-0-0", winPct: 1.000, div: "2-0-0", conf: "3-0-0", pf: 133, pa: 90, home: "3-0-0", away: "1-0-0", streak: "4W" },
            { rank: 2, team: "New England Patriots", abbreviation: "NE", record: "2-2-0", winPct: 0.500, div: "1-0-0", conf: "1-2-0", pf: 102, pa: 81, home: "1-2-0", away: "1-0-0", streak: "1W" },
            { rank: 3, team: "New York Jets", abbreviation: "NYJ", record: "0-3-0", winPct: 0.000, div: "0-1-0", conf: "0-2-0", pf: 69, pa: 93, home: "0-2-0", away: "0-1-0", streak: "3L" },
            { rank: 4, team: "Miami Dolphins", abbreviation: "MIA", record: "0-3-0", winPct: 0.000, div: "0-2-0", conf: "0-3-0", pf: 56, pa: 97, home: "0-1-0", away: "0-2-0", streak: "3L" }
          ]
        },
        {
          name: "North",
          teams: [
            { rank: 1, team: "Pittsburgh Steelers", abbreviation: "PIT", record: "3-1-0", winPct: 0.750, div: "0-0-0", conf: "2-0-0", pf: 96, pa: 98, home: "1-1-0", away: "2-0-0", streak: "2W" },
            { rank: 2, team: "Cincinnati Bengals", abbreviation: "CIN", record: "2-1-0", winPct: 0.667, div: "1-0-0", conf: "2-0-0", pf: 58, pa: 91, home: "1-0-0", away: "1-1-0", streak: "1L" },
            { rank: 3, team: "Baltimore Ravens", abbreviation: "BAL", record: "1-3-0", winPct: 0.250, div: "1-0-0", conf: "1-2-0", pf: 131, pa: 133, home: "1-1-0", away: "0-2-0", streak: "2L" },
            { rank: 4, team: "Cleveland Browns", abbreviation: "CLE", record: "1-3-0", winPct: 0.250, div: "0-1-0", conf: "1-2-0", pf: 85, pa: 102, home: "0-2-0", away: "1-1-0", streak: "1W" }
          ]
        },
        {
          name: "South",
          teams: [
            { rank: 1, team: "Indianapolis Colts", abbreviation: "IND", record: "3-1-0", winPct: 0.750, div: "1-0-0", conf: "2-1-0", pf: 110, pa: 85, home: "2-0-0", away: "1-1-0", streak: "3W" },
            { rank: 2, team: "Houston Texans", abbreviation: "HOU", record: "2-2-0", winPct: 0.500, div: "1-1-0", conf: "2-1-0", pf: 95, pa: 88, home: "1-1-0", away: "1-1-0", streak: "1L" },
            { rank: 3, team: "Tennessee Titans", abbreviation: "TEN", record: "1-3-0", winPct: 0.250, div: "0-1-0", conf: "1-2-0", pf: 72, pa: 105, home: "1-1-0", away: "0-2-0", streak: "2L" },
            { rank: 4, team: "Jacksonville Jaguars", abbreviation: "JAX", record: "1-3-0", winPct: 0.250, div: "0-2-0", conf: "0-3-0", pf: 68, pa: 112, home: "1-1-0", away: "0-2-0", streak: "1W" }
          ]
        },
        {
          name: "West",
          teams: [
            { rank: 1, team: "Los Angeles Chargers", abbreviation: "LAC", record: "3-1-0", winPct: 0.750, div: "1-0-0", conf: "2-1-0", pf: 98, pa: 76, home: "2-0-0", away: "1-1-0", streak: "1W" },
            { rank: 2, team: "Kansas City Chiefs", abbreviation: "KC", record: "2-2-0", winPct: 0.500, div: "1-0-0", conf: "1-2-0", pf: 89, pa: 92, home: "1-1-0", away: "1-1-0", streak: "1W" },
            { rank: 3, team: "Denver Broncos", abbreviation: "DEN", record: "2-2-0", winPct: 0.500, div: "0-1-0", conf: "1-2-0", pf: 78, pa: 85, home: "1-1-0", away: "1-1-0", streak: "2L" },
            { rank: 4, team: "Las Vegas Raiders", abbreviation: "LV", record: "1-3-0", winPct: 0.250, div: "0-1-0", conf: "0-3-0", pf: 70, pa: 105, home: "1-1-0", away: "0-2-0", streak: "1L" }
          ]
        }
      ]
    },
    {
      name: "NFC",
      divisions: [
        {
          name: "East",
          teams: [
            { rank: 1, team: "Philadelphia Eagles", abbreviation: "PHI", record: "4-0-0", winPct: 1.000, div: "1-0-0", conf: "3-0-0", pf: 120, pa: 62, home: "2-0-0", away: "2-0-0", streak: "4W" },
            { rank: 2, team: "Washington Commanders", abbreviation: "WAS", record: "2-2-0", winPct: 0.500, div: "1-1-0", conf: "2-1-0", pf: 88, pa: 85, home: "1-1-0", away: "1-1-0", streak: "1L" },
            { rank: 3, team: "Dallas Cowboys", abbreviation: "DAL", record: "1-2-1", winPct: 0.417, div: "0-1-1", conf: "1-1-1", pf: 95, pa: 102, home: "0-1-1", away: "1-1-0", streak: "1T" },
            { rank: 4, team: "New York Giants", abbreviation: "NYG", record: "1-3-0", winPct: 0.250, div: "0-2-0", conf: "0-3-0", pf: 65, pa: 110, home: "1-1-0", away: "0-2-0", streak: "1W" }
          ]
        },
        {
          name: "North",
          teams: [
            { rank: 1, team: "Minnesota Vikings", abbreviation: "MIN", record: "3-1-0", winPct: 0.750, div: "1-0-0", conf: "2-1-0", pf: 105, pa: 78, home: "2-0-0", away: "1-1-0", streak: "3W" },
            { rank: 2, team: "Green Bay Packers", abbreviation: "GB", record: "2-2-0", winPct: 0.500, div: "0-1-0", conf: "1-2-0", pf: 102, pa: 95, home: "1-1-0", away: "1-1-0", streak: "1T" },
            { rank: 3, team: "Detroit Lions", abbreviation: "DET", record: "2-2-0", winPct: 0.500, div: "1-1-0", conf: "1-2-0", pf: 88, pa: 92, home: "1-1-0", away: "1-1-0", streak: "1W" },
            { rank: 4, team: "Chicago Bears", abbreviation: "CHI", record: "1-3-0", winPct: 0.250, div: "0-1-0", conf: "1-2-0", pf: 75, pa: 98, home: "1-1-0", away: "0-2-0", streak: "2L" }
          ]
        },
        {
          name: "South",
          teams: [
            { rank: 1, team: "Tampa Bay Buccaneers", abbreviation: "TB", record: "3-1-0", winPct: 0.750, div: "1-0-0", conf: "3-0-0", pf: 112, pa: 70, home: "2-0-0", away: "1-1-0", streak: "1W" },
            { rank: 2, team: "Atlanta Falcons", abbreviation: "ATL", record: "2-2-0", winPct: 0.500, div: "1-1-0", conf: "2-1-0", pf: 85, pa: 88, home: "1-1-0", away: "1-1-0", streak: "1L" },
            { rank: 3, team: "New Orleans Saints", abbreviation: "NO", record: "2-2-0", winPct: 0.500, div: "0-1-0", conf: "1-2-0", pf: 78, pa: 82, home: "1-1-0", away: "1-1-0", streak: "2W" },
            { rank: 4, team: "Carolina Panthers", abbreviation: "CAR", record: "0-4-0", winPct: 0.000, div: "0-2-0", conf: "0-3-0", pf: 55, pa: 120, home: "0-2-0", away: "0-2-0", streak: "4L" }
          ]
        },
        {
          name: "West",
          teams: [
            { rank: 1, team: "San Francisco 49ers", abbreviation: "SF", record: "3-1-0", winPct: 0.750, div: "2-0-0", conf: "3-0-0", pf: 110, pa: 68, home: "2-0-0", away: "1-1-0", streak: "1W" },
            { rank: 2, team: "Seattle Seahawks", abbreviation: "SEA", record: "3-1-0", winPct: 0.750, div: "1-1-0", conf: "2-1-0", pf: 95, pa: 82, home: "2-0-0", away: "1-1-0", streak: "3W" },
            { rank: 3, team: "Los Angeles Rams", abbreviation: "LAR", record: "2-2-0", winPct: 0.500, div: "0-1-0", conf: "1-2-0", pf: 88, pa: 90, home: "1-1-0", away: "1-1-0", streak: "1L" },
            { rank: 4, team: "Arizona Cardinals", abbreviation: "ARI", record: "1-3-0", winPct: 0.250, div: "0-2-0", conf: "0-3-0", pf: 72, pa: 105, home: "1-1-0", away: "0-2-0", streak: "2L" }
          ]
        }
      ]
    }
  ],
  lastUpdated: "2025-09-29",
  week: 4
};

// Check if current date is during NFL game days (Sept 4, 2025 - Jan 4, 2026)
export const isGameSeason = (): boolean => {
  const now = new Date();
  const seasonStart = new Date('2025-09-04');
  const seasonEnd = new Date('2026-01-04');
  return now >= seasonStart && now <= seasonEnd;
};

// Cache management
const getCache = (): StandingsData | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    return data;
  } catch {
    return null;
  }
};

const setCache = (data: StandingsData) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Failed to cache standings:', error);
  }
};

export const clearStandingsCache = () => {
  localStorage.removeItem(CACHE_KEY);
};

// Fetch standings from ESPN API
export const fetchStandings = async (): Promise<StandingsData> => {
  // Check cache first
  const cached = getCache();
  if (cached) {
    console.log('✓ Using cached standings data');
    return cached;
  }

  try {
    // Try 2025 season first
    let url = `${ESPN_BASE_URL}/standings?season=2025&seasontype=2`;
    let response = await fetch(url);
    
    // If 2025 data not available, try 2024 season
    if (!response.ok || response.status === 404) {
      console.log('2025 standings not available, trying 2024 season');
      url = `${ESPN_BASE_URL}/standings?season=2024&seasontype=2`;
      response = await fetch(url);
    }

    if (!response.ok) {
      console.warn('Failed to fetch standings from ESPN, using mock data');
      setCache(MOCK_STANDINGS);
      return MOCK_STANDINGS;
    }

    const data = await response.json();
    const standings = parseESPNStandings(data);
    
    setCache(standings);
    console.log('✓ Fetched standings for', standings.week, 'week(s)');
    return standings;
  } catch (error) {
    console.error('Error fetching standings:', error);
    console.log('Using mock data as fallback');
    setCache(MOCK_STANDINGS);
    return MOCK_STANDINGS;
  }
};

// Parse ESPN standings response
const parseESPNStandings = (data: any): StandingsData => {
  const conferences: ConferenceStandings[] = [];
  let currentWeek = 1;

  if (data.season?.year) {
    currentWeek = parseInt(data.season.displayName?.match(/Week (\d+)/)?.[1] || '1');
  }

  // ESPN structure: data.children contains conferences
  if (data.children) {
    for (const confData of data.children) {
      const conferenceName = confData.name || confData.abbreviation;
      const divisions: DivisionStandings[] = [];

      // Parse standings entries for divisions
      if (confData.standings?.entries) {
        const divisionMap = new Map<string, TeamStandings[]>();

        for (const entry of confData.standings.entries) {
          const team = entry.team;
          const stats = entry.stats || [];
          
          let wins = 0, losses = 0, ties = 0, pf = 0, pa = 0;
          let divWins = 0, divLosses = 0, divTies = 0;
          let confWins = 0, confLosses = 0, confTies = 0;
          let homeWins = 0, homeLosses = 0, homeTies = 0;
          let awayWins = 0, awayLosses = 0, awayTies = 0;
          let streak = '';

          for (const stat of stats) {
            if (stat.name === 'wins') wins = parseInt(stat.value) || 0;
            if (stat.name === 'losses') losses = parseInt(stat.value) || 0;
            if (stat.name === 'ties') ties = parseInt(stat.value) || 0;
            if (stat.name === 'pointsFor') pf = parseInt(stat.value) || 0;
            if (stat.name === 'pointsAgainst') pa = parseInt(stat.value) || 0;
            if (stat.name === 'divisionWinPercent') {
              const divRecord = stat.displayValue?.split('-') || [];
              divWins = parseInt(divRecord[0]) || 0;
              divLosses = parseInt(divRecord[1]) || 0;
              divTies = parseInt(divRecord[2]) || 0;
            }
            if (stat.name === 'conferenceWinPercent') {
              const confRecord = stat.displayValue?.split('-') || [];
              confWins = parseInt(confRecord[0]) || 0;
              confLosses = parseInt(confRecord[1]) || 0;
              confTies = parseInt(confRecord[2]) || 0;
            }
            if (stat.name === 'streak') streak = stat.displayValue || '';
          }

          // Calculate home/away from total (simplified - ESPN doesn't always provide these)
          homeWins = Math.floor(wins / 2);
          homeLosses = Math.floor(losses / 2);
          awayWins = wins - homeWins;
          awayLosses = losses - homeLosses;

          const totalGames = wins + losses + ties;
          const winPct = totalGames > 0 ? wins / totalGames : 0;
          
          const record = ties > 0 ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`;
          const divRecord = divTies > 0 ? `${divWins}-${divLosses}-${divTies}` : `${divWins}-${divLosses}`;
          const confRecord = confTies > 0 ? `${confWins}-${confLosses}-${confTies}` : `${confWins}-${confLosses}`;
          const homeRecord = homeTies > 0 ? `${homeWins}-${homeLosses}-${homeTies}` : `${homeWins}-${homeLosses}`;
          const awayRecord = awayTies > 0 ? `${awayWins}-${awayLosses}-${awayTies}` : `${awayWins}-${awayLosses}`;

          const divisionName = team.groups?.isConferenceInGroup ? 
            team.groups.name.replace(/^(AFC|NFC)\s+/, '') : 'Unknown';

          const teamStanding: TeamStandings = {
            rank: 0, // Will be set later
            team: team.displayName || team.name,
            abbreviation: team.abbreviation,
            record,
            winPct: parseFloat(winPct.toFixed(3)),
            div: divRecord,
            conf: confRecord,
            pf,
            pa,
            home: homeRecord,
            away: awayRecord,
            streak: streak || '-',
            logo: team.logos?.[0]?.href
          };

          if (!divisionMap.has(divisionName)) {
            divisionMap.set(divisionName, []);
          }
          divisionMap.get(divisionName)!.push(teamStanding);
        }

        // Sort teams within each division and assign ranks
        divisionMap.forEach((teams, divName) => {
          teams.sort((a, b) => {
            if (b.winPct !== a.winPct) return b.winPct - a.winPct;
            // Tiebreaker: conference record
            const aConfWins = parseInt(a.conf.split('-')[0]);
            const bConfWins = parseInt(b.conf.split('-')[0]);
            return bConfWins - aConfWins;
          });

          teams.forEach((team, index) => {
            team.rank = index + 1;
          });

          divisions.push({
            name: divName,
            teams
          });
        });
      }

      // Sort divisions by standard order
      const divOrder = ['East', 'North', 'South', 'West'];
      divisions.sort((a, b) => divOrder.indexOf(a.name) - divOrder.indexOf(b.name));

      conferences.push({
        name: conferenceName,
        divisions
      });
    }
  }

  return {
    conferences,
    lastUpdated: new Date().toISOString().split('T')[0],
    week: currentWeek
  };
};

export const NFLStandingsAPI = {
  fetchStandings,
  clearCache: clearStandingsCache,
  isGameSeason
};
