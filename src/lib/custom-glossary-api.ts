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

// Helper function to generate slugs for IDs
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Generic fetch function with error handling
async function fetchData<T>(url: string): Promise<T[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const json: NFLAPIResponse<T> = await response.json();
    return json.data || [];
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error);
    return []; // Graceful fallback
  }
}

// Fetch functions for each category
export async function fetchNFLPlays(): Promise<NFLPlay[]> {
  return fetchData<NFLPlay>(ENDPOINTS.plays);
}

export async function fetchNFLPositions(): Promise<NFLPosition[]> {
  return fetchData<NFLPosition>(ENDPOINTS.positions);
}

export async function fetchNFLPenalties(): Promise<NFLPenalty[]> {
  return fetchData<NFLPenalty>(ENDPOINTS.penalties);
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
