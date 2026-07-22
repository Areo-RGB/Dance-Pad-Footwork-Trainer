export type CellIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type FootType = 'L' | 'R' | 'LR';

export type FootDirection = '↑' | '↗' | '→' | '↘' | '↓' | '↙' | '←' | '↖';

export interface StepTarget {
  type: 'SINGLE' | 'DOUBLE' | 'LR_SINGLE';
  leftCell?: CellIndex;
  rightCell?: CellIndex;
  bothCell?: CellIndex;
  id: string;
  leftDir?: FootDirection;
  rightDir?: FootDirection;
}

export type PlayMode = 'TRAINER' | 'INTERACTIVE';

export interface DrillSettings {
  mode: PlayMode;
  intervalTimeMs: number; // e.g., 1000ms = 1s per step
  targetSteps: number; // 0 for infinite
  
  // Themes
  activeThemes: string[];

  audioVoicePrompt: boolean;
  audioBeep: boolean;
  metronomeSound: boolean;
  countdownDelaySec: number; // 3 sec countdown before start
}

export interface StepHitRecord {
  stepIndex: number;
  target: StepTarget;
  hit: boolean;
  reactionTimeMs?: number;
  timestamp: number;
}

export interface DrillSessionResult {
  drillName: string;
  totalSteps: number;
  completedSteps: number;
  successfulHits: number;
  missedHits: number;
  accuracy: number; // percentage
  avgReactionTimeMs: number;
  durationSeconds: number;
  cellHitCounts: Record<CellIndex, number>;
  footCounts: {
    leftOnly: number;
    rightOnly: number;
    both: number;
  };
  stepRecords: StepHitRecord[];
  date: string;
}

export interface CellPosition {
  index: CellIndex;
  row: number;
  col: number;
  label: string;
  keyLabel: string;
  numpadKey: string;
}
