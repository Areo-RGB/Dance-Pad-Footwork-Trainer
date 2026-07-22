import React, { useState, useEffect } from 'react';
import { DrillSettings } from '../types';
import { DRILL_THEMES, DRILL_PATTERNS, PatternDef, DrillThemeDef } from '../lib/patterns';

interface ControlsProps {
  settings: DrillSettings;
  onUpdateSettings: (newSettings: Partial<DrillSettings>) => void;
}

import { AnimatePresence, motion } from 'motion/react';

const ThemePreviewOverlay: React.FC<{ theme: DrillThemeDef; onClose: () => void }> = ({ theme, onClose }) => {
  const enableOrientation = theme.id === 'orientation';
  const themePatterns = DRILL_PATTERNS.filter(p => p.theme === theme.id);
  const frames = themePatterns.flatMap(p => p.frames);
  const previewFrames = frames.length > 0 ? frames : DRILL_PATTERNS.find(p => p.id === 'random_hits')?.frames || [];

  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % previewFrames.length);
    }, 1200);
    return () => clearInterval(timer);
  }, [previewFrames.length]);

  const currentFrame = previewFrames[frameIndex];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6"
    >
      <div className="flex flex-col items-center text-center gap-2 max-w-[320px] mb-8">
        <h3 className={`text-2xl font-black text-${theme.color}-400 uppercase tracking-wider`}>{theme.title}</h3>
        <p className="text-sm text-zinc-400">{theme.subtitle}</p>
      </div>

      <div className="w-full max-w-[280px] aspect-square grid grid-cols-3 gap-2 p-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl shrink-0">
        {Array.from({ length: 9 }).map((_, idx) => {
          const isLeft = currentFrame.type === 'DOUBLE' && currentFrame.leftCell === idx;
          const isRight = currentFrame.type === 'DOUBLE' && currentFrame.rightCell === idx;
          const isBoth = currentFrame.type === 'LR_SINGLE' && currentFrame.bothCell === idx;

          let bgClass = 'bg-zinc-900 border border-white text-transparent';
          let content: React.ReactNode = '';
          let Ld = currentFrame.leftDir || '↑';
          let Rd = currentFrame.rightDir || '↑';

          if (isBoth) {
            bgClass = 'bg-indigo-500 text-white border border-indigo-400 font-bold shadow-[0_0_15px_rgba(99,102,241,0.5)]';
            content = (
               <div className="flex flex-col items-center justify-center gap-1">
                 <div className="flex flex-row items-center justify-center gap-2">
                   {enableOrientation && <span className="text-3xl font-black leading-none">{Ld}</span>}
                   {enableOrientation && <span className="text-3xl font-black leading-none">{Rd}</span>}
                 </div>
                 <div className="flex flex-row items-center justify-center gap-3 text-2xl font-bold">
                   <span>L</span>
                   <span>R</span>
                 </div>
               </div>
            );
          } else if (isLeft) {
            bgClass = 'bg-emerald-500 text-zinc-950 border border-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.5)]';
            content = (
               <div className="flex flex-row items-center justify-center gap-2">
                 {enableOrientation && <span className="text-5xl font-black leading-none">{Ld}</span>}
                 <span className={enableOrientation ? "text-3xl font-bold" : "text-5xl font-black"}>L</span>
               </div>
            );
          } else if (isRight) {
            bgClass = 'bg-sky-500 text-zinc-950 border border-sky-400 font-bold shadow-[0_0_15px_rgba(14,165,233,0.5)]';
            content = (
               <div className="flex flex-row items-center justify-center gap-2">
                 {enableOrientation && <span className="text-5xl font-black leading-none">{Rd}</span>}
                 <span className={enableOrientation ? "text-3xl font-bold" : "text-5xl font-black"}>R</span>
               </div>
            );
          }

          return (
            <div
              key={idx}
              className={`flex items-center justify-center rounded-lg transition-all duration-300 select-none ${bgClass}`}
            >
              {content}
            </div>
          );
        })}
      </div>

      <button 
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shadow-lg"
      >
        ✕
      </button>
    </motion.div>
  );
};

export const Controls: React.FC<ControlsProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [previewThemeId, setPreviewThemeId] = useState<string | null>(null);

  const toggleTheme = (id: string, checked: boolean) => {
    const current = settings.activeThemes || [];
    if (checked) {
      onUpdateSettings({ activeThemes: [...current, id] });
    } else {
      onUpdateSettings({ activeThemes: current.filter(t => t !== id) });
    }
  };

  return (
    <div id="controls-container" className="flex flex-col gap-8 w-full max-w-md mx-auto">
      <AnimatePresence>
        {previewThemeId && (
          <ThemePreviewOverlay 
            theme={DRILL_THEMES.find(t => t.id === previewThemeId)!} 
            onClose={() => setPreviewThemeId(null)} 
          />
        )}
      </AnimatePresence>

      <div id="section-core-settings">
        <h2 id="heading-core-settings" className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Core Settings</h2>
        
        <div id="controls-interval-wrapper" className="space-y-6">
          <div id="control-interval-group" className="flex flex-col gap-2">
            <div id="control-interval-header" className="flex justify-between items-end">
              <label id="control-interval-label" htmlFor="control-interval-input" className="text-xs font-bold text-zinc-100 uppercase tracking-wider">Interval</label>
              <span id="control-interval-value-display" className="text-xs font-mono font-semibold text-sky-400">{settings.intervalTimeMs}ms</span>
            </div>
            
            <div id="control-interval-stepper" className="flex items-center gap-2">
              <button
                id="control-interval-decrement-btn"
                type="button"
                onClick={() => onUpdateSettings({ intervalTimeMs: Math.max(200, settings.intervalTimeMs - 100) })}
                className="px-5 py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 active:bg-zinc-700 text-zinc-100 font-bold text-xl rounded-xl transition-colors cursor-pointer select-none flex items-center justify-center min-w-[52px]"
                aria-label="Decrease interval"
              >
                −
              </button>
              
              <div id="control-interval-input-box" className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 flex items-center justify-center">
                <input
                  id="control-interval-input"
                  type="number"
                  min="200"
                  max="3000"
                  step="50"
                  value={settings.intervalTimeMs}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val) && val > 0) {
                      onUpdateSettings({ intervalTimeMs: val });
                    }
                  }}
                  className="w-full text-center bg-transparent font-mono font-bold text-zinc-100 text-base outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <button
                id="control-interval-increment-btn"
                type="button"
                onClick={() => onUpdateSettings({ intervalTimeMs: Math.min(3000, settings.intervalTimeMs + 100) })}
                className="px-5 py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 active:bg-zinc-700 text-zinc-100 font-bold text-xl rounded-xl transition-colors cursor-pointer select-none flex items-center justify-center min-w-[52px]"
                aria-label="Increase interval"
              >
                +
              </button>
            </div>
          </div>
          
          <div id="control-target-steps-group" className="flex flex-col gap-2">
            <div id="control-target-steps-header" className="flex justify-between items-end">
              <label id="control-target-steps-label" htmlFor="control-target-steps-input" className="text-xs font-bold text-zinc-100 uppercase tracking-wider">Target Steps</label>
              <span id="control-target-steps-value-display" className="text-xs font-mono font-semibold text-sky-400">
                {settings.targetSteps === 0 ? 'Infinite' : settings.targetSteps}
              </span>
            </div>
            
            <div id="control-target-steps-stepper" className="flex items-center gap-2">
              <button
                id="control-target-steps-decrement-btn"
                type="button"
                onClick={() => onUpdateSettings({ targetSteps: Math.max(0, settings.targetSteps - 10) })}
                className="px-5 py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 active:bg-zinc-700 text-zinc-100 font-bold text-xl rounded-xl transition-colors cursor-pointer select-none flex items-center justify-center min-w-[52px]"
                aria-label="Decrease target steps"
              >
                −
              </button>
              
              <div id="control-target-steps-input-box" className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 flex items-center justify-center">
                <input
                  id="control-target-steps-input"
                  type="number"
                  min="0"
                  max="1000"
                  step="10"
                  value={settings.targetSteps}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val) && val >= 0) {
                      onUpdateSettings({ targetSteps: val });
                    }
                  }}
                  className="w-full text-center bg-transparent font-mono font-bold text-zinc-100 text-base outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <button
                id="control-target-steps-increment-btn"
                type="button"
                onClick={() => onUpdateSettings({ targetSteps: Math.min(1000, settings.targetSteps + 10) })}
                className="px-5 py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 active:bg-zinc-700 text-zinc-100 font-bold text-xl rounded-xl transition-colors cursor-pointer select-none flex items-center justify-center min-w-[52px]"
                aria-label="Increase target steps"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="section-movement-patterns">
        <h2 id="heading-movement-patterns" className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Drill Themes</h2>
        <div id="themes-list" className="space-y-3">
          {DRILL_THEMES.map((theme) => {
            const isActive = settings.activeThemes.includes(theme.id);
            const themePatterns = DRILL_PATTERNS.filter(p => p.theme === theme.id);
            
            return (
              <div
                key={theme.id}
                id={`card-theme-${theme.id}`}
                className={`p-3.5 bg-zinc-900 border rounded-xl transition-all duration-300 ${
                  isActive ? `border-${theme.color}-500/50 bg-zinc-900/90 shadow-lg shadow-${theme.color}-500/5` : 'border-zinc-800'
                }`}
              >
                <div id={`label-theme-${theme.id}`} className="flex items-center justify-between cursor-pointer select-none">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setPreviewThemeId(theme.id); }}
                      className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors`}
                      aria-label={`Preview ${theme.title}`}
                    >
                      ▶
                    </button>
                    <label className="flex flex-col gap-0.5 cursor-pointer" htmlFor={`input-theme-${theme.id}`}>
                      <span id={`text-theme-${theme.id}`} className="text-xs font-bold text-zinc-200 uppercase tracking-wider">{theme.title}</span>
                      <span id={`desc-theme-${theme.id}`} className="text-[10px] text-zinc-500">{theme.subtitle}</span>
                    </label>
                  </div>
                  <label id={`switch-container-theme-${theme.id}`} className={`relative w-10 h-5 shrink-0 rounded-full p-1 transition-colors cursor-pointer ${isActive ? `bg-${theme.color}-500` : 'bg-zinc-800'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${isActive ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    <input
                      id={`input-theme-${theme.id}`}
                      type="checkbox"
                      className="hidden"
                      checked={isActive}
                      onChange={(e) => toggleTheme(theme.id, e.target.checked)}
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


