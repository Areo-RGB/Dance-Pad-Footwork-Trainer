import React from 'react';
import { motion } from 'motion/react';
import { DrillSessionResult } from '../types';
import { StatsHeatmap } from './StatsHeatmap';

interface DrillSummaryProps {
  result: DrillSessionResult;
  onClose: () => void;
  onRestart: () => void;
}

export const DrillSummary: React.FC<DrillSummaryProps> = ({
  result,
  onClose,
  onRestart,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded p-6 shadow-2xl flex flex-col gap-8 text-zinc-100 my-auto"
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex flex-col">
            <h2 className="font-bold text-lg text-zinc-100 uppercase tracking-widest">
              Session Complete
            </h2>
            <span className="text-[10px] text-zinc-500 font-mono uppercase mt-1">
              {result.date}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded flex flex-col items-center justify-center gap-1">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
              Steps
            </span>
            <span className="font-mono text-xl font-bold text-white">
              {result.completedSteps}
            </span>
          </div>

          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded flex flex-col items-center justify-center gap-1">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
              Duration
            </span>
            <span className="font-mono text-xl font-bold text-sky-400">
              {result.durationSeconds}s
            </span>
          </div>

          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded flex flex-col items-center justify-center gap-1">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
              Interval
            </span>
            <span className="font-mono text-xl font-bold text-white">
              {(result.settings.intervalTimeMs / 1000).toFixed(1)}s
            </span>
          </div>

          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded flex flex-col items-center justify-center gap-1">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
              Pace
            </span>
            <span className="font-mono text-xl font-bold text-white">
              {result.durationSeconds > 0
                ? `${Math.round((result.completedSteps / result.durationSeconds) * 60)}`
                : '--'}
            </span>
          </div>
        </div>

        <StatsHeatmap
          cellCounts={result.cellHitCounts}
          footCounts={result.footCounts}
          totalSteps={result.completedSteps}
        />

        <div className="flex items-center gap-3 pt-6 border-t border-zinc-800">
          <button
            onClick={onRestart}
            className="flex-1 py-4 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold text-xs uppercase tracking-widest rounded transition-colors"
          >
            Repeat
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs uppercase tracking-widest rounded transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
