// NFL Formation Library with Player Positions

export interface PlayerPosition {
  position: string;
  label: string;
  x: number; // 0-100 percentage of canvas width
  y: number; // 0-100 percentage of canvas height
  color: string;
  route?: Array<{ x: number; y: number }>; // For receivers/defenders
}

export interface FormationData {
  name: string;
  offensivePersonnel: string;
  defensivePersonnel: string;
  playerPositions: PlayerPosition[];
}

// Offensive Formations
export const FORMATIONS: Record<string, FormationData> = {
  'shotgun-spread': {
    name: 'Shotgun Spread',
    offensivePersonnel: '11 Personnel (1 RB, 1 TE, 3 WR)',
    defensivePersonnel: 'Nickel (5 DB, 2 LB, 4 DL)',
    playerPositions: [
      // Offensive Line
      { position: 'LT', label: 'LT', x: 35, y: 70, color: '#1e40af' },
      { position: 'LG', label: 'LG', x: 42, y: 70, color: '#1e40af' },
      { position: 'C', label: 'C', x: 50, y: 70, color: '#1e40af' },
      { position: 'RG', label: 'RG', x: 58, y: 70, color: '#1e40af' },
      { position: 'RT', label: 'RT', x: 65, y: 70, color: '#1e40af' },
      // Quarterback
      { position: 'QB', label: 'QB', x: 50, y: 80, color: '#dc2626' },
      // Running Back
      { position: 'RB', label: 'RB', x: 60, y: 80, color: '#eab308' },
      // Wide Receivers
      { position: 'WR1', label: 'WR', x: 10, y: 70, color: '#16a34a', route: [{ x: 10, y: 70 }, { x: 15, y: 40 }, { x: 25, y: 20 }] },
      { position: 'WR2', label: 'WR', x: 25, y: 70, color: '#16a34a', route: [{ x: 25, y: 70 }, { x: 30, y: 50 }, { x: 40, y: 30 }] },
      { position: 'WR3', label: 'WR', x: 90, y: 70, color: '#16a34a', route: [{ x: 90, y: 70 }, { x: 85, y: 40 }, { x: 75, y: 20 }] },
      // Tight End
      { position: 'TE', label: 'TE', x: 72, y: 70, color: '#0891b2' },
      // Defense - Nickel
      { position: 'DT1', label: 'DT', x: 45, y: 35, color: '#6b7280' },
      { position: 'DT2', label: 'DT', x: 55, y: 35, color: '#6b7280' },
      { position: 'DE1', label: 'DE', x: 35, y: 35, color: '#6b7280' },
      { position: 'DE2', label: 'DE', x: 65, y: 35, color: '#6b7280' },
      { position: 'LB1', label: 'LB', x: 40, y: 25, color: '#9ca3af' },
      { position: 'LB2', label: 'LB', x: 60, y: 25, color: '#9ca3af' },
      { position: 'CB1', label: 'CB', x: 15, y: 45, color: '#4b5563' },
      { position: 'CB2', label: 'CB', x: 85, y: 45, color: '#4b5563' },
      { position: 'S1', label: 'S', x: 35, y: 15, color: '#374151' },
      { position: 'S2', label: 'S', x: 65, y: 15, color: '#374151' },
      { position: 'NB', label: 'NB', x: 50, y: 20, color: '#4b5563' },
    ],
  },
  'i-formation': {
    name: 'I-Formation',
    offensivePersonnel: '21 Personnel (2 RB, 1 TE, 2 WR)',
    defensivePersonnel: '4-3 Base (4 DL, 3 LB, 4 DB)',
    playerPositions: [
      // Offensive Line
      { position: 'LT', label: 'LT', x: 35, y: 70, color: '#1e40af' },
      { position: 'LG', label: 'LG', x: 42, y: 70, color: '#1e40af' },
      { position: 'C', label: 'C', x: 50, y: 70, color: '#1e40af' },
      { position: 'RG', label: 'RG', x: 58, y: 70, color: '#1e40af' },
      { position: 'RT', label: 'RT', x: 65, y: 70, color: '#1e40af' },
      // Quarterback
      { position: 'QB', label: 'QB', x: 50, y: 78, color: '#dc2626' },
      // Fullback
      { position: 'FB', label: 'FB', x: 50, y: 85, color: '#f97316' },
      // Running Back
      { position: 'RB', label: 'RB', x: 50, y: 92, color: '#eab308' },
      // Wide Receivers
      { position: 'WR1', label: 'WR', x: 10, y: 70, color: '#16a34a' },
      { position: 'WR2', label: 'WR', x: 90, y: 70, color: '#16a34a' },
      // Tight End
      { position: 'TE', label: 'TE', x: 72, y: 70, color: '#0891b2' },
      // Defense - 4-3
      { position: 'DT1', label: 'DT', x: 45, y: 40, color: '#6b7280' },
      { position: 'DT2', label: 'DT', x: 55, y: 40, color: '#6b7280' },
      { position: 'DE1', label: 'DE', x: 30, y: 40, color: '#6b7280' },
      { position: 'DE2', label: 'DE', x: 70, y: 40, color: '#6b7280' },
      { position: 'MLB', label: 'MLB', x: 50, y: 30, color: '#9ca3af' },
      { position: 'LB1', label: 'LB', x: 35, y: 30, color: '#9ca3af' },
      { position: 'LB2', label: 'LB', x: 65, y: 30, color: '#9ca3af' },
      { position: 'CB1', label: 'CB', x: 15, y: 50, color: '#4b5563' },
      { position: 'CB2', label: 'CB', x: 85, y: 50, color: '#4b5563' },
      { position: 'S1', label: 'S', x: 35, y: 15, color: '#374151' },
      { position: 'S2', label: 'S', x: 65, y: 15, color: '#374151' },
    ],
  },
  'pistol': {
    name: 'Pistol Formation',
    offensivePersonnel: '11 Personnel (1 RB, 1 TE, 3 WR)',
    defensivePersonnel: 'Nickel (5 DB, 2 LB, 4 DL)',
    playerPositions: [
      // Offensive Line
      { position: 'LT', label: 'LT', x: 35, y: 70, color: '#1e40af' },
      { position: 'LG', label: 'LG', x: 42, y: 70, color: '#1e40af' },
      { position: 'C', label: 'C', x: 50, y: 70, color: '#1e40af' },
      { position: 'RG', label: 'RG', x: 58, y: 70, color: '#1e40af' },
      { position: 'RT', label: 'RT', x: 65, y: 70, color: '#1e40af' },
      // Quarterback
      { position: 'QB', label: 'QB', x: 50, y: 78, color: '#dc2626' },
      // Running Back
      { position: 'RB', label: 'RB', x: 50, y: 88, color: '#eab308' },
      // Wide Receivers
      { position: 'WR1', label: 'WR', x: 10, y: 70, color: '#16a34a', route: [{ x: 10, y: 70 }, { x: 10, y: 30 }] },
      { position: 'WR2', label: 'WR', x: 25, y: 70, color: '#16a34a', route: [{ x: 25, y: 70 }, { x: 35, y: 40 }] },
      { position: 'WR3', label: 'WR', x: 90, y: 70, color: '#16a34a', route: [{ x: 90, y: 70 }, { x: 80, y: 30 }] },
      // Tight End
      { position: 'TE', label: 'TE', x: 72, y: 70, color: '#0891b2' },
      // Defense - Nickel
      { position: 'DT1', label: 'DT', x: 45, y: 35, color: '#6b7280' },
      { position: 'DT2', label: 'DT', x: 55, y: 35, color: '#6b7280' },
      { position: 'DE1', label: 'DE', x: 35, y: 35, color: '#6b7280' },
      { position: 'DE2', label: 'DE', x: 65, y: 35, color: '#6b7280' },
      { position: 'LB1', label: 'LB', x: 40, y: 25, color: '#9ca3af' },
      { position: 'LB2', label: 'LB', x: 60, y: 25, color: '#9ca3af' },
      { position: 'CB1', label: 'CB', x: 15, y: 50, color: '#4b5563' },
      { position: 'CB2', label: 'CB', x: 85, y: 50, color: '#4b5563' },
      { position: 'S1', label: 'S', x: 35, y: 15, color: '#374151' },
      { position: 'S2', label: 'S', x: 65, y: 15, color: '#374151' },
      { position: 'NB', label: 'NB', x: 50, y: 20, color: '#4b5563' },
    ],
  },
  'trips-right': {
    name: 'Trips Right',
    offensivePersonnel: '11 Personnel (1 RB, 1 TE, 3 WR)',
    defensivePersonnel: 'Nickel (5 DB, 2 LB, 4 DL)',
    playerPositions: [
      // Offensive Line
      { position: 'LT', label: 'LT', x: 35, y: 70, color: '#1e40af' },
      { position: 'LG', label: 'LG', x: 42, y: 70, color: '#1e40af' },
      { position: 'C', label: 'C', x: 50, y: 70, color: '#1e40af' },
      { position: 'RG', label: 'RG', x: 58, y: 70, color: '#1e40af' },
      { position: 'RT', label: 'RT', x: 65, y: 70, color: '#1e40af' },
      // Quarterback
      { position: 'QB', label: 'QB', x: 50, y: 80, color: '#dc2626' },
      // Running Back
      { position: 'RB', label: 'RB', x: 40, y: 80, color: '#eab308' },
      // Wide Receivers - 3 on right side
      { position: 'WR1', label: 'WR', x: 75, y: 70, color: '#16a34a', route: [{ x: 75, y: 70 }, { x: 75, y: 30 }] },
      { position: 'WR2', label: 'WR', x: 82, y: 70, color: '#16a34a', route: [{ x: 82, y: 70 }, { x: 90, y: 40 }] },
      { position: 'WR3', label: 'WR', x: 90, y: 70, color: '#16a34a', route: [{ x: 90, y: 70 }, { x: 88, y: 20 }] },
      // Tight End on left
      { position: 'TE', label: 'TE', x: 10, y: 70, color: '#0891b2' },
      // Defense - Adjusted to Trips
      { position: 'DT1', label: 'DT', x: 45, y: 35, color: '#6b7280' },
      { position: 'DT2', label: 'DT', x: 55, y: 35, color: '#6b7280' },
      { position: 'DE1', label: 'DE', x: 35, y: 35, color: '#6b7280' },
      { position: 'DE2', label: 'DE', x: 65, y: 35, color: '#6b7280' },
      { position: 'LB1', label: 'LB', x: 40, y: 25, color: '#9ca3af' },
      { position: 'LB2', label: 'LB', x: 60, y: 25, color: '#9ca3af' },
      { position: 'CB1', label: 'CB', x: 15, y: 50, color: '#4b5563' },
      { position: 'CB2', label: 'CB', x: 75, y: 50, color: '#4b5563' },
      { position: 'CB3', label: 'CB', x: 85, y: 50, color: '#4b5563' },
      { position: 'S1', label: 'S', x: 30, y: 15, color: '#374151' },
      { position: 'S2', label: 'S', x: 70, y: 15, color: '#374151' },
    ],
  },
  'empty-set': {
    name: 'Empty Set',
    offensivePersonnel: '10 Personnel (0 RB, 1 TE, 4 WR)',
    defensivePersonnel: 'Dime (6 DB, 1 LB, 4 DL)',
    playerPositions: [
      // Offensive Line
      { position: 'LT', label: 'LT', x: 35, y: 70, color: '#1e40af' },
      { position: 'LG', label: 'LG', x: 42, y: 70, color: '#1e40af' },
      { position: 'C', label: 'C', x: 50, y: 70, color: '#1e40af' },
      { position: 'RG', label: 'RG', x: 58, y: 70, color: '#1e40af' },
      { position: 'RT', label: 'RT', x: 65, y: 70, color: '#1e40af' },
      // Quarterback
      { position: 'QB', label: 'QB', x: 50, y: 80, color: '#dc2626' },
      // Wide Receivers - spread out
      { position: 'WR1', label: 'WR', x: 10, y: 70, color: '#16a34a', route: [{ x: 10, y: 70 }, { x: 15, y: 30 }] },
      { position: 'WR2', label: 'WR', x: 25, y: 75, color: '#16a34a', route: [{ x: 25, y: 75 }, { x: 30, y: 40 }] },
      { position: 'WR3', label: 'WR', x: 75, y: 75, color: '#16a34a', route: [{ x: 75, y: 75 }, { x: 70, y: 40 }] },
      { position: 'WR4', label: 'WR', x: 90, y: 70, color: '#16a34a', route: [{ x: 90, y: 70 }, { x: 85, y: 30 }] },
      // Tight End in slot
      { position: 'TE', label: 'TE', x: 72, y: 70, color: '#0891b2' },
      // Defense - Dime
      { position: 'DT1', label: 'DT', x: 45, y: 35, color: '#6b7280' },
      { position: 'DT2', label: 'DT', x: 55, y: 35, color: '#6b7280' },
      { position: 'DE1', label: 'DE', x: 35, y: 35, color: '#6b7280' },
      { position: 'DE2', label: 'DE', x: 65, y: 35, color: '#6b7280' },
      { position: 'LB', label: 'LB', x: 50, y: 25, color: '#9ca3af' },
      { position: 'CB1', label: 'CB', x: 15, y: 50, color: '#4b5563' },
      { position: 'CB2', label: 'CB', x: 30, y: 50, color: '#4b5563' },
      { position: 'CB3', label: 'CB', x: 70, y: 50, color: '#4b5563' },
      { position: 'CB4', label: 'CB', x: 85, y: 50, color: '#4b5563' },
      { position: 'S1', label: 'S', x: 35, y: 15, color: '#374151' },
      { position: 'S2', label: 'S', x: 65, y: 15, color: '#374151' },
    ],
  },
  'goal-line': {
    name: 'Goal Line',
    offensivePersonnel: '22 Personnel (2 RB, 2 TE, 1 WR)',
    defensivePersonnel: 'Goal Line (5 DL, 3 LB, 3 DB)',
    playerPositions: [
      // Offensive Line - tight
      { position: 'LT', label: 'LT', x: 38, y: 70, color: '#1e40af' },
      { position: 'LG', label: 'LG', x: 45, y: 70, color: '#1e40af' },
      { position: 'C', label: 'C', x: 50, y: 70, color: '#1e40af' },
      { position: 'RG', label: 'RG', x: 55, y: 70, color: '#1e40af' },
      { position: 'RT', label: 'RT', x: 62, y: 70, color: '#1e40af' },
      // Tight Ends
      { position: 'TE1', label: 'TE', x: 32, y: 70, color: '#0891b2' },
      { position: 'TE2', label: 'TE', x: 68, y: 70, color: '#0891b2' },
      // Quarterback
      { position: 'QB', label: 'QB', x: 50, y: 78, color: '#dc2626' },
      // Running Backs
      { position: 'FB', label: 'FB', x: 50, y: 85, color: '#f97316' },
      { position: 'RB', label: 'RB', x: 50, y: 92, color: '#eab308' },
      // Wide Receiver
      { position: 'WR', label: 'WR', x: 10, y: 70, color: '#16a34a' },
      // Defense - Goal Line
      { position: 'DT1', label: 'DT', x: 42, y: 45, color: '#6b7280' },
      { position: 'DT2', label: 'DT', x: 50, y: 45, color: '#6b7280' },
      { position: 'DT3', label: 'DT', x: 58, y: 45, color: '#6b7280' },
      { position: 'DE1', label: 'DE', x: 32, y: 45, color: '#6b7280' },
      { position: 'DE2', label: 'DE', x: 68, y: 45, color: '#6b7280' },
      { position: 'LB1', label: 'LB', x: 35, y: 35, color: '#9ca3af' },
      { position: 'LB2', label: 'LB', x: 50, y: 35, color: '#9ca3af' },
      { position: 'LB3', label: 'LB', x: 65, y: 35, color: '#9ca3af' },
      { position: 'CB1', label: 'CB', x: 15, y: 50, color: '#4b5563' },
      { position: 'CB2', label: 'CB', x: 85, y: 50, color: '#4b5563' },
      { position: 'S', label: 'S', x: 50, y: 20, color: '#374151' },
    ],
  },
};
