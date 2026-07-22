import { StepTarget, FootDirection } from '../types';

export type DrillTheme = 'linear' | 'rotational' | 'diagonals' | 'orientation' | 'random';

export interface DrillThemeDef {
  id: DrillTheme;
  title: string;
  subtitle: string;
  color: string;
}

export const DRILL_THEMES: DrillThemeDef[] = [
  { id: 'linear', title: 'Linear & Lateral', subtitle: 'Straight-line agility & side shuffles', color: 'sky' },
  { id: 'rotational', title: 'Pivots & Crossovers', subtitle: 'Hip twists and cross-body reaches', color: 'emerald' },
  { id: 'diagonals', title: 'Diagonals & Spreads', subtitle: 'Corner-to-corner surges and wide stances', color: 'amber' },
  { id: 'orientation', title: 'Orientation in Degrees', subtitle: 'V-stances, 45° to 90° rotational footwork', color: 'indigo' },
  { id: 'random', title: 'Reactive Chaos', subtitle: 'Unpredictable, spontaneous full-grid strikes', color: 'purple' }
];

export interface PatternDef {
  id: string;
  title: string;
  subtitle: string;
  theme: DrillTheme;
  frames: Omit<StepTarget, 'id'>[];
}

function parseFrames(framesArr: { L: number, R: number, Ld?: string, Rd?: string }[]): Omit<StepTarget, 'id'>[] {
  return framesArr.map(f => {
    const base = {
      leftDir: (f.Ld as FootDirection) || '↑',
      rightDir: (f.Rd as FootDirection) || '↑',
    };
    if (f.L === f.R) {
      return { ...base, type: 'LR_SINGLE', bothCell: f.L - 1 };
    }
    return { ...base, type: 'DOUBLE', leftCell: f.L - 1, rightCell: f.R - 1 };
  });
}

export const DRILL_PATTERNS: PatternDef[] = [
  // Linear
  { id: "tap_return_right", title: "Tap & Return — Right", subtitle: "Both together, R taps out, returns", theme: "linear", frames: parseFrames([{ L: 5, R: 5 },{ L: 5, R: 6 },{ L: 5, R: 5 }]) },
  { id: "tap_return_left", title: "Tap & Return — Left", subtitle: "Both together, L taps out, returns", theme: "linear", frames: parseFrames([{ L: 5, R: 5 },{ L: 4, R: 5 },{ L: 5, R: 5 }]) },
  { id: "forward_tap_left", title: "Forward Tap — Left", subtitle: "Both together, L reaches forward, returns", theme: "linear", frames: parseFrames([{ L: 5, R: 5 },{ L: 2, R: 5 },{ L: 5, R: 5 }]) },
  { id: "back_tap_right", title: "Back Tap — Right", subtitle: "Both together, R reaches back, returns", theme: "linear", frames: parseFrames([{ L: 5, R: 5 },{ L: 5, R: 8 },{ L: 5, R: 5 }]) },
  { id: "lateral_shuffle_right", title: "Lateral Shuffle →", subtitle: "Both feet shift one column right", theme: "linear", frames: parseFrames([{ L: 4, R: 5 },{ L: 5, R: 6 },{ L: 4, R: 5 }]) },
  { id: "lateral_shuffle_left", title: "Lateral Shuffle ←", subtitle: "Both feet shift one column left", theme: "linear", frames: parseFrames([{ L: 5, R: 6 },{ L: 4, R: 5 },{ L: 5, R: 6 }]) },
  
  // Rotational
  { id: "pivot_right_swings", title: "Pivot — Right Swings", subtitle: "L anchors, R sweeps back→front", theme: "rotational", frames: parseFrames([{ L: 4, R: 6 },{ L: 4, R: 9 },{ L: 4, R: 6 },{ L: 4, R: 3 },{ L: 4, R: 6 }]) },
  { id: "pivot_left_swings", title: "Pivot — Left Swings", subtitle: "R anchors, L sweeps front→back", theme: "rotational", frames: parseFrames([{ L: 4, R: 6 },{ L: 1, R: 6 },{ L: 4, R: 6 },{ L: 7, R: 6 },{ L: 4, R: 6 }]) },
  { id: "cross_step_shuffle", title: "Cross-Step Shuffle", subtitle: "L steps to top-center, R stays wide", theme: "rotational", frames: parseFrames([{ L: 4, R: 6 },{ L: 2, R: 6 },{ L: 4, R: 6 },{ L: 4, R: 8 },{ L: 4, R: 6 }]) },
  
  // Diagonals
  { id: "diagonal_chase_right", title: "Diagonal Chase ↗", subtitle: "Both feet surge forward-right, return", theme: "diagonals", frames: parseFrames([{ L: 7, R: 5 },{ L: 4, R: 2 },{ L: 7, R: 5 }]) },
  { id: "diagonal_chase_left", title: "Diagonal Chase ↙", subtitle: "Both feet surge back-left, return", theme: "diagonals", frames: parseFrames([{ L: 4, R: 2 },{ L: 7, R: 5 },{ L: 4, R: 2 }]) },
  { id: "wide_rock", title: "Wide Rock", subtitle: "Both feet spread to outer corners", theme: "diagonals", frames: parseFrames([{ L: 4, R: 6 },{ L: 7, R: 3 },{ L: 4, R: 6 },{ L: 1, R: 9 },{ L: 4, R: 6 }]) },
  
  // Orientation
  { id: "v_stance_pulse", title: "V-Stance Pulse", subtitle: "Toes open out and close — no cell movement", theme: "orientation", frames: parseFrames([{ L:5, R:5, Ld:'↑', Rd:'↑' },{ L:5, R:5, Ld:'←', Rd:'→' },{ L:5, R:5, Ld:'↑', Rd:'↑' }]) },
  { id: "toe_pivot_right", title: "Toe Pivot — Right", subtitle: "R heel anchors, toe sweeps to 90° external and back", theme: "orientation", frames: parseFrames([{ L:4, R:6, Ld:'↑', Rd:'↑' },{ L:4, R:6, Ld:'↑', Rd:'→' },{ L:4, R:6, Ld:'↑', Rd:'↑' }]) },
  { id: "toe_pivot_left", title: "Toe Pivot — Left", subtitle: "L heel anchors, toe sweeps to 90° external and back", theme: "orientation", frames: parseFrames([{ L:4, R:6, Ld:'↑', Rd:'↑' },{ L:4, R:6, Ld:'←', Rd:'↑' },{ L:4, R:6, Ld:'↑', Rd:'↑' }]) },
  { id: "duck_walk_tap", title: "Duck Walk Tap", subtitle: "V-stance throughout — feet tap out from together", theme: "orientation", frames: parseFrames([{ L:5, R:5, Ld:'←', Rd:'→' },{ L:2, R:5, Ld:'←', Rd:'→' },{ L:5, R:5, Ld:'←', Rd:'→' },{ L:5, R:8, Ld:'←', Rd:'→' },{ L:5, R:5, Ld:'←', Rd:'→' }]) },
  { id: "pigeon_tap", title: "Pigeon Tap", subtitle: "Mild toes-in (45°), R taps forward and returns", theme: "orientation", frames: parseFrames([{ L:5, R:5, Ld:'→', Rd:'←' },{ L:5, R:2, Ld:'→', Rd:'←' },{ L:5, R:5, Ld:'→', Rd:'←' },{ L:5, R:5, Ld:'↑', Rd:'↑' }]) },
  { id: "open_stance_lateral", title: "Open Stance Lateral", subtitle: "V-stance held while shuffling sideways", theme: "orientation", frames: parseFrames([{ L:4, R:6, Ld:'←', Rd:'→' },{ L:4, R:5, Ld:'←', Rd:'→' },{ L:5, R:6, Ld:'←', Rd:'→' },{ L:4, R:5, Ld:'←', Rd:'→' },{ L:4, R:6, Ld:'↑', Rd:'↑' }]) },
  { id: "parallel_turn_shuffle", title: "Parallel Turn Shuffle", subtitle: "Both toes angle right ~45° while shuffling", theme: "orientation", frames: parseFrames([{ L:4, R:5, Ld:'↑', Rd:'↑' },{ L:4, R:5, Ld:'→', Rd:'→' },{ L:5, R:6, Ld:'→', Rd:'→' },{ L:4, R:5, Ld:'→', Rd:'→' },{ L:4, R:5, Ld:'↑', Rd:'↑' }]) },
  
  // Random
  { id: "random_hits", title: "Random Hits", subtitle: "Unpredictable full-grid light-ups", theme: "random", frames: parseFrames([{ L: 2, R: 8 },{ L: 4, R: 6 },{ L: 5, R: 5 },{ L: 1, R: 9 }]) }
];
