// ESPN API service for NFL Glossary data
export interface GlossaryTerm {
  id: string;
  name: string;
  definition: string;
  category: 'rules' | 'positions' | 'penalties' | 'other';
  examples?: string[];
  relatedTerms?: string[];
}

export interface ESPNRule {
  id: string;
  name: string;
  description: string;
  category?: string;
}

export interface ESPNPosition {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  side?: string; // offense/defense
}

export interface ESPNPenalty {
  id: string;
  name: string;
  description: string;
  yardage?: string;
  category?: string;
}

// API fetching functions
export const fetchNFLRules = async (): Promise<ESPNRule[]> => {
  try {
    const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/rules');
    if (!response.ok) throw new Error('Failed to fetch rules');
    const data = await response.json();
    
    // Transform ESPN rules data to our format
    return data.rules?.map((rule: any, index: number) => ({
      id: rule.id || `rule-${index}`,
      name: rule.name || rule.title,
      description: rule.description || rule.summary,
      category: rule.category || 'general'
    })) || getMockRules();
  } catch (error) {
    console.error('ESPN Rules API failed, using mock data:', error);
    return getMockRules();
  }
};

export const fetchNFLPositions = async (): Promise<ESPNPosition[]> => {
  try {
    const response = await fetch('https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions');
    if (!response.ok) throw new Error('Failed to fetch positions');
    const data = await response.json();
    
    // Transform ESPN positions data to our format
    return data.items?.map((position: any) => ({
      id: position.id,
      name: position.name,
      abbreviation: position.abbreviation,
      description: position.description || `${position.name} position`,
      side: position.side
    })) || getMockPositions();
  } catch (error) {
    console.error('ESPN Positions API failed, using mock data:', error);
    return getMockPositions();
  }
};

export const fetchNFLPenalties = async (): Promise<ESPNPenalty[]> => {
  try {
    const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/penalties');
    if (!response.ok) throw new Error('Failed to fetch penalties');
    const data = await response.json();
    
    // Transform ESPN penalties data to our format
    return data.penalties?.map((penalty: any, index: number) => ({
      id: penalty.id || `penalty-${index}`,
      name: penalty.name,
      description: penalty.description,
      yardage: penalty.yardage || penalty.yards,
      category: penalty.category
    })) || getMockPenalties();
  } catch (error) {
    console.error('ESPN Penalties API failed, using mock data:', error);
    return getMockPenalties();
  }
};

export const searchGlossaryTerms = async (query: string): Promise<GlossaryTerm[]> => {
  if (!query.trim()) return [];
  
  try {
    // Try ESPN search endpoint
    const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/search?q=${encodeURIComponent(query)}`);
    
    if (response.ok) {
      const data = await response.json();
      return data.results?.map((result: any, index: number) => ({
        id: result.id || `search-${index}`,
        name: result.name || result.title,
        definition: result.description || result.summary,
        category: 'other' as const,
      })) || [];
    }
  } catch (error) {
    console.error('ESPN Search API failed:', error);
  }
  
  return [];
};

// Transform API data to unified glossary format
export const transformToGlossaryTerms = (
  rules: ESPNRule[],
  positions: ESPNPosition[],
  penalties: ESPNPenalty[]
): GlossaryTerm[] => {
  const terms: GlossaryTerm[] = [];
  
  // Transform rules
  rules.forEach(rule => {
    terms.push({
      id: rule.id,
      name: rule.name,
      definition: rule.description,
      category: 'rules'
    });
  });
  
  // Transform positions
  positions.forEach(position => {
    terms.push({
      id: position.id,
      name: position.name,
      definition: `${position.description} (${position.abbreviation})`,
      category: 'positions'
    });
  });
  
  // Transform penalties
  penalties.forEach(penalty => {
    const definition = penalty.yardage 
      ? `${penalty.description} (${penalty.yardage} yards)`
      : penalty.description;
    
    terms.push({
      id: penalty.id,
      name: penalty.name,
      definition,
      category: 'penalties'
    });
  });
  
  return terms.sort((a, b) => a.name.localeCompare(b.name));
};

// Mock data fallbacks when APIs are unavailable
const getMockRules = (): ESPNRule[] => [
  {
    id: 'touchdown',
    name: 'Touchdown',
    description: 'Worth 6 points, scored when a player carries or catches the ball in the end zone'
  },
  {
    id: 'field-goal',
    name: 'Field Goal',
    description: 'Worth 3 points, scored by kicking the ball through the uprights'
  },
  {
    id: 'safety',
    name: 'Safety',
    description: 'Worth 2 points, scored when the offensive team is tackled in their own end zone'
  },
  {
    id: 'extra-point',
    name: 'Extra Point',
    description: 'Worth 1 point, kicked after a touchdown from the 15-yard line'
  },
  {
    id: 'two-point-conversion',
    name: 'Two-Point Conversion',
    description: 'Worth 2 points, attempted from the 2-yard line instead of kicking an extra point'
  },
  {
    id: 'interception',
    name: 'Interception',
    description: 'When the defense catches a pass intended for the offense, resulting in a turnover'
  },
  {
    id: 'fumble',
    name: 'Fumble',
    description: 'When a player loses control of the ball, which can be recovered by either team'
  },
  {
    id: 'sack',
    name: 'Sack',
    description: 'When the quarterback is tackled behind the line of scrimmage while attempting to pass'
  },
  {
    id: 'punt',
    name: 'Punt',
    description: 'A kick made when a team gives up possession on 4th down to flip field position'
  },
  {
    id: 'onside-kick',
    name: 'Onside Kick',
    description: 'A short kickoff designed to retain possession by traveling at least 10 yards'
  },
  {
    id: 'red-zone',
    name: 'Red Zone',
    description: 'The area between the 20-yard line and the goal line where scoring is more likely'
  },
  {
    id: 'turnover',
    name: 'Turnover',
    description: 'When possession of the ball changes from one team to the other'
  },
  {
    id: 'first-down',
    name: 'First Down',
    description: 'A fresh set of four downs earned by advancing the ball 10 yards or by penalty'
  },
  {
    id: 'blitz',
    name: 'Blitz',
    description: 'When the defense sends extra pass rushers beyond the usual four linemen'
  },
  {
    id: 'audible',
    name: 'Audible',
    description: 'When the quarterback changes the play at the line of scrimmage based on the defense'
  }
];

const getMockPositions = (): ESPNPosition[] => [
  {
    id: 'qb',
    name: 'Quarterback',
    abbreviation: 'QB',
    description: 'The field general who throws passes and leads the offense',
    side: 'offense'
  },
  {
    id: 'rb',
    name: 'Running Back',
    abbreviation: 'RB',
    description: 'Carries the ball and catches passes out of the backfield',
    side: 'offense'
  },
  {
    id: 'fb',
    name: 'Fullback',
    abbreviation: 'FB',
    description: 'Primarily blocks for the running back but can also carry and catch',
    side: 'offense'
  },
  {
    id: 'wr',
    name: 'Wide Receiver',
    abbreviation: 'WR',
    description: 'Runs routes and catches passes from the quarterback',
    side: 'offense'
  },
  {
    id: 'te',
    name: 'Tight End',
    abbreviation: 'TE',
    description: 'Blocks and catches passes, hybrid between lineman and receiver',
    side: 'offense'
  },
  {
    id: 'c',
    name: 'Center',
    abbreviation: 'C',
    description: 'Snaps the ball to the quarterback and anchors the offensive line',
    side: 'offense'
  },
  {
    id: 'g',
    name: 'Guard',
    abbreviation: 'G',
    description: 'Offensive lineman who blocks next to the center',
    side: 'offense'
  },
  {
    id: 't',
    name: 'Tackle',
    abbreviation: 'T',
    description: 'Offensive lineman who protects the outside of the line',
    side: 'offense'
  },
  {
    id: 'de',
    name: 'Defensive End',
    abbreviation: 'DE',
    description: 'Rushes the passer and sets the edge against running plays',
    side: 'defense'
  },
  {
    id: 'dt',
    name: 'Defensive Tackle',
    abbreviation: 'DT',
    description: 'Interior lineman who stops runs and rushes the passer',
    side: 'defense'
  },
  {
    id: 'lb',
    name: 'Linebacker',
    abbreviation: 'LB',
    description: 'Defends against run and pass, covers middle of the field',
    side: 'defense'
  },
  {
    id: 'cb',
    name: 'Cornerback',
    abbreviation: 'CB',
    description: 'Covers wide receivers and defends against passes',
    side: 'defense'
  },
  {
    id: 's',
    name: 'Safety',
    abbreviation: 'S',
    description: 'Deep defender who provides help over the top in coverage',
    side: 'defense'
  },
  {
    id: 'fs',
    name: 'Free Safety',
    abbreviation: 'FS',
    description: 'Safety responsible for deep coverage and reading the quarterback',
    side: 'defense'
  },
  {
    id: 'ss',
    name: 'Strong Safety',
    abbreviation: 'SS',
    description: 'Safety who plays closer to the line and helps in run support',
    side: 'defense'
  },
  {
    id: 'k',
    name: 'Kicker',
    abbreviation: 'K',
    description: 'Kicks field goals and extra points',
    side: 'special teams'
  },
  {
    id: 'p',
    name: 'Punter',
    abbreviation: 'P',
    description: 'Kicks the ball away on 4th down to flip field position',
    side: 'special teams'
  },
  {
    id: 'ls',
    name: 'Long Snapper',
    abbreviation: 'LS',
    description: 'Snaps the ball on punts and field goal attempts',
    side: 'special teams'
  }
];

const getMockPenalties = (): ESPNPenalty[] => [
  {
    id: 'holding',
    name: 'Holding',
    description: 'Illegally grabbing or restraining an opponent to prevent them from moving',
    yardage: '10'
  },
  {
    id: 'offsides',
    name: 'Offsides',
    description: 'Defensive player crosses the line of scrimmage before the snap',
    yardage: '5'
  },
  {
    id: 'false-start',
    name: 'False Start',
    description: 'Offensive player moves before the snap, causing play to be blown dead',
    yardage: '5'
  },
  {
    id: 'pass-interference',
    name: 'Pass Interference',
    description: 'Illegally preventing a receiver from catching a pass through early contact',
    yardage: 'Spot foul'
  },
  {
    id: 'roughing-passer',
    name: 'Roughing the Passer',
    description: 'Illegally hitting the quarterback after he has thrown the ball',
    yardage: '15'
  },
  {
    id: 'face-mask',
    name: 'Face Mask',
    description: 'Illegally grabbing or twisting a player\'s face mask',
    yardage: '15'
  },
  {
    id: 'unsportsmanlike-conduct',
    name: 'Unsportsmanlike Conduct',
    description: 'Behavior that goes against the spirit of fair play',
    yardage: '15'
  },
  {
    id: 'delay-of-game',
    name: 'Delay of Game',
    description: 'Failing to snap the ball before the play clock expires',
    yardage: '5'
  },
  {
    id: 'encroachment',
    name: 'Encroachment',
    description: 'Defensive player making contact with an opponent before the snap',
    yardage: '5'
  },
  {
    id: 'illegal-formation',
    name: 'Illegal Formation',
    description: 'Not having the required number of players on the line of scrimmage',
    yardage: '5'
  },
  {
    id: 'intentional-grounding',
    name: 'Intentional Grounding',
    description: 'Quarterback throws ball away to avoid a sack without eligible receiver nearby',
    yardage: '10 + loss of down'
  },
  {
    id: 'illegal-block-in-back',
    name: 'Illegal Block in the Back',
    description: 'Blocking an opponent from behind when not in close line play',
    yardage: '10'
  },
  {
    id: 'clipping',
    name: 'Clipping',
    description: 'Blocking an opponent below the waist from behind',
    yardage: '15'
  },
  {
    id: 'neutral-zone-infraction',
    name: 'Neutral Zone Infraction',
    description: 'Defensive player enters neutral zone causing offensive player to false start',
    yardage: '5'
  },
  {
    id: 'illegal-hands-to-face',
    name: 'Illegal Hands to the Face',
    description: 'Using hands or arms to contact opponent\'s face mask or neck area',
    yardage: '10'
  },
  {
    id: 'horse-collar-tackle',
    name: 'Horse Collar Tackle',
    description: 'Tackling by grabbing inside collar or shoulder pads from behind',
    yardage: '15'
  }
];