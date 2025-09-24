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
  }
];

const getMockPenalties = (): ESPNPenalty[] => [
  {
    id: 'holding',
    name: 'Holding',
    description: 'Illegally grabbing or restraining an opponent',
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
    description: 'Offensive player moves before the snap',
    yardage: '5'
  },
  {
    id: 'pass-interference',
    name: 'Pass Interference',
    description: 'Illegally preventing a receiver from catching a pass',
    yardage: 'Spot foul'
  },
  {
    id: 'roughing-passer',
    name: 'Roughing the Passer',
    description: 'Illegally hitting the quarterback after he has thrown the ball',
    yardage: '15'
  }
];