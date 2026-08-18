import React, { useState, useEffect } from 'react';
import { GameSettings, Difficulty, EasyCase } from '../types';
import { Volume2, VolumeX, Lock, Unlock, Mouse, Globe, Type, HelpCircle } from 'lucide-react';
import HindiTypingGuide from './HindiTypingGuide';

interface SettingsBarProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  disabled?: boolean;
}

const times = [15, 30, 60, 120];
const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'developer'];
const easyCases: EasyCase[] = ['lower', 'upper', 'mixed'];

export default function SettingsBar({ settings, onSettingsChange, disabled }: SettingsBarProps) {
  const [customTime, setCustomTime] = useState('');
  const [showHindiGuide, setShowHindiGuide] = useState(false);

  useEffect(() => {
    if (!times.includes(settings.time)) {
      setCustomTime(String(Math.round(settings.time / 60)));
    } else {
      setCustomTime('');
    }
  }, [settings.time]);

  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val.length > 2) val = val.slice(0, 2);
    setCustomTime(val);
  };

  const applyCustomTime = () => {
    const parsed = parseInt(customTime, 10);
    if (!isNaN(parsed) && parsed > 0) {
      const clampedMinutes = Math.min(parsed, 60);
      onSettingsChange({ ...settings, time: clampedMinutes * 60 });
    }
  };

  const handleCustomTimeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      applyCustomTime();
      e.currentTarget.blur();
    }
  };

  return (
    <div className={`w-full flex flex-col items-center justify-center gap-3 mb-8 transition-opacity select-none ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      
      {/* Main Top Line (Game Modes) */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 bg-slate-100/80 dark:bg-slate-800/60 px-6 py-2.5 rounded-full text-sm font-medium text-slate-500 dark:text-slate-400 shadow-sm border border-slate-200/50 dark:border-white/5 backdrop-blur-sm">
        
        {/* Difficulty */}
        <div className="flex items-center gap-4">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => onSettingsChange({ ...settings, difficulty: d })}
              className={`transition-colors capitalize ${
                settings.difficulty === d
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 hidden sm:block"></div>

        {/* Time */}
        <div className="flex items-center gap-4">
          {times.map((t) => (
            <button
              key={t}
              onClick={() => { setCustomTime(''); onSettingsChange({ ...settings, time: t }); }}
              className={`transition-colors ${
                settings.time === t && customTime === ''
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {t < 60 ? `${t}s` : `${t / 60}m`}
            </button>
          ))}
          <div className="relative flex items-center" title="Custom time in minutes">
            <input
              type="number"
              min="1"
              max="60"
              placeholder="custom"
              value={customTime}
              onChange={handleCustomTimeChange}
              onBlur={applyCustomTime}
              onKeyDown={handleCustomTimeKeyDown}
              className={`w-14 bg-transparent outline-none text-center transition-colors border-b-2 placeholder:text-slate-400/50 ${
                customTime !== ''
                  ? 'text-blue-600 dark:text-blue-400 font-bold border-blue-500/50'
                  : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-slate-400'
              }`}
            />
          </div>
        </div>

        {settings.difficulty === 'easy' && (
          <>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 hidden md:block"></div>
            <div className="flex items-center gap-4">
              {easyCases.map(c => (
                <button
                  key={c}
                  onClick={() => onSettingsChange({ ...settings, easyCase: c })}
                  className={`transition-colors capitalize ${
                    settings.easyCase === c
                      ? 'text-blue-600 dark:text-blue-400 font-bold'
                      : 'hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Secondary Line (Config Toggles) */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] font-medium text-slate-400 dark:text-slate-500">
        
        <button
          onClick={() => onSettingsChange({ ...settings, soundEnabled: !settings.soundEnabled })}
          className={`flex items-center gap-1.5 transition-colors ${
            settings.soundEnabled ? 'text-blue-500 dark:text-blue-400' : 'hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          Sound
        </button>

        <button
          onClick={() => onSettingsChange({ ...settings, backspaceLock: !settings.backspaceLock })}
          className={`flex items-center gap-1.5 transition-colors ${
            settings.backspaceLock ? 'text-red-500 dark:text-red-400' : 'hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          {settings.backspaceLock ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          Backspace Lock
        </button>

        <button
          onClick={() => onSettingsChange({ ...settings, autoScroll: !settings.autoScroll })}
          className={`flex items-center gap-1.5 transition-colors ${
            settings.autoScroll ? 'text-blue-500 dark:text-blue-400' : 'hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <Mouse className="w-4 h-4" />
          Auto Scroll
        </button>
        
        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

        <div className="flex items-center gap-1.5">
          <Globe className="w-4 h-4" />
          <select
            value={settings.language}
            onChange={(e) => onSettingsChange({ ...settings, language: e.target.value as any })}
            className="bg-transparent outline-none cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 appearance-none pr-1"
          >
            <option value="english" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">English</option>
            <option value="hindi" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Hindi</option>
          </select>
        </div>

        {settings.language === 'hindi' && (
          <>
            <div className="flex items-center gap-1.5">
              <Type className="w-4 h-4" />
              <select
                value={settings.hindiFont}
                onChange={(e) => onSettingsChange({ ...settings, hindiFont: e.target.value as any })}
                className="bg-transparent outline-none cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 appearance-none pr-1"
              >
                <option value="mangal" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Mangal</option>
                <option value="krutidev" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Kruti Dev</option>
              </select>
            </div>
            <button
              onClick={() => setShowHindiGuide(true)}
              className="flex items-center gap-1.5 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors ml-1"
              title="How to type in Hindi"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Guide</span>
            </button>
          </>
        )}

        <div className={`flex items-center gap-1.5 transition-opacity ${settings.language === 'hindi' ? 'opacity-40 pointer-events-none' : ''}`}>
          <Type className="w-4 h-4" />
          <select
            value={settings.fontFamily}
            onChange={(e) => onSettingsChange({ ...settings, fontFamily: e.target.value })}
            className="bg-transparent outline-none cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 appearance-none pr-1"
            disabled={settings.language === 'hindi'}
          >
            <option value="font-fira" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Fira Code</option>
            <option value="font-sans" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Sans Serif</option>
            <option value="font-serif" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Serif</option>
            <option value="font-mono" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Monospace</option>
          </select>
        </div>
        
      </div>
      {showHindiGuide && <HindiTypingGuide onClose={() => setShowHindiGuide(false)} />}
    </div>
  );
}
