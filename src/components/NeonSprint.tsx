import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameSettings, SessionStats } from '../types';
import { generateText } from '../utils/words';
import { playKeystrokeSound, playErrorSound, playSuccessSound } from '../utils/audio';

interface NeonSprintProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onComplete?: (stats: SessionStats) => void;
}

export default function NeonSprint({ settings, onComplete }: NeonSprintProps) {
  const [targetText, setTargetText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'running' | 'finished'>('idle');
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [progress, setProgress] = useState(0);
  const [isIdle, setIsIdle] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [backspaceCount, setBackspaceCount] = useState(0);
  
  const startTimeRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    resetGame();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [settings]);

  const resetGame = useCallback(() => {
    setTargetText(generateText(settings.difficulty, 30, settings.easyCase));
    setUserInput('');
    setStatus('idle');
    setWpm(0);
    setAccuracy(100);
    setProgress(0);
    setIsIdle(false);
    setErrorCount(0);
    setBackspaceCount(0);
    startTimeRef.current = null;
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (inputRef.current) inputRef.current.focus();
  }, [settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'finished') return;
    const val = e.target.value;
    
    if (val.length > targetText.length) return;

    if (status === 'idle') {
      setStatus('running');
      startTimeRef.current = Date.now();
    }

    if (val.length > userInput.length) {
       const lastChar = val[val.length - 1];
       const expectedChar = targetText[val.length - 1];
       if (lastChar !== expectedChar) {
          setErrorCount(prev => prev + 1);
          if (settings.soundEnabled) playErrorSound();
       } else {
          if (settings.soundEnabled) playKeystrokeSound();
       }
    }

    setUserInput(val);
    
    // Idle logic
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setIsIdle(false);
    if (val.length < targetText.length) {
      idleTimerRef.current = setTimeout(() => {
        setIsIdle(true);
      }, 2000);
    }

    // Calculate correct characters
    let correct = 0;
    for(let i=0; i<val.length; i++) {
      if(val[i] === targetText[i]) correct++;
    }
    
    const newProgress = Math.min(100, (val.length / targetText.length) * 100);
    setProgress(newProgress);
    
    const currentAccuracy = val.length === 0 ? 100 : Math.round((correct / val.length) * 100);
    setAccuracy(currentAccuracy);

    // Live WPM
    let currentWpm = wpm;
    if (startTimeRef.current) {
      const minutesElapsed = (Date.now() - startTimeRef.current) / 60000;
      if (minutesElapsed > 0) {
        currentWpm = Math.round((correct / 5) / minutesElapsed);
        setWpm(currentWpm);
      }
    }

    if (val.length === targetText.length) {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      setStatus('finished');
      if (settings.soundEnabled) playSuccessSound();
      
      if (onComplete) {
         const timeSpent = startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0;
         onComplete({
           mode: 'sprint',
           wpm: currentWpm,
           accuracy: currentAccuracy,
           timeSpent,
           errorCount,
           backspaceCount,
           wordStats: {},
           letterStats: {}
         });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
       setBackspaceCount(prev => prev + 1);
    }
  };

  // Scroll cursor into view
  useEffect(() => {
    if (cursorRef.current && status === 'running') {
      cursorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [userInput, status]);

  const renderText = () => {
    return (
      <div className="font-fira text-lg sm:text-xl leading-relaxed tracking-wide whitespace-pre-wrap select-none mt-4 sm:mt-8 p-4 sm:p-6 glass-panel rounded-xl h-48 sm:h-64 overflow-y-auto">
        {targetText.split('').map((char, index) => {
          let colorClass = 'text-slate-500';
          let borderClass = '';
          let isCursor = false;
          
          if (index < userInput.length) {
            colorClass = userInput[index] === char ? 'text-slate-800 dark:text-slate-300' : 'text-red-500 bg-red-500/20';
          }
          
          if (index === userInput.length && status !== 'finished') {
            borderClass = 'border-l-2 border-amber-500 animate-pulse';
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
    );
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto min-h-[500px]">
      
      {/* HUD */}
      <div className="flex justify-between w-full mb-4 sm:mb-8 glass-panel px-4 sm:px-6 py-3 sm:py-4 rounded-xl">
        <div className="flex flex-col">
          <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm uppercase tracking-wider">Speed</span>
          <span className="text-2xl sm:text-4xl font-bold text-emerald-600 dark:text-emerald-400">{wpm} WPM</span>
        </div>
        <div className="flex flex-col items-center hidden sm:flex">
          <span className="text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">Accuracy</span>
          <span className="text-4xl font-bold text-slate-800 dark:text-white">{accuracy}%</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm uppercase tracking-wider">Progress</span>
          <span className="text-2xl sm:text-4xl font-bold text-amber-600 dark:text-amber-400">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Track & Car */}
      <div className="w-full h-24 sm:h-32 relative mb-4 sm:mb-8 rounded-xl overflow-hidden glass-panel border-b-4 border-b-slate-400 dark:border-b-slate-700">
        {/* Moving background lines effect */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, #00E5FF 40px, #00E5FF 80px)',
            backgroundSize: '200% 100%',
            animation: status === 'running' && !isIdle ? `moveBg ${Math.max(0.5, 3 - wpm/50)}s linear infinite` : 'none'
          }}
        />
        
        {/* The Car */}
        <div 
          className="absolute bottom-2 transition-all duration-300 ease-out z-10"
          style={{ left: `calc(${progress}% - 40px)` }}
        >
          <div className="w-20 h-8 bg-emerald-500 rounded-t-lg rounded-br-lg relative shadow-[0_0_20px_rgba(16, 185, 129,0.6)]">
             {/* Exhaust */}
             {status === 'running' && !isIdle && (
                <div className="absolute left-[-20px] bottom-1 w-6 h-2 bg-orange-500 rounded-full animate-pulse blur-[2px]" />
             )}
             {/* Windows */}
             <div className="absolute top-1 right-2 w-8 h-4 bg-[#0F172A] rounded-tr-sm" />
             {/* Wheels */}
             <div className="absolute -bottom-2 left-2 w-4 h-4 bg-slate-900 rounded-full border border-slate-600" />
             <div className="absolute -bottom-2 right-2 w-4 h-4 bg-slate-900 rounded-full border border-slate-600" />
          </div>
        </div>
        
        {/* Finish Line */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzAwMCIvPjxyZWN0IHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMwMDAiLz48cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] opacity-50 border-l border-white/20" />
      </div>

      <style>{`
        @keyframes moveBg {
          from { background-position: 0 0; }
          to { background-position: -80px 0; }
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
          className="absolute opacity-0 w-[1px] h-[1px] -z-10"
          style={{ top: '50%', left: '50%' }}
          autoComplete="off"
          disabled={status === 'finished'}
        />
        {renderText()}
        
        {/* Idle Warning */}
        {isIdle && status === 'running' && (
           <div className="absolute top-[10%] left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-4 sm:px-6 py-1 sm:py-2 rounded-full font-bold shadow-lg animate-bounce text-sm sm:text-base whitespace-nowrap">
              Keep Typing!
           </div>
        )}

        {status === 'finished' && (
          <div className="absolute inset-0 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center animate-in fade-in z-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Race Finished!</h2>
            <div className="flex gap-4 sm:gap-8 mb-6">
               <div className="text-center">
                  <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm uppercase tracking-wider">Speed</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold text-xl sm:text-2xl">{wpm} WPM</p>
               </div>
               <div className="text-center">
                  <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm uppercase tracking-wider">Accuracy</p>
                  <p className="text-amber-600 dark:text-amber-400 font-bold text-xl sm:text-2xl">{accuracy}%</p>
               </div>
            </div>
            <button
              onClick={resetGame}
              className="px-6 py-2 sm:px-8 sm:py-3 bg-emerald-500 text-slate-900 rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_15px_rgba(16, 185, 129,0.4)]"
            >
              Race Again
            </button>
          </div>
        )}
      </div>
      
      {status === 'idle' && (
        <div className="mt-4 sm:mt-8 text-slate-500 dark:text-slate-400 animate-pulse text-sm sm:text-base">
          Start typing to begin the race!
        </div>
      )}
    </div>
  );
}
