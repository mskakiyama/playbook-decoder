// Play Summary Generator

interface Play {
  description: string;
  players: string[];
  yards: number;
  playType: string;
  result: string;
  down?: number;
  distance?: number;
}

export const generatePlaySummary = (play: Play): string => {
  const { description, players, yards, playType, result, down, distance } = play;
  
  // Extract key information
  const leadPlayer = players && players.length > 0 ? players[0] : "The offense";
  const additionalPlayers = players && players.length > 1 
    ? players.slice(1, 3).join(" and ") 
    : null;
  
  const yardDescription = yards > 0 
    ? `${yards}-yard gain` 
    : yards < 0 
    ? `${Math.abs(yards)}-yard loss` 
    : 'no gain';
  
  // Build first sentence based on play type
  let summary = '';
  
  if (playType === 'passing') {
    if (description.toLowerCase().includes('pass')) {
      summary = `${leadPlayer} executes a passing play resulting in a ${yardDescription}. `;
    } else {
      summary = `${description} for a ${yardDescription}. `;
    }
  } else if (playType === 'rushing') {
    if (description.toLowerCase().includes('rush')) {
      summary = `${leadPlayer} carries the ball for a ${yardDescription}. `;
    } else {
      summary = `${description} results in a ${yardDescription}. `;
    }
  } else {
    summary = `${description} `;
  }
  
  // Add result-based context
  if (result === 'Touchdown') {
    summary += 'This spectacular play results in a touchdown, electrifying the crowd and shifting momentum. ';
  } else if (result === 'First Down') {
    summary += 'The play moves the chains for a crucial first down, keeping the drive alive. ';
  } else if (result === 'Interception') {
    summary += 'However, the defense intercepts the pass, creating a critical turnover. ';
  } else if (result === 'Fumble') {
    summary += 'The ball comes loose, leading to a fumble that changes possession. ';
  } else if (result === 'Sack') {
    summary += 'The quarterback is sacked behind the line of scrimmage, forcing a loss of yards. ';
  } else if (result === 'Incomplete') {
    summary += 'The pass falls incomplete, stopping the clock. ';
  } else if (yards > 15) {
    summary += 'This explosive play gains significant yardage and field position. ';
  } else if (yards < -5) {
    summary += 'The defense makes a powerful stop, forcing the offense backwards. ';
  } else if (down && down >= 3 && yards >= distance) {
    summary += 'A critical conversion on a key down keeps the drive moving forward. ';
  }
  
  // Add additional players if available
  if (additionalPlayers) {
    summary += `Key contributors include ${additionalPlayers}.`;
  } else if (yards > 20) {
    summary += 'The execution and athleticism on display highlight elite-level performance.';
  }
  
  return summary.trim();
};
