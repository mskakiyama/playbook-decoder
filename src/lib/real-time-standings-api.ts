import { StandingsData, TeamStandings } from './nfl-standings-api';

export interface LiveGame {
  gameId: string;
  status: 'PRE' | 'LIVE' | 'FINAL';
  quarter: string;
  timeRemaining: string;
  homeTeam: {
    abbr: string;
    name: string;
    score: number;
    possession: boolean;
    redZone: boolean;
  };
  awayTeam: {
    abbr: string;
    name: string;
    score: number;
    possession: boolean;
    redZone: boolean;
  };
  lastPlay: string;
  lastUpdate: number;
}

export interface TeamAnalytics extends TeamStandings {
  offensiveEPA: number;
  defensiveEPA: number;
  successRate: number;
  explosivePlayRate: number;
  thirdDownConversion: number;
  redZoneEfficiency: number;
  turnoverDifferential: number;
  strengthOfSchedule: number;
  playoffProbability: number;
  powerRanking: number;
  rankChange: number;
  isLive: boolean;
  liveGameId?: string;
}

// Mock live games for simulation
export const MOCK_LIVE_GAMES: LiveGame[] = [
  {
    gameId: 'KC-BUF-2024-W14',
    status: 'LIVE',
    quarter: 'Q3',
    timeRemaining: '8:42',
    homeTeam: {
      abbr: 'BUF',
      name: 'Buffalo Bills',
      score: 17,
      possession: true,
      redZone: false,
    },
    awayTeam: {
      abbr: 'KC',
      name: 'Kansas City Chiefs',
      score: 21,
      possession: false,
      redZone: false,
    },
    lastPlay: 'Allen 15-yard pass to Diggs - First Down',
    lastUpdate: Date.now(),
  },
  {
    gameId: 'BAL-SF-2024-W14',
    status: 'LIVE',
    quarter: 'Q2',
    timeRemaining: '5:23',
    homeTeam: {
      abbr: 'SF',
      name: 'San Francisco 49ers',
      score: 14,
      possession: false,
      redZone: false,
    },
    awayTeam: {
      abbr: 'BAL',
      name: 'Baltimore Ravens',
      score: 10,
      possession: true,
      redZone: true,
    },
    lastPlay: 'Jackson rush for 8 yards',
    lastUpdate: Date.now(),
  },
  {
    gameId: 'IND-DEN-2024-W14',
    status: 'LIVE',
    quarter: 'Q4',
    timeRemaining: '12:15',
    homeTeam: {
      abbr: 'DEN',
      name: 'Denver Broncos',
      score: 24,
      possession: false,
      redZone: false,
    },
    awayTeam: {
      abbr: 'IND',
      name: 'Indianapolis Colts',
      score: 27,
      possession: true,
      redZone: false,
    },
    lastPlay: 'Taylor rush for 12 yards - First Down',
    lastUpdate: Date.now(),
  },
  {
    gameId: 'DAL-PHI-2024-W14',
    status: 'LIVE',
    quarter: 'Q1',
    timeRemaining: '3:47',
    homeTeam: {
      abbr: 'PHI',
      name: 'Philadelphia Eagles',
      score: 7,
      possession: false,
      redZone: false,
    },
    awayTeam: {
      abbr: 'DAL',
      name: 'Dallas Cowboys',
      score: 3,
      possession: true,
      redZone: false,
    },
    lastPlay: 'Prescott incomplete pass',
    lastUpdate: Date.now(),
  },
];

// Generate advanced analytics for teams
export const generateTeamAnalytics = (team: TeamStandings, liveGames: LiveGame[]): TeamAnalytics => {
  // Check if team is currently playing
  const liveGame = liveGames.find(
    (game) =>
      game.status === 'LIVE' &&
      (game.homeTeam.abbr === team.abbreviation || game.awayTeam.abbr === team.abbreviation)
  );

  // Mock analytics based on team performance
  const totalGames = parseInt(team.record.split('-')[0]) + parseInt(team.record.split('-')[1]);
  const wins = parseInt(team.record.split('-')[0]);
  
  return {
    ...team,
    offensiveEPA: 0.15 + (team.winPct - 0.5) * 0.3 + Math.random() * 0.1,
    defensiveEPA: -0.05 - (team.winPct - 0.5) * 0.2 - Math.random() * 0.1,
    successRate: 45 + team.winPct * 15 + Math.random() * 5,
    explosivePlayRate: 12 + team.winPct * 8 + Math.random() * 3,
    thirdDownConversion: 35 + team.winPct * 15 + Math.random() * 5,
    redZoneEfficiency: 50 + team.winPct * 20 + Math.random() * 5,
    turnoverDifferential: Math.floor((team.pf - team.pa) / 50),
    strengthOfSchedule: 0.45 + Math.random() * 0.1,
    playoffProbability: Math.min(95, Math.max(5, team.winPct * 100 + Math.random() * 20)),
    powerRanking: Math.floor(1 + (1 - team.winPct) * 31),
    rankChange: Math.floor(Math.random() * 3) - 1,
    isLive: !!liveGame,
    liveGameId: liveGame?.gameId,
  };
};

// Simulate live game updates
export const simulateLiveGameUpdate = (game: LiveGame): LiveGame => {
  const scoringPlays = [
    { type: 'TD', points: 7, description: 'Touchdown!' },
    { type: 'FG', points: 3, description: 'Field Goal' },
    { type: 'SAFETY', points: 2, description: 'Safety!' },
  ];

  const regularPlays = [
    'Complete pass for 12 yards',
    'Rush for 5 yards',
    'Incomplete pass',
    'Rush for no gain',
    'Complete pass for 18 yards - First Down',
    'Sack for loss of 7 yards',
    'Rush for 8 yards',
    'Complete pass for 25 yards',
  ];

  // 10% chance of scoring play
  const isScoring = Math.random() < 0.1;
  const isPossessionChange = Math.random() < 0.3;

  let updatedGame = { ...game };

  if (isScoring) {
    const play = scoringPlays[Math.floor(Math.random() * scoringPlays.length)];
    const scoringTeam = game.homeTeam.possession ? 'home' : 'away';
    
    if (scoringTeam === 'home') {
      updatedGame.homeTeam = {
        ...game.homeTeam,
        score: game.homeTeam.score + play.points,
      };
    } else {
      updatedGame.awayTeam = {
        ...game.awayTeam,
        score: game.awayTeam.score + play.points,
      };
    }
    
    updatedGame.lastPlay = `${play.description} ${play.type}!`;
    updatedGame.lastUpdate = Date.now();
  } else {
    updatedGame.lastPlay = regularPlays[Math.floor(Math.random() * regularPlays.length)];
    updatedGame.lastUpdate = Date.now();
  }

  // Update possession
  if (isPossessionChange) {
    updatedGame.homeTeam = {
      ...updatedGame.homeTeam,
      possession: !game.homeTeam.possession,
      redZone: Math.random() < 0.2,
    };
    updatedGame.awayTeam = {
      ...updatedGame.awayTeam,
      possession: !game.awayTeam.possession,
      redZone: Math.random() < 0.2,
    };
  }

  // Update time
  const [quarter, time] = game.quarter.split(' ');
  const [minutes, seconds] = (time || game.timeRemaining).split(':').map(Number);
  
  let newMinutes = minutes;
  let newSeconds = seconds - Math.floor(Math.random() * 30 + 10);
  
  if (newSeconds < 0) {
    newMinutes--;
    newSeconds += 60;
  }
  
  if (newMinutes < 0) {
    // Quarter ended
    const quarterNum = parseInt(quarter.replace('Q', ''));
    if (quarterNum < 4) {
      updatedGame.quarter = `Q${quarterNum + 1}`;
      updatedGame.timeRemaining = '15:00';
    } else {
      updatedGame.status = 'FINAL';
      updatedGame.timeRemaining = 'Final';
    }
  } else {
    updatedGame.timeRemaining = `${newMinutes}:${newSeconds.toString().padStart(2, '0')}`;
  }

  return updatedGame;
};

export const RealTimeStandingsAPI = {
  getLiveGames: () => [...MOCK_LIVE_GAMES],
  generateTeamAnalytics,
  simulateLiveGameUpdate,
};
