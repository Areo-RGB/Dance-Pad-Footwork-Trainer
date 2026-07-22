import { CellIndex, CellPosition, StepTarget } from '../types';

export const GRID_CELLS: CellPosition[] = [
  { index: 0, row: 0, col: 0, label: 'Top Left', keyLabel: 'Q / 7', numpadKey: '7' },
  { index: 1, row: 0, col: 1, label: 'Top Center', keyLabel: 'W / 8', numpadKey: '8' },
  { index: 2, row: 0, col: 2, label: 'Top Right', keyLabel: 'E / 9', numpadKey: '9' },
  { index: 3, row: 1, col: 0, label: 'Left', keyLabel: 'A / 4', numpadKey: '4' },
  { index: 4, row: 1, col: 1, label: 'Center', keyLabel: 'S / 5', numpadKey: '5' },
  { index: 5, row: 1, col: 2, label: 'Right', keyLabel: 'D / 6', numpadKey: '6' },
  { index: 6, row: 2, col: 0, label: 'Bottom Left', keyLabel: 'Z / 1', numpadKey: '1' },
  { index: 7, row: 2, col: 1, label: 'Bottom Center', keyLabel: 'X / 2', numpadKey: '2' },
  { index: 8, row: 2, col: 2, label: 'Bottom Right', keyLabel: 'C / 3', numpadKey: '3' },
];

export const CELL_KEY_MAP: Record<string, CellIndex> = {
  'q': 0, '7': 0,
  'w': 1, '8': 1, 'ArrowUp': 1,
  'e': 2, '9': 2,
  'a': 3, '4': 3, 'ArrowLeft': 3,
  's': 4, '5': 4, ' ': 4,
  'd': 5, '6': 5, 'ArrowRight': 5,
  'z': 6, '1': 6,
  'x': 7, '2': 7, 'ArrowDown': 7,
  'c': 8, '3': 8,
};

// Calculate grid cell Euclidean distance
export function getCellDistance(idxA: CellIndex, idxB: CellIndex): number {
  const a = GRID_CELLS[idxA];
  const b = GRID_CELLS[idxB];
  return Math.sqrt(Math.pow(a.row - b.row, 2) + Math.pow(a.col - b.col, 2));
}

// Get text description for speech audio
export function getTargetSpeechText(target: StepTarget): string {
  if (target.type === 'LR_SINGLE' && target.bothCell !== undefined) {
    const cell = GRID_CELLS[target.bothCell];
    return `Jump ${cell.label}`;
  } else if (target.leftCell !== undefined && target.rightCell !== undefined) {
    const leftCell = GRID_CELLS[target.leftCell];
    const rightCell = GRID_CELLS[target.rightCell];
    return `Left ${leftCell.label}, Right ${rightCell.label}`;
  }
  return 'Step';
}
