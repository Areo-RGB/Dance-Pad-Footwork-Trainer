import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CellIndex, StepTarget } from '../types';
import { GRID_CELLS } from '../lib/drills';

interface DanceGridProps {
  currentTarget: StepTarget | null;
  interactiveActiveCells: Set<CellIndex>;
  isCountingDown: boolean;
  countdownVal: number;
  onCellClick: (index: CellIndex) => void;
}

export const DanceGrid: React.FC<DanceGridProps> = ({
  currentTarget,
  interactiveActiveCells,
  isCountingDown,
  countdownVal,
  onCellClick,
}) => {
  const getCellFootState = (cellIndex: CellIndex) => {
    if (!currentTarget) return null;

    if (currentTarget.type === 'LR_SINGLE') {
      if (currentTarget.bothCell === cellIndex) return 'LR';
    } else {
      const isLeft = currentTarget.leftCell === cellIndex;
      const isRight = currentTarget.rightCell === cellIndex;

      if (isLeft && isRight) return 'LR';
      if (isLeft) return 'L';
      if (isRight) return 'R';
    }

    return null;
  };

  return (
    <div className="relative w-full mx-auto aspect-square p-0">
      {/* 3x3 Grid Container */}
      <div className="grid grid-cols-3 gap-1 w-full h-full bg-zinc-800 p-0 rounded-none">
        {GRID_CELLS.map((cell) => {
          const footState = getCellFootState(cell.index);
          const isUserTapped = interactiveActiveCells.has(cell.index);

          // Directionals
          let leftDir = currentTarget?.leftDir || '↑';
          let rightDir = currentTarget?.rightDir || '↑';

          // Theme styling rules
          let bgStyle = 'bg-zinc-900 text-zinc-600 hover:bg-zinc-800';
          let borderStyle = 'border-2 border-zinc-800/50';
          let label: React.ReactNode = '';
          let activeClass = '';

          if (footState === 'L') {
            bgStyle = 'bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] z-10';
            borderStyle = 'border-2 border-emerald-400';
            label = (
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="text-xl font-black leading-none">{leftDir}</span>
                <span>L</span>
              </div>
            );
            activeClass = 'font-bold text-2xl';
          } else if (footState === 'R') {
            bgStyle = 'bg-sky-500 text-zinc-950 shadow-[0_0_15px_rgba(14,165,233,0.3)] z-10';
            borderStyle = 'border-2 border-sky-400';
            label = (
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="text-xl font-black leading-none">{rightDir}</span>
                <span>R</span>
              </div>
            );
            activeClass = 'font-bold text-2xl';
          } else if (footState === 'LR') {
            bgStyle = 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] z-10';
            borderStyle = 'border-2 border-indigo-400';
            label = (
              <div className="flex items-center justify-center gap-3">
                <div className="flex flex-col items-center justify-center gap-1">
                  <span className="text-lg font-black leading-none">{leftDir}</span>
                  <span>L</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1">
                  <span className="text-lg font-black leading-none">{rightDir}</span>
                  <span>R</span>
                </div>
              </div>
            );
            activeClass = 'font-bold text-2xl';
          }

          return (
            <button
              key={`cell-${cell.index}`}
              id={`dance-cell-${cell.index}`}
              onClick={() => onCellClick(cell.index)}
              className={`relative flex flex-col items-center justify-center p-2 transition-all duration-150 select-none overflow-hidden rounded-[2px] ${bgStyle} ${borderStyle} ${activeClass}`}
            >
              
              <div className="tracking-widest uppercase">{label}</div>

              {isUserTapped && (
                <div className="absolute inset-0 bg-white/20 pointer-events-none transition-opacity" />
              )}
            </button>
          );
        })}
      </div>

      {isCountingDown && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-50">
          <motion.div
            key={countdownVal}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="text-8xl font-black text-sky-500 font-mono"
          >
            {countdownVal}
          </motion.div>
        </div>
      )}
    </div>
  );
};
