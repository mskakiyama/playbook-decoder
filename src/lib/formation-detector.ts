// Formation Detection Logic

export const detectFormation = (description: string, playType: string): string => {
  const desc = description.toLowerCase();
  
  // Specific formation keywords
  if (desc.includes('shotgun') || desc.includes('gun')) {
    if (desc.includes('trips') || desc.includes('bunch')) {
      return 'trips-right';
    }
    if (desc.includes('empty')) {
      return 'empty-set';
    }
    return 'shotgun-spread';
  }
  
  if (desc.includes('pistol')) {
    return 'pistol';
  }
  
  if (desc.includes('i-form') || desc.includes('power') || desc.includes('iso')) {
    return 'i-formation';
  }
  
  if (desc.includes('goal line') || desc.includes('goalline') || desc.includes('short yardage')) {
    return 'goal-line';
  }
  
  if (desc.includes('empty') || desc.includes('five wide') || desc.includes('5 wide')) {
    return 'empty-set';
  }
  
  if (desc.includes('trips') || desc.includes('bunch') || desc.includes('stack')) {
    return 'trips-right';
  }
  
  // Play type based defaults
  if (playType === 'passing') {
    // Check for deep/long passes
    if (desc.includes('deep') || desc.includes('long') || desc.includes('bomb')) {
      return 'shotgun-spread';
    }
    // Screen passes
    if (desc.includes('screen')) {
      return 'shotgun-spread';
    }
    // Default passing formation
    return 'shotgun-spread';
  }
  
  if (playType === 'rushing') {
    // Check for power running
    if (desc.includes('middle') || desc.includes('up the middle') || desc.includes('dive')) {
      return 'i-formation';
    }
    // Check for outside runs
    if (desc.includes('left end') || desc.includes('right end') || desc.includes('sweep') || desc.includes('outside')) {
      return 'pistol';
    }
    // Check for short yardage
    if (desc.includes('short') || desc.includes('1 yard') || desc.includes('inches')) {
      return 'goal-line';
    }
    // Default rushing formation
    return 'i-formation';
  }
  
  // Default fallback
  return 'shotgun-spread';
};

// Get formation display name
export const getFormationDisplayName = (formationKey: string): string => {
  const formationNames: Record<string, string> = {
    'shotgun-spread': 'Shotgun Spread',
    'i-formation': 'I-Formation',
    'pistol': 'Pistol',
    'trips-right': 'Trips Right',
    'empty-set': 'Empty Set',
    'goal-line': 'Goal Line',
  };
  
  return formationNames[formationKey] || 'Standard Formation';
};
