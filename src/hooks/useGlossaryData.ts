import { useQuery } from '@tanstack/react-query';
import {
  fetchNFLRules,
  fetchNFLPositions,
  fetchNFLPenalties,
  searchGlossaryTerms,
  transformToGlossaryTerms,
  GlossaryTerm
} from '@/lib/espn-glossary-api';

export const useNFLRules = () => {
  return useQuery({
    queryKey: ['nfl-rules'],
    queryFn: fetchNFLRules,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - rules don't change often
    retry: 2,
  });
};

export const useNFLPositions = () => {
  return useQuery({
    queryKey: ['nfl-positions'],
    queryFn: fetchNFLPositions,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - positions are static
    retry: 2,
  });
};

export const useNFLPenalties = () => {
  return useQuery({
    queryKey: ['nfl-penalties'],
    queryFn: fetchNFLPenalties,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - penalties don't change often
    retry: 2,
  });
};

export const useGlossaryTerms = () => {
  const { data: rules, isLoading: rulesLoading, error: rulesError } = useNFLRules();
  const { data: positions, isLoading: positionsLoading, error: positionsError } = useNFLPositions();
  const { data: penalties, isLoading: penaltiesLoading, error: penaltiesError } = useNFLPenalties();

  return useQuery({
    queryKey: ['glossary-terms', rules, positions, penalties],
    queryFn: () => {
      if (!rules || !positions || !penalties) {
        throw new Error('Required data not available');
      }
      return transformToGlossaryTerms(rules, positions, penalties);
    },
    enabled: !!rules && !!positions && !!penalties,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    select: (data) => {
      // Group terms by category
      const grouped = {
        rules: data.filter(term => term.category === 'rules'),
        positions: data.filter(term => term.category === 'positions'),
        penalties: data.filter(term => term.category === 'penalties'),
        other: data.filter(term => term.category === 'other')
      };
      
      return {
        all: data,
        grouped,
        total: data.length
      };
    }
  });
};

export const useGlossarySearch = (searchTerm: string) => {
  const { data: allTerms } = useGlossaryTerms();
  
  return useQuery({
    queryKey: ['glossary-search', searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];
      
      // First search locally
      const localResults = allTerms?.all.filter(term =>
        term.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];
      
      // Then try ESPN search API for additional results
      try {
        const apiResults = await searchGlossaryTerms(searchTerm);
        
        // Combine and deduplicate results
        const combinedResults = [...localResults];
        apiResults.forEach(apiResult => {
          if (!combinedResults.some(local => 
            local.name.toLowerCase() === apiResult.name.toLowerCase()
          )) {
            combinedResults.push(apiResult);
          }
        });
        
        return combinedResults.sort((a, b) => a.name.localeCompare(b.name));
      } catch (error) {
        console.error('Search API failed, using local results only:', error);
        return localResults;
      }
    },
    enabled: !!searchTerm.trim() && !!allTerms,
    staleTime: 1000 * 60 * 5, // 5 minutes for search results
  });
};

// Hook for filtering terms within a specific category
export const useFilteredTerms = (category: GlossaryTerm['category'], filter: string) => {
  const { data: glossaryData } = useGlossaryTerms();
  
  if (!glossaryData || !filter.trim()) {
    return glossaryData?.grouped[category] || [];
  }
  
  return glossaryData.grouped[category].filter(term =>
    term.name.toLowerCase().includes(filter.toLowerCase()) ||
    term.definition.toLowerCase().includes(filter.toLowerCase())
  );
};

// Hook to get stats about the glossary
export const useGlossaryStats = () => {
  const { data: glossaryData, isLoading } = useGlossaryTerms();
  
  if (isLoading || !glossaryData) {
    return {
      total: 0,
      byCategory: {
        rules: 0,
        positions: 0,
        penalties: 0,
        other: 0
      }
    };
  }
  
  return {
    total: glossaryData.total,
    byCategory: {
      rules: glossaryData.grouped.rules.length,
      positions: glossaryData.grouped.positions.length,
      penalties: glossaryData.grouped.penalties.length,
      other: glossaryData.grouped.other.length
    }
  };
};