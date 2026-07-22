import React, { useState, useEffect } from 'react';
import { DrillSettings } from '../types';
import { DRILL_THEMES, DRILL_PATTERNS, PatternDef, DrillThemeDef } from '../lib/patterns';

interface ControlsProps {
  settings: DrillSettings;
  onUpdateSettings: (newSettings: Partial<DrillSettings>) => void;
}

const ThemeMiniGrid: React.FC<{ theme: DrillThemeDef; idPrefix: string }> = ({ theme, idPrefix }) => {
  // Grab all patterns belonging to this theme
  const themePatterns = DRILL_PATTERNS.filter(p => p.theme === theme.id);
  // Flatten frames to create a dynamic preview loop
  const frames = themePatterns.flatMap(p => p.frames);
  // Fallback if empty
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
    <div id={`${idPrefix}-mini-grid`} className="grid grid-cols-3 gap-1 w-20 h-20 p-1 bg-zinc-950 border border-zinc-800 rounded-lg shadow-inner shrink-0">
      {Array.from({ length: 9 }).map((_, idx) => {
        const isLeft = currentFrame.type === 'DOUBLE' && currentFrame.leftCell === idx;
        const isRight = currentFrame.type === 'DOUBLE' && currentFrame.rightCell === idx;
        const isBoth = currentFrame.type === 'LR_SINGLE' && currentFrame.bothCell === idx;

        let bgClass = 'bg-zinc-900 border border-zinc-800/40 text-transparent';
        let content = '';
        let Ld = currentFrame.leftDir || '↑';
        let Rd = currentFrame.rightDir || '↑';

        if (isBoth) {
          bgClass = 'bg-amber-500 text-zinc-950 border-amber-400 font-bold scale-105 shadow-[0_0_8px_rgba(245,158,11,0.5)]';
          content = 'LR';
        } else if (isLeft) {
          bgClass = 'bg-emerald-500 text-zinc-950 border-emerald-400 font-bold scale-105 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
          content = Ld;
        } else if (isRight) {
          bgClass = 'bg-sky-500 text-zinc-950 border-sky-400 font-bold scale-105 shadow-[0_0_8px_rgba(14,165,233,0.5)]';
          content = Rd;
        }

        return (
          <div
            key={idx}
            id={`${idPrefix}-cell-${idx}`}
            className={`flex items-center justify-center rounded text-[11px] transition-all duration-300 select-none ${bgClass}`}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
};

export const Controls: React.FC<ControlsProps> = ({
  settings,
  onUpdateSettings,
}) => {
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
      <div id="section-core-settings">
        <h2 id="heading-core-settings" className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Core Settings</h2>
        
        <div id="controls-interval-wrapper" className="space-y-4">
          <div id="control-interval-group" className="flex flex-col gap-2">
            <div id="control-interval-header" className="flex justify-between items-end">
              <label id="control-interval-label" htmlFor="control-interval-input" className="text-xs font-bold text-zinc-100 uppercase tracking-wider">Intervall</label>
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
                <label id={`label-theme-${theme.id}`} className="flex items-center justify-between cursor-pointer select-none">
                  <div id={`info-theme-${theme.id}`} className="flex flex-col gap-0.5">
                    <span id={`text-theme-${theme.id}`} className="text-xs font-bold text-zinc-200 uppercase tracking-wider">{theme.title}</span>
                    <span id={`desc-theme-${theme.id}`} className="text-[10px] text-zinc-500">{theme.subtitle}</span>
                  </div>
                  <div id={`switch-theme-${theme.id}`} className={`w-10 h-5 rounded-full p-1 transition-colors ${isActive ? `bg-${theme.color}-500` : 'bg-zinc-800'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${isActive ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
                  <input
                    id={`input-theme-${theme.id}`}
                    type="checkbox"
                    className="hidden"
                    checked={isActive}
                    onChange={(e) => toggleTheme(theme.id, e.target.checked)}
                  />
                </label>

                {isActive && (
                  <div id={`expand-theme-${theme.id}`} className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center gap-3 animate-fadeIn">
                    <ThemeMiniGrid theme={theme} idPrefix={`preview-${theme.id}`} />
                    <div id={`details-theme-${theme.id}`} className="flex flex-col gap-1 text-[11px] text-zinc-400">
                      <span className={`font-semibold text-${theme.color}-400`}>Includes {themePatterns.length} Patterns:</span>
                      <span className="leading-tight opacity-80">{themePatterns.map(p => p.title).join(', ')}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


