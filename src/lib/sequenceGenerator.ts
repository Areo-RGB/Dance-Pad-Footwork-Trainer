import { CellIndex, StepTarget } from '../types';
import { DRILL_PATTERNS } from './patterns';

/**
 * Generates the next target step for the dance pad drill based on selected patterns and the current step index.
 * 
 * @param settings - The user's drill settings, containing the active pattern IDs.
 * @param stepIndex - The current step number in the drill sequence.
 * @returns A new StepTarget object representing the next required foot placements.
 */
export function generateNextTarget(
  settings: { activeThemes: string[] },
  stepIndex: number
): StepTarget {
  const activeIds = settings.activeThemes || [];
  
  // 1. Collect all frames from the selected structural (non-random) themes
  let sequence: Omit<StepTarget, 'id'>[] = [];
  
  activeIds.forEach(themeId => {
    if (themeId !== 'random') {
      const themePatterns = DRILL_PATTERNS.filter(p => p.theme === themeId);
      themePatterns.forEach(pattern => {
        sequence.push(...pattern.frames);
      });
    }
  });

  // 2. Pure Random Mode
  if ((activeIds.includes('random') && sequence.length === 0) || activeIds.length === 0) {
    return generateRandomTarget();
  }

  // 3. Mixed Mode (Sequence + Random)
  if (activeIds.includes('random')) {
     if (Math.random() < 0.3) {
        return generateRandomTarget();
     }
  }

  // 4. Sequence Mode
  // If we reach this point, we simply pull the next frame from our concatenated sequence loop.
  // Using the modulo operator (%) ensures the sequence loops infinitely.
  const frame = sequence[stepIndex % sequence.length];
  
  return {
    ...frame,
    // We attach a unique ID to each target to force React to re-render and re-trigger animations
    // even if the same exact foot placement is generated twice in a row.
    id: `target-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  };
}

/**
 * Helper function to generate a truly random valid step target.
 */
function generateRandomTarget(): StepTarget {
  // 25% chance for a 'LR_SINGLE' (both feet on one pad)
  // 75% chance for a 'DOUBLE' (feet on two separate pads)
  const choices: ('DOUBLE' | 'LR_SINGLE')[] = ['DOUBLE', 'DOUBLE', 'DOUBLE', 'LR_SINGLE'];
  const chosenType = choices[Math.floor(Math.random() * choices.length)];

  if (chosenType === 'LR_SINGLE') {
    // Pick a random cell (0-8) for both feet
    const bothCell = Math.floor(Math.random() * 9) as CellIndex;
    return {
      type: 'LR_SINGLE',
      bothCell,
      id: `target-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
  } else {
    // For a DOUBLE step, left and right feet must be on DIFFERENT cells.
    let leftCell: CellIndex = 0;
    let rightCell: CellIndex = 8;
    
    // Keep generating random pairs until we get two different cells
    while (true) {
      leftCell = Math.floor(Math.random() * 9) as CellIndex;
      rightCell = Math.floor(Math.random() * 9) as CellIndex;
      if (leftCell !== rightCell) break;
    }

    return {
      type: 'DOUBLE',
      leftCell,
      rightCell,
      id: `target-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
  }
}
