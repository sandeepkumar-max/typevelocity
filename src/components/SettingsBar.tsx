import React, { useState, useEffect } from 'react';
import { GameSettings, Difficulty, EasyCase } from '../types';
import { Volume2, VolumeX } from 'lucide-react';

interface SettingsBarProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  disabled?: boolean;
}

export default function SettingsBar({ settings, onSettingsChange, disabled }: SettingsBarProps) {
  const [customTime, setCustomTime] = useState('');
  
  // Custom time is handled in minutes visually if it exceeds standard options, or just generic
  const times = [15, 30, 60, 120];
  useEffect(() => {
    if (!times.includes(settings.time)) {
      setCustomTime(String(settings.time / 60)); // Show minutes
    } else {
      setCustomTime('');
    }
  }, [settings.time]);

  const handleCustomTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val.length > 2) val = val.slice(0, 2);
    setCustomTime(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      const clampedMinutes = Math.min(parsed, 30);
      onSettingsChange({ ...settings, time: clampedMinutes * 60 });
    }
  };

  const formatTimeLabel = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m`;
  };

  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'developer'];
  const easyCases: EasyCase[] = ['lower', 'upper', 'mixed'];

  return (
    <div className={`flex flex-col gap-4 p-4 glass-panel rounded-2xl mb-8 w-full max-w-4xl shadow-md border border-slate-200 dark:border-white/5 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Time Settings */}
        <div className="flex items-center gap-1.5 bg-black/5 dark:bg-black/20 p-1.5 rounded-xl border border-black/5 dark:border-white/5">
          {times.map((t) => (
            <button
              key={t}
              onClick={() => { setCustomTime(''); onSettingsChange({ ...settings, time: t }); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                settings.time === t && customTime === '' 
                  ? 'bg-emerald-500 text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {formatTimeLabel(t)}
            </button>
          ))}
          <div className="relative flex items-center ml-1">
            <input 
              type="number"
              min="1"
              max="30"
              placeholder="Min"
              value={customTime}
              onChange={handleCustomTime}
              className={`w-16 pl-3 pr-2 py-1.5 rounded-lg text-sm font-bold bg-white dark:bg-slate-800/50 outline-none transition-all ${
                customTime !== '' 
                  ? 'border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                  : 'border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300'
              }`}
            />
            {customTime !== '' && <span className="absolute right-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">m</span>}
          </div>
        </div>
        
        {/* Difficulty Settings */}
        <div className="flex items-center gap-1.5 bg-black/5 dark:bg-black/20 p-1.5 rounded-xl border border-black/5 dark:border-white/5">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => onSettingsChange({ ...settings, difficulty: d })}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold capitalize transition-all ${
                settings.difficulty === d 
                  ? 'bg-amber-500 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Sound Toggle */}
        <button
          onClick={() => onSettingsChange({ ...settings, soundEnabled: !settings.soundEnabled })}
          className={`p-2 rounded-xl transition-all border ${
            settings.soundEnabled 
              ? 'bg-emerald-100 border-emerald-200 text-emerald-600 dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-400' 
              : 'bg-slate-100 border-slate-200 text-slate-400 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-500'
          }`}
          title={settings.soundEnabled ? "Disable Sounds" : "Enable Sounds"}
        >
          {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>

      </div>
      
      {/* Easy Case Toggles */}
      {settings.difficulty === 'easy' && (
        <div className="flex justify-start">
           <div className="flex items-center gap-1.5 bg-black/5 dark:bg-black/20 p-1.5 rounded-xl border border-black/5 dark:border-white/5">
            <span className="text-sm text-slate-500 px-2 font-bold uppercase tracking-wider text-xs">Case</span>
            {easyCases.map(c => (
               <button
                  key={c}
                  onClick={() => onSettingsChange({ ...settings, easyCase: c })}
                  className={`px-3 py-1 rounded-md text-xs font-bold capitalize transition-all ${
                    settings.easyCase === c 
                      ? 'bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
               >
                 {c}
               </button>
            ))}
           </div>
        </div>
      )}
    </div>
  );
}
