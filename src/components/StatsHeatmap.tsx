import React from 'react';
import { CellIndex } from '../types';
import { GRID_CELLS } from '../lib/drills';

interface StatsHeatmapProps {
  cellCounts: Record<CellIndex, number>;
  footCounts: {
    leftOnly: number;
    rightOnly: number;
    both: number;
  };
  totalSteps: number;
}

export const StatsHeatmap: React.FC<StatsHeatmapProps> = ({
  cellCounts,
  footCounts,
  totalSteps,
}) => {
  const countsArray = Object.values(cellCounts) as number[];
  const maxCellCount = Math.max(1, ...countsArray);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
          Cell Activation Heatmap
        </span>

        <div className="grid grid-cols-3 gap-1 aspect-square w-full max-w-[240px] mx-auto p-1 bg-zinc-900 border border-zinc-800 rounded">
          {GRID_CELLS.map((cell) => {
            const count = cellCounts[cell.index] || 0;
            const intensity = count / maxCellCount;

            let heatBg = 'bg-zinc-950 text-zinc-700';
            if (count > 0) {
              if (intensity > 0.7) {
                heatBg = 'bg-sky-500 text-black';
              } else if (intensity > 0.4) {
                heatBg = 'bg-sky-700 text-sky-100';
              } else {
                heatBg = 'bg-sky-900 text-sky-300';
              }
            }

            return (
              <div
                key={`heatmap-${cell.index}`}
                className={`flex flex-col items-center justify-center p-2 rounded-sm border border-transparent transition-all ${heatBg}`}
              >
                <span className="text-[9px] font-mono uppercase tracking-wider opacity-60">
                  {cell.label}
                </span>
                <span className="font-bold text-base font-mono">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
          Foot Distribution
        </span>

        <div className="grid grid-cols-3 gap-1 text-center">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded flex flex-col items-center gap-1">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Left</span>
            <span className="font-mono text-lg font-bold text-zinc-300">{footCounts.leftOnly}</span>
          </div>

          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded flex flex-col items-center gap-1">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Right</span>
            <span className="font-mono text-lg font-bold text-zinc-300">{footCounts.rightOnly}</span>
          </div>

          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded flex flex-col items-center gap-1">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Both</span>
            <span className="font-mono text-lg font-bold text-zinc-300">{footCounts.both}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
