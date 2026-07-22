import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CellIndex,
  DrillSessionResult,
  DrillSettings,
  StepHitRecord,
  StepTarget,
} from './types';
import { DanceGrid } from './components/DanceGrid';
import { generateNextTarget } from './lib/sequenceGenerator';
import { Controls } from './components/Controls';
import { DrillSummary } from './components/DrillSummary';
import { Dumbbell, Settings } from 'lucide-react';

export default function App() {
  // App State & Settings
  const [settings, setSettings] = useState<DrillSettings>({
    mode: 'TRAINER',
    intervalTimeMs: 800,
    activeThemes: ['random'],
    audioVoicePrompt: false,
    audioBeep: false,
    metronomeSound: false,
    countdownDelaySec: 3,
  });

  // Execution State
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdownVal, setCountdownVal] = useState(3);

  const [currentTarget, setCurrentTarget] = useState<StepTarget | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Interactive mode user tap tracking
  const [interactiveActiveCells, setInteractiveActiveCells] = useState<Set<CellIndex>>(new Set());
  const [lastHitResult, setLastHitResult] = useState<{ cell: CellIndex; success: boolean } | null>(null);
  const [statsHitCount, setStatsHitCount] = useState(0);
  const [statsMissCount, setStatsMissCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  // Stats Recording
  const [stepRecords, setStepRecords] = useState<StepHitRecord[]>([]);
  const [cellHitCounts, setCellHitCounts] = useState<Record<CellIndex, number>>({
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0,
  });
  const [footCounts, setFootCounts] = useState({ leftOnly: 0, rightOnly: 0, both: 0 });
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [completedResult, setCompletedResult] = useState<DrillSessionResult | null>(null);

  // Refs for timer interval management
  const intervalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stepStartTimeRef = useRef<number>(0);

  // Record cell occurrence in stats
  const recordTargetCells = useCallback((target: StepTarget) => {
    setCellHitCounts((prev) => {
      const updated = { ...prev };
      if (target.type === 'LR_SINGLE' && target.bothCell !== undefined) {
        updated[target.bothCell] = (updated[target.bothCell] || 0) + 1;
      } else if (target.leftCell !== undefined && target.rightCell !== undefined) {
        updated[target.leftCell] = (updated[target.leftCell] || 0) + 1;
        updated[target.rightCell] = (updated[target.rightCell] || 0) + 1;
      }
      return updated;
    });

    setFootCounts((prev) => ({
      leftOnly: prev.leftOnly + (target.leftCell !== undefined ? 1 : 0),
      rightOnly: prev.rightOnly + (target.rightCell !== undefined ? 1 : 0),
      both: prev.both + (target.type === 'LR_SINGLE' ? 1 : 0),
    }));
  }, []);

  // Finish Drill Routine & Show Summary
  const finishDrill = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setIsCountingDown(false);

    if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    const totalSteps = currentStepIndex;
    const totalHits = statsHitCount;
    const totalMisses = statsMissCount;
    const accuracy = totalSteps > 0 && settings.mode === 'INTERACTIVE'
      ? (totalHits / (totalHits + totalMisses || 1)) * 100
      : 100;

    const elapsedSeconds = Math.max(1, Math.round((Date.now() - sessionStartTime) / 1000));

    // Calculate average reaction time from step records
    const reactionTimes = stepRecords.map((r) => r.reactionTimeMs).filter((t): t is number => t !== undefined);
    const avgReaction = reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0;

    const result: DrillSessionResult = {
      drillName: 'Custom Session',
      totalSteps,
      completedSteps: totalSteps,
      successfulHits: totalHits,
      missedHits: totalMisses,
      accuracy,
      avgReactionTimeMs: avgReaction,
      durationSeconds: elapsedSeconds,
      cellHitCounts,
      footCounts,
      stepRecords,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCompletedResult(result);
  }, [
    currentStepIndex,
    statsHitCount,
    statsMissCount,
    sessionStartTime,
    stepRecords,
    cellHitCounts,
    footCounts,
    settings.mode,
  ]);

  // Advance to next step in routine
  const advanceStep = useCallback(() => {
    setCurrentStepIndex((prevIndex) => {
      let nextTarget: StepTarget = generateNextTarget(settings, prevIndex);

      setCurrentTarget(nextTarget);
      recordTargetCells(nextTarget);
      stepStartTimeRef.current = Date.now();

      return prevIndex + 1;
    });
  }, [
    settings,
    recordTargetCells,
  ]);

  // Start Drill Execution Engine
  const startDrill = () => {
    // Reset state counters
    setCurrentStepIndex(0);
    setStatsHitCount(0);
    setStatsMissCount(0);
    setCurrentStreak(0);
    setStepRecords([]);
    setCellHitCounts({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 });
    setFootCounts({ leftOnly: 0, rightOnly: 0, both: 0 });
    setCompletedResult(null);

    // Countdown sequence
    setIsCountingDown(true);
    setCountdownVal(settings.countdownDelaySec);

    let count = settings.countdownDelaySec;

    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    countdownTimerRef.current = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdownVal(count);
      } else {
        clearInterval(countdownTimerRef.current!);
        setIsCountingDown(false);
        setIsRunning(true);
        setIsPaused(false);
        setSessionStartTime(Date.now());

        // Trigger first step immediately
        advanceStep();
      }
    }, 1000);
  };

  // Main Interval Timer Loop
  useEffect(() => {
    if (isRunning && !isPaused && !isCountingDown) {
      intervalTimerRef.current = setInterval(() => {
        advanceStep();
      }, settings.intervalTimeMs);
    }

    return () => {
      if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
    };
  }, [isRunning, isPaused, isCountingDown, settings.intervalTimeMs, advanceStep, finishDrill]);

  const resetDrill = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsCountingDown(false);
    setCurrentTarget(null);
    setCurrentStepIndex(0);
    setInteractiveActiveCells(new Set());

    if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
  };

  // User Tap / Keypress Cell Target Check (Interactive Mode)
  const handleCellClick = useCallback(
    (cellIndex: CellIndex) => {
      // Visual tap indicator feedback
      setInteractiveActiveCells((prev) => {
        const next = new Set(prev);
        next.add(cellIndex);
        return next;
      });

      setTimeout(() => {
        setInteractiveActiveCells((prev) => {
          const next = new Set(prev);
          next.delete(cellIndex);
          return next;
        });
      }, 200);

      // In Interactive Mode, verify if user hit the current target cell
      if (isRunning && !isPaused && currentTarget) {
        const rxTime = Date.now() - stepStartTimeRef.current;
        let isSuccess = false;

        if (currentTarget.type === 'LR_SINGLE') {
          isSuccess = currentTarget.bothCell === cellIndex;
        } else {
          isSuccess = currentTarget.leftCell === cellIndex || currentTarget.rightCell === cellIndex;
        }

        setLastHitResult({ cell: cellIndex, success: isSuccess });
        setTimeout(() => setLastHitResult(null), 400);

        if (isSuccess) {
          setStatsHitCount((prev) => prev + 1);
          setCurrentStreak((prev) => prev + 1);
        } else {
          setStatsMissCount((prev) => prev + 1);
          setCurrentStreak(0);
        }

        setStepRecords((prev) => [
          ...prev,
          {
            stepIndex: currentStepIndex,
            target: currentTarget,
            hit: isSuccess,
            reactionTimeMs: rxTime,
            timestamp: Date.now(),
          },
        ]);
      }
    },
    [isRunning, isPaused, currentTarget, currentStepIndex]
  );

  const handleUpdateSettings = (newSettings: Partial<DrillSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const accuracyRate = currentStepIndex > 0 ? (statsHitCount / currentStepIndex) * 100 : 0;
  
  const reactionTimes = stepRecords.map((r) => r.reactionTimeMs).filter((t): t is number => t !== undefined);
  const avgReaction = reactionTimes.length > 0
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0;

  const [activeTab, setActiveTab] = useState<'trainer' | 'settings'>('trainer');

  return (
    <div id="app-root" className="w-full min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <main id="app-main" className="flex-1 flex flex-col mb-16">
        {activeTab === 'trainer' ? (
          <section id="section-trainer" className="flex-1 bg-black flex flex-col relative">
            <DanceGrid
              currentTarget={currentTarget}
              interactiveActiveCells={interactiveActiveCells}
              isCountingDown={isCountingDown}
              countdownVal={countdownVal}
              onCellClick={handleCellClick}
            />
            
            <div id="sequence-control-box" className="w-full">
              {!isRunning && !isCountingDown ? (
                <button
                  id="btn-start-sequence"
                  onClick={startDrill}
                  className="w-full py-5 border-b border-transparent bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold uppercase tracking-widest text-sm transition-colors shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                >
                  Start Sequence
                </button>
              ) : isCountingDown ? (
                <div id="status-initializing" className="w-full py-5 bg-amber-500/10 border-b border-amber-500/20 text-amber-500 font-bold uppercase tracking-widest text-sm text-center animate-pulse">
                  Initializing...
                </div>
              ) : (
                <button
                  id="btn-abort-sequence"
                  onClick={resetDrill}
                  className="w-full py-5 bg-rose-500/10 border-b border-rose-500/20 hover:bg-rose-500/20 text-rose-500 font-bold uppercase tracking-widest text-sm transition-colors"
                >
                  Abort Sequence
                </button>
              )}
            </div>
          </section>
        ) : (
          <aside id="section-settings" className="w-full p-6 flex-1 flex flex-col bg-zinc-900/20 overflow-y-auto">
            <Controls
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
            />
          </aside>
        )}
      </main>

      <footer id="app-bottom-nav" className="fixed bottom-0 left-0 right-0 h-16 bg-zinc-900 border-t border-zinc-800 flex items-center justify-around px-4 pb-safe z-50">
        <button 
          id="tab-btn-trainer"
          onClick={() => setActiveTab('trainer')}
          className={`flex flex-col items-center justify-center w-20 h-full gap-1 transition-colors ${activeTab === 'trainer' ? 'text-sky-400' : 'text-zinc-500 hover:text-zinc-400'}`}
        >
          <Dumbbell size={20} />
          <span id="tab-label-trainer" className="text-[10px] font-bold tracking-wider uppercase">Trainer</span>
        </button>
        <button 
          id="tab-btn-settings"
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center w-20 h-full gap-1 transition-colors ${activeTab === 'settings' ? 'text-sky-400' : 'text-zinc-500 hover:text-zinc-400'}`}
        >
          <Settings size={20} />
          <span id="tab-label-settings" className="text-[10px] font-bold tracking-wider uppercase">Settings</span>
        </button>
      </footer>
      
      {/* Workout Summary Modal */}
      {completedResult && (
        <DrillSummary
          result={completedResult}
          onClose={() => setCompletedResult(null)}
          onRestart={startDrill}
        />
      )}
    </div>
  );
}
