import React, { useState, useEffect, useRef } from 'react';
import { GameSettings, SessionStats } from '../types';
import { generateText } from '../utils/words';
import { mapKeystroke } from '../utils/keyboardMap';
import SettingsBar from './SettingsBar';
import { RotateCcw } from 'lucide-react';

interface NeonSprintProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onComplete: (stats: SessionStats) => void;
}

export default function NeonSprint({ settings, onSettingsChange, onComplete }: NeonSprintProps) {
  const [targetText, setTargetText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'running' | 'finished'>('idle');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [lastTypeTime, setLastTypeTime] = useState<number>(0);
  const [isIdle, setIsIdle] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    // Generate around 50 words for sprint mode
    setTargetText(generateText(settings.difficulty, 50, settings.easyCase, settings.language, settings.hindiFont));
    setUserInput('');
    setStatus('idle');
  }, [settings.difficulty, settings.easyCase, settings.language, settings.hindiFont]);

  useEffect(() => {
    if (status === 'idle') {
      inputRef.current?.focus();
    }
  }, [status]);

  // Idle check
  useEffect(() => {
    if (status === 'running') {
      const interval = setInterval(() => {
        if (Date.now() - lastTypeTime > 3000) {
          setIsIdle(true);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, lastTypeTime]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      resetGame();
      return;
    }
    if (e.key === 'Backspace' && settings.backspaceLock) {
       e.preventDefault();
       return;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'finished') return;
    
    const newVal = e.target.value;
    
    if (newVal.length < userInput.length) {
      if (settings.backspaceLock) return;
      setUserInput(newVal);
      return;
    }

    if (newVal.length > userInput.length) {
      let currentStatus = status;
      if (currentStatus === 'idle') {
        setStatus('running');
        setStartTime(Date.now());
        setLastTypeTime(Date.now());
        currentStatus = 'running';
      }
      
      if (currentStatus !== 'running') return;
      
      setLastTypeTime(Date.now());
      setIsIdle(false);
      
      const addedChars = newVal.slice(userInput.length);
      let finalVal = userInput;
      let newErrors = 0;
      
      for (const char of addedChars) {
         if (finalVal.length >= targetText.length) break;
         const mappedKey = mapKeystroke(char, settings.language, settings.hindiFont);
         finalVal += mappedKey;
         
         const expectedChar = targetText[finalVal.length - 1];
         if (mappedKey !== expectedChar) {
            newErrors++;
         }
      }
      
      if (newErrors > 0) {
        setErrors(prev => prev + newErrors);
      }
      
      setUserInput(finalVal);
      
      if (startTime) {
        const timeSpent = (Date.now() - startTime) / 1000;
        const minutes = timeSpent / 60;
        if (minutes > 0) {
          setWpm(Math.round((finalVal.length / 5) / minutes));
        }
      }

      if (finalVal.length >= targetText.length) {
        finishRace();
      }
    }
  };

  const finishRace = () => {
    setStatus('finished');
    const timeSpent = startTime ? (Date.now() - startTime) / 1000 : 0;
    if (onComplete) {
      onComplete({
        mode: 'sprint',
        wpm,
        accuracy,
        timeSpent,
        errorCount: errors,
        backspaceCount: 0,
        wordStats: {},
        letterStats: {}
      });
    }
  };

  const resetGame = () => {
    setTargetText(generateText(settings.difficulty, 50, settings.easyCase, settings.language, settings.hindiFont));
    setUserInput('');
    setStatus('idle');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setOffsetY(0);
    setIsIdle(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const progress = targetText.length > 0 ? (userInput.length / targetText.length) * 100 : 0;

  // Auto-scroll logic
  useEffect(() => {
    if (settings.autoScroll && textContainerRef.current && cursorRef.current && status === 'running') {
      const container = textContainerRef.current;
      const cursor = cursorRef.current;
      
      const lineHeight = parseFloat(window.getComputedStyle(cursor).lineHeight) || 32;
      const cursorTop = cursor.offsetTop;
      
      const firstSpan = container.querySelector('span');
      const baseOffset = firstSpan ? firstSpan.offsetTop : 0;
      
      const containerHeight = container.clientHeight;
      const centerOfContainer = (containerHeight / 2) - (lineHeight / 2);
      
      const targetOffsetY = centerOfContainer - (cursorTop - baseOffset);
      
      setOffsetY(targetOffsetY);
    }
  }, [userInput, status, settings.autoScroll]);

  const renderText = () => {
    return (
      <div className={`mt-8 p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl h-64 relative ${settings.autoScroll ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        <div 
          ref={textContainerRef}
          className={`w-full select-none ${settings.autoScroll ? 'h-full overflow-hidden [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)] [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)]' : ''}`}
        >
          <div 
            className={`${settings.language === 'hindi' ? '' : (settings.fontFamily || 'font-fira')} text-xl leading-relaxed tracking-wide whitespace-pre-wrap transition-transform duration-200 ease-out`}
            style={{ 
              transform: `translateY(${offsetY}px)`,
              fontFamily: settings.language === 'hindi' ? (settings.hindiFont === 'krutidev' ? "'Kruti Dev 010', 'Kruti Dev', sans-serif" : "'Mangal', sans-serif") : undefined
            }}
          >
            {targetText.split('').map((char, index) => {
            let colorClass = 'text-slate-500 dark:text-slate-400';
            let borderClass = '';
            let isCursor = false;
            
            if (index < userInput.length) {
              colorClass = userInput[index] === char ? 'text-slate-800 dark:text-slate-200' : 'text-red-500 bg-red-500/10 rounded-sm';
            }
            
            if (index === userInput.length && status !== 'finished') {
              borderClass = 'border-l-2 border-blue-500 animate-pulse';
              colorClass = 'text-slate-900 dark:text-white';
              isCursor = true;
            }

            return (
              <span 
                key={index} 
                ref={isCursor ? cursorRef : null}
                className={`transition-colors ${colorClass} ${borderClass}`}
              >
                {char}
              </span>
            );
          })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto min-h-[500px]">
      <SettingsBar settings={settings} onSettingsChange={onSettingsChange} disabled={status === 'running'} />
      {/* HUD */}
      <div className="flex justify-between w-full mb-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-4 rounded-2xl">
        <div className="flex flex-col">
          <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Speed</span>
          <span className="text-3xl font-bold text-blue-500">{wpm} WPM</span>
        </div>
        <div className="flex flex-col items-center hidden sm:flex">
          <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Accuracy</span>
          <span className="text-3xl font-bold text-slate-800 dark:text-slate-200">{accuracy}%</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Progress</span>
          <span className="text-3xl font-bold text-indigo-500">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* High-Quality Cyberpunk Track & Realistic Car */}
      <div className="w-full h-24 sm:h-32 relative mb-6 rounded-3xl overflow-hidden bg-slate-900 border border-slate-700/50 flex items-center shadow-2xl shadow-blue-900/20">
        
        {/* Deep background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-black"></div>
        
        {/* Grid lines moving backwards */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(59,130,246,0.2) 1px, transparent 1px), linear-gradient(0deg, rgba(59,130,246,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            animation: status === 'running' && !isIdle ? `moveBg ${Math.max(0.5, 3 - wpm/50)}s linear infinite` : 'none'
          }}
        />

        {/* Neon racing lines (Top & Bottom) */}
        <div className="absolute top-4 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_15px_#3b82f6]"></div>
        <div className="absolute bottom-4 left-0 right-0 h-[2px] bg-fuchsia-500 shadow-[0_0_15px_#d946ef]"></div>

        {/* Realistic Sports Car */}
        <div 
          className="absolute transition-all duration-300 ease-out z-10 flex items-center justify-center"
          style={{ left: `calc(${progress}% - 30px)` }}
        >
          <svg viewBox="0 0 100 35" className="w-24 sm:w-32 h-auto drop-shadow-[0_0_15px_rgba(59,130,246,0.8)] z-20 transition-all duration-300">
            <defs>
              <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
              <linearGradient id="window" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
            </defs>
            {/* Shadow */}
            <ellipse cx="50" cy="33" rx="45" ry="4" fill="rgba(0,0,0,0.5)" filter="blur(2px)" />
            {/* Chassis */}
            <path d="M 12,25 L 20,13 C 25,8 35,7 45,8 L 65,10 C 75,12 82,18 88,22 L 96,23 C 98,23 99,25 99,27 L 99,30 C 99,32 97,33 95,33 L 5,33 C 2,33 1,32 1,30 L 1,27 C 1,26 2,25 5,25 Z" fill="url(#carBody)" stroke="#60a5fa" strokeWidth="0.5" />
            {/* Windows */}
            <path d="M 35,9 L 45,9 C 55,9 62,11 68,14 L 62,15 C 55,13 45,12 35,12 L 25,12 Z" fill="url(#window)" opacity="0.9" />
            <path d="M 22,14 L 32,10 L 32,13 L 24,16 Z" fill="url(#window)" opacity="0.9" />
            {/* Wheels */}
            <circle cx="20" cy="28" r="6" fill="#111827" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="78" cy="28" r="6" fill="#111827" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Rims */}
            <circle cx="20" cy="28" r="3" fill="#cbd5e1" />
            <circle cx="78" cy="28" r="3" fill="#cbd5e1" />
            {/* Headlight */}
            <path d="M 90,24 L 98,24 L 98,26 L 90,26 Z" fill="#fef08a" className="animate-pulse" filter="blur(0.5px)" />
            {status === 'running' && !isIdle && (
              <>
                <polygon points="98,23 120,15 120,35 98,27" fill="rgba(253, 224, 71, 0.3)" filter="blur(2px)" />
                {/* Exhaust Glow */}
                <circle cx="2" cy="28" r="4" fill="#60a5fa" className="animate-pulse" filter="blur(2px)" />
                <circle cx="0" cy="28" r="2" fill="#fff" />
              </>
            )}
          </svg>
        </div>
        
        {/* Finish Line */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzIyMiIvPjxyZWN0IHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMyMjIiLz48cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] opacity-80 border-l-4 border-fuchsia-500 shadow-[-5px_0_15px_rgba(217,70,239,0.5)] z-0" />
      </div>

      <style>{`
        @keyframes moveBg {
          from { background-position: 0 0; }
          to { background-position: -40px 0; }
        }
      `}</style>

      {/* Typing Area */}
      <div className="w-full relative cursor-text" onClick={() => inputRef.current?.focus()}>
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="absolute inset-0 w-full h-full opacity-0 bg-transparent text-transparent border-none outline-none cursor-default sm:cursor-text z-10 resize-none"
          autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" data-gramm="false"
          disabled={status === 'finished'}
        />
        
        {renderText()}
        
        {/* Idle Warning */}
        {isIdle && status === 'running' && (
           <div className="absolute top-[10%] left-1/2 -translate-x-1/2 bg-red-100 text-red-600 border border-red-200 px-6 py-2 rounded-full font-bold shadow-sm animate-bounce text-sm">
              Keep Typing!
           </div>
        )}

        {status === 'finished' && (
          <div className="absolute inset-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center animate-in fade-in z-20 border border-slate-200 dark:border-slate-800">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Race Finished!</h2>
            <div className="flex gap-8 mb-8">
               <div className="text-center">
                  <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Speed</p>
                  <p className="text-blue-500 font-bold text-3xl">{wpm} WPM</p>
               </div>
               <div className="text-center">
                  <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Accuracy</p>
                  <p className="text-slate-800 dark:text-slate-200 font-bold text-3xl">{accuracy}%</p>
               </div>
            </div>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
            >
              Race Again
            </button>
          </div>
        )}
      </div>
      
      {status === 'idle' && (
        <div className="mt-8 text-slate-400 dark:text-slate-500 font-medium animate-pulse text-center">
          Start typing (Tap to open keyboard) the race
        </div>
      )}

      {/* Restart Control */}
      <div className="mt-8 flex justify-center w-full opacity-60 hover:opacity-100 transition-opacity">
        <button 
          onClick={resetGame}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-200/50 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-700 transition-all font-medium text-sm border border-slate-300/50 dark:border-slate-700/50"
          title="Restart Race (Esc)"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restart Race (Esc)</span>
        </button>
      </div>
    </div>
  );
}
