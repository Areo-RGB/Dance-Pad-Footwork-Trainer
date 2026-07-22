import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CellIndex, StepTarget } from '../types';
import { GRID_CELLS } from '../lib/drills';

interface DanceGridProps {
  currentTarget: StepTarget | null;
  interactiveActiveCells: Set<CellIndex>;
  isCountingDown: boolean;
  countdownVal: number;
  enableOrientation: boolean;
  onCellClick: (index: CellIndex) => void;
}

export const DanceGrid: React.FC<DanceGridProps> = ({
  currentTarget,
  interactiveActiveCells,
  isCountingDown,
  countdownVal,
  enableOrientation,
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
      <div className="grid grid-cols-3 gap-[clamp(3px,0.45vmin,7px)] w-full h-full bg-black p-0 rounded-none">
        {GRID_CELLS.map((cell) => {
          const footState = getCellFootState(cell.index);
          const isUserTapped = interactiveActiveCells.has(cell.index);

          // Directionals
          let leftDir = currentTarget?.leftDir || '↑';
          let rightDir = currentTarget?.rightDir || '↑';

          // Theme styling rules
          let bgStyle = 'bg-[var(--color-surface)] text-[var(--color-surface)] hover:bg-[var(--color-surface-2)]';
          let borderStyle = 'border-2 border-white';
          let label: React.ReactNode = '';
          let activeClass = '';

          if (footState === 'L') {
            bgStyle = 'bg-[var(--color-grid-green)] text-black z-10';
            borderStyle = 'shadow-[inset_0_0_0_2px_rgba(255,255,255,0.72),inset_0_0_48px_rgba(255,255,255,0.18)]';
            label = (
              <div className="flex flex-row items-center justify-center gap-2">
                {enableOrientation && <span className="text-[clamp(4.5rem,18vw,12rem)] font-[900] leading-none tracking-[-0.04em]">{leftDir}</span>}
                <span className={enableOrientation ? "text-[clamp(2rem,6vw,4rem)] font-[900] leading-none opacity-90" : "text-[clamp(4.5rem,18vw,12rem)] font-[900] leading-none tracking-[-0.04em]"}>L</span>
              </div>
            );
            activeClass = '';
          } else if (footState === 'R') {
            bgStyle = 'bg-[var(--color-grid-blue)] text-black z-10';
            borderStyle = 'shadow-[inset_0_0_0_2px_rgba(255,255,255,0.72),inset_0_0_48px_rgba(255,255,255,0.18)]';
            label = (
              <div className="flex flex-row items-center justify-center gap-2">
                {enableOrientation && <span className="text-[clamp(4.5rem,18vw,12rem)] font-[900] leading-none tracking-[-0.04em]">{rightDir}</span>}
                <span className={enableOrientation ? "text-[clamp(2rem,6vw,4rem)] font-[900] leading-none opacity-90" : "text-[clamp(4.5rem,18vw,12rem)] font-[900] leading-none tracking-[-0.04em]"}>R</span>
              </div>
            );
            activeClass = '';
          } else if (footState === 'LR') {
            bgStyle = 'bg-[var(--color-grid-yellow)] text-black z-10';
            borderStyle = 'shadow-[inset_0_0_0_2px_rgba(255,255,255,0.72),inset_0_0_48px_rgba(255,255,255,0.18)]';
            label = (
              <div className="flex flex-col items-center justify-center gap-1">
                {enableOrientation && (
                  <div className="flex flex-row items-center justify-center gap-3">
                    <span className="text-[clamp(3rem,12vw,8rem)] font-[900] leading-none tracking-[-0.04em]">{leftDir}</span>
                    <span className="text-[clamp(3rem,12vw,8rem)] font-[900] leading-none tracking-[-0.04em]">{rightDir}</span>
                  </div>
                )}
                <div className={`flex flex-row items-center justify-center gap-4 ${enableOrientation ? "text-[clamp(1.5rem,5vw,3rem)] font-[900] leading-none opacity-90" : "text-[clamp(3rem,12vw,8rem)] font-[900] leading-none tracking-[-0.04em]"}`}>
                  <span>L</span>
                  <span>R</span>
                </div>
              </div>
            );
            activeClass = '';
          } else {
             // Inactive cell
             activeClass = 'after:content-[\'\'] after:absolute after:inset-0 after:bg-black/68';
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
