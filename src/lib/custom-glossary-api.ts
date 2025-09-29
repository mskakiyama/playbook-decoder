// API Configuration - Update these URLs when ready to deploy
const API_BASE_URL = 'https://api.nflglossary.com/v1';
const ENDPOINTS = {
  plays: `${API_BASE_URL}/api/nfl-terms?category=plays`,
  positions: `${API_BASE_URL}/api/nfl-terms?category=positions`,
  penalties: `${API_BASE_URL}/api/nfl-penalties`
};

// TypeScript Interfaces
export interface GlossaryTerm {
  id: string;
  name: string;
  definition: string;
  category: 'rules' | 'positions' | 'penalties' | 'other';
  examples?: string[];
  relatedTerms?: string[];
}

interface NFLAPIResponse<T> {
  api_version: string;
  data: T[];
  metadata?: {
    total_terms?: number;
    source?: string;
  };
}

interface NFLPlay {
  term: string;
  definition: string;
}

interface NFLPosition {
  term: string;
  definition: string;
}

interface NFLPenalty {
  penalty: string;
  description: string;
}

// Mock/Fallback data
const mockPlays: NFLPlay[] = [
  { term: "Audible", definition: "A play called by the quarterback at the line of scrimmage to change the original play. It's like switching plans at the last second when you see what the defense is doing." },
  { term: "Blitz", definition: "When extra defenders (like linebackers or safeties) rush the quarterback to tackle him quickly. It's a risky move because it leaves fewer players to cover receivers." },
  { term: "Draw Play", definition: "A trick play where the quarterback pretends to pass but then hands the ball to a running back. It's designed to fool the defense into thinking it's a passing play." },
  { term: "Field Goal", definition: "When the kicker kicks the ball through the tall yellow goalposts to score 3 points. It usually happens when the team can't reach the end zone." },
  { term: "Flea Flicker", definition: "A trick play where the running back tosses the ball back to the quarterback, who then throws a long pass downfield. It's meant to confuse the defense." },
  { term: "Hail Mary", definition: "A long, desperate pass thrown toward the end zone, usually at the end of a game. It's called a 'Hail Mary' because it's a last-chance prayer for a touchdown." },
  { term: "Play-Action Pass", definition: "When the quarterback fakes handing the ball to a running back but then throws a pass instead. It tricks the defense into thinking it's a running play." },
  { term: "Screen Pass", definition: "A short pass to a running back or receiver behind the offensive line, with blockers in front to help them gain yards. It's designed to catch the defense off guard." },
  { term: "Touchdown", definition: "When a player carries the ball into the end zone or catches it there, scoring 6 points. It's the main way to score in football." }
];

const mockPositions: NFLPosition[] = [
  { term: "Center (C)", definition: "The offensive lineman who snaps (hikes) the ball to the quarterback to start each play. They're in the middle of the offensive line." },
  { term: "Cornerback (CB)", definition: "A defensive player who covers wide receivers to stop them from catching passes. They need to be fast and agile." },
  { term: "Defensive End (DE)", definition: "A player on the edge of the defensive line who tries to tackle the quarterback or stop running plays. They're key pass rushers." },
  { term: "Fullback (FB)", definition: "An offensive player who blocks for the running back or catches short passes. They're like a mix of a lineman and a running back." },
  { term: "Linebacker (LB)", definition: "A defensive player who lines up behind the defensive line. They stop runs, cover receivers, and sometimes rush the quarterback." },
  { term: "Quarterback (QB)", definition: "The leader of the offense who throws passes, hands off the ball, or sometimes runs with it. They're like the team's field general." },
  { term: "Running Back (RB)", definition: "A player on the offense who starts behind the quarterback and runs with the ball to gain yards. They can also catch short passes or block for other players. Think of them as the team's main ball-carrier, dodging defenders to move the ball forward." }
];

const mockPenalties: NFLPenalty[] = [
  { penalty: "False Start", description: "When an offensive player moves before the ball is snapped, like jumping early. It stops the play and moves the team back 5 yards." },
  { penalty: "Offside", description: "When a defensive player crosses the line before the play starts. It gives the offense 5 free yards." },
  { penalty: "Holding", description: "When a player grabs or holds another player illegally to stop them from moving. It's a 10-yard penalty, and the play may be replayed." },
  { penalty: "Pass Interference", description: "When a defender unfairly blocks or pushes a receiver trying to catch a pass. The penalty gives the offense the ball at the spot of the foul or a big yardage gain." },
  { penalty: "Roughing the Passer", description: "When a defender hits the quarterback too hard or late after they throw the ball. It's a 15-yard penalty and can lead to a first down." },
  { penalty: "Encroachment", description: "When a defensive player touches an offensive player or crosses the line before the snap. It's a 5-yard penalty for the offense." },
  { penalty: "Intentional Grounding", description: "When the quarterback throws the ball away on purpose to avoid being tackled (sacked) but doesn't aim for a nearby receiver. It's a penalty because it's seen as cheating to avoid a loss. The team loses 10 yards and the current play (down)." }
];

// Generic fetch function with error handling and fallback
async function fetchData<T>(url: string, fallbackData: T[]): Promise<T[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const json: NFLAPIResponse<T> = await response.json();
    return json.data || fallbackData;
  } catch (error) {
    console.log(`Using fallback data for ${url}`);
    return fallbackData; // Return fallback data instead of empty array
  }
}

// Helper function to generate slugs for IDs
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Fetch functions for each category with fallback data
export async function fetchNFLPlays(): Promise<NFLPlay[]> {
  return fetchData<NFLPlay>(ENDPOINTS.plays, mockPlays);
}

export async function fetchNFLPositions(): Promise<NFLPosition[]> {
  return fetchData<NFLPosition>(ENDPOINTS.positions, mockPositions);
}

export async function fetchNFLPenalties(): Promise<NFLPenalty[]> {
  return fetchData<NFLPenalty>(ENDPOINTS.penalties, mockPenalties);
}

// Transformation functions
export function transformPlaysToTerms(plays: NFLPlay[]): GlossaryTerm[] {
  return plays.map(play => ({
    id: generateSlug(play.term),
    name: play.term,
    definition: play.definition,
    category: 'rules' as const
  }));
}

export function transformPositionsToTerms(positions: NFLPosition[]): GlossaryTerm[] {
  return positions.map(position => ({
    id: generateSlug(position.term),
    name: position.term,
    definition: position.definition,
    category: 'positions' as const
  }));
}

export function transformPenaltiesToTerms(penalties: NFLPenalty[]): GlossaryTerm[] {
  return penalties.map(penalty => ({
    id: generateSlug(penalty.penalty),
    name: penalty.penalty,
    definition: penalty.description,
    category: 'penalties' as const
  }));
}

// Combined transformation function
export function transformToGlossaryTerms(
  plays: NFLPlay[],
  positions: NFLPosition[],
  penalties: NFLPenalty[]
): GlossaryTerm[] {
  const playTerms = transformPlaysToTerms(plays);
  const positionTerms = transformPositionsToTerms(positions);
  const penaltyTerms = transformPenaltiesToTerms(penalties);
  
  return [...playTerms, ...positionTerms, ...penaltyTerms].sort((a, b) => 
    a.name.localeCompare(b.name)
  );
}

// Search function (async to match hook expectations, but just filters locally)
export async function searchGlossaryTerms(query: string): Promise<GlossaryTerm[]> {
  // This is a placeholder that returns empty array
  // The actual search is done locally in the useGlossarySearch hook
  // This function exists for compatibility but isn't meant to be used with placeholder URLs
  return [];
}
