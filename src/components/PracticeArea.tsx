import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameSettings, SessionStats } from '../types';
import { generateText } from '../utils/words';
import SettingsBar from './SettingsBar';
import { playKeystrokeSound, playErrorSound, playSuccessSound } from '../utils/audio';

interface PracticeAreaProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onComplete?: (stats: SessionStats) => void;
}

export default function PracticeArea({ settings, onSettingsChange, onComplete }: PracticeAreaProps) {
  const [targetText, setTargetText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'running' | 'finished'>('idle');
  const [timeLeft, setTimeLeft] = useState(settings.time);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errorCount, setErrorCount] = useState(0);
  const [backspaceCount, setBackspaceCount] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  // Initialize text
  useEffect(() => {
    resetTest();
  }, [settings]);

  const resetTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTargetText(generateText(settings.difficulty, 50, settings.easyCase));
    setUserInput('');
    setStatus('idle');
    setTimeLeft(settings.time);
    setWpm(0);
    setAccuracy(100);
    setErrorCount(0);
    setBackspaceCount(0);
    if (inputRef.current) inputRef.current.focus();
  }, [settings]);

  // Handle typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'finished') return;
    
    const val = e.target.value;
    
    if (val.length > targetText.length) return;

    if (status === 'idle') {
      setStatus('running');
    }

    if (val.length > userInput.length) {
       // Char typed
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
    calculateStats(val, timeLeft);

    if (val.length === targetText.length) {
      endTest(val, timeLeft);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
       setBackspaceCount(prev => prev + 1);
    }
  };

  const endTest = (finalInput: string = userInput, finalTimeLeft: number = timeLeft) => {
    setStatus('finished');
    if (timerRef.current) clearInterval(timerRef.current);
    if (settings.soundEnabled) playSuccessSound();
    
    if (onComplete) {
       const correctChars = finalInput.split('').filter((c, i) => c === targetText[i]).length;
       const timeSpent = settings.time - finalTimeLeft;
       const finalWpm = timeSpent > 0 ? Math.round((correctChars / 5) / (timeSpent / 60)) : 0;
       const finalAccuracy = finalInput.length === 0 ? 100 : Math.round((correctChars / finalInput.length) * 100);
       
       onComplete({
         mode: 'practice',
         wpm: Math.max(0, finalWpm),
         accuracy: finalAccuracy,
         timeSpent,
         errorCount,
         backspaceCount,
         wordStats: {},
         letterStats: {}
       });
    }
  };

  const calculateStats = (input: string, currentLeft: number) => {
    let correctChars = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === targetText[i]) correctChars++;
    }

    const accuracyVal = input.length === 0 ? 100 : Math.round((correctChars / input.length) * 100);
    setAccuracy(accuracyVal);

    const timeElapsedMinutes = (settings.time - currentLeft) / 60;
    if (timeElapsedMinutes > 0) {
      const wpmVal = Math.round((correctChars / 5) / timeElapsedMinutes);
      setWpm(Math.max(0, wpmVal));
    }
  };

  const userInputRef = useRef(userInput);
  useEffect(() => {
    userInputRef.current = userInput;
  }, [userInput]);

  // Timer effect
  useEffect(() => {
    if (status === 'running' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]); 

  // Handle time expiration
  useEffect(() => {
    if (status === 'running') {
      if (timeLeft <= 0) {
        endTest(userInputRef.current, 0);
      } else {
        calculateStats(userInputRef.current, timeLeft);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, status]);

  // Scroll cursor into view when typing
  useEffect(() => {
    if (cursorRef.current && status === 'running') {
      cursorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [userInput, status]);

  // Render text with highlighting
  const renderText = () => {
    return (
      <div className="font-fira text-lg sm:text-2xl leading-relaxed tracking-wide whitespace-pre-wrap select-none" onClick={() => inputRef.current?.focus()}>
        {targetText.split('').map((char, index) => {
          let colorClass = 'text-slate-500'; // un-typed
          let borderClass = '';
          let isCursor = false;
          
          if (index < userInput.length) {
            colorClass = userInput[index] === char ? 'text-[#10B981]' : 'text-red-500 bg-red-500/20';
          }
          
          // Cursor
          if (index === userInput.length && status !== 'finished') {
            borderClass = 'border-l-2 border-emerald-500 animate-pulse';
            colorClass = 'text-slate-800 dark:text-slate-300'; // Current char to type
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
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <SettingsBar settings={settings} onSettingsChange={onSettingsChange} disabled={status === 'running'} />
      
      {/* HUD */}
      <div className="flex justify-between w-full mb-4 sm:mb-8 glass-panel px-4 sm:px-6 py-3 sm:py-4 rounded-xl">
        <div className="flex flex-col">
          <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm uppercase tracking-wider">WPM</span>
          <span className="text-2xl sm:text-4xl font-bold text-emerald-600 dark:text-emerald-400">{wpm}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm uppercase tracking-wider">Time</span>
          <span className={`text-2xl sm:text-4xl font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-slate-800 dark:text-slate-200'}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm uppercase tracking-wider">Accuracy</span>
          <span className="text-2xl sm:text-4xl font-bold text-amber-600 dark:text-amber-400">{accuracy}%</span>
        </div>
      </div>

      {/* Typing Area */}
      <div className="w-full glass-panel p-4 sm:p-8 rounded-2xl relative h-64 sm:h-80 overflow-y-auto cursor-text" onClick={() => inputRef.current?.focus()}>
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="absolute opacity-0 w-[1px] h-[1px] -z-10"
          style={{ top: '50%', left: '50%' }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          disabled={status === 'finished'}
        />
        {renderText()}
        
        {status === 'finished' && (
          <div className="absolute inset-0 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center animate-in fade-in z-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Test Complete!</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6 text-center px-4">You typed at <span className="text-emerald-600 dark:text-emerald-400 font-bold">{wpm} WPM</span> with <span className="text-amber-600 dark:text-amber-400 font-bold">{accuracy}%</span> accuracy.</p>
            <button
              onClick={resetTest}
              className="px-6 py-2 sm:px-8 sm:py-3 bg-emerald-500 text-slate-900 rounded-full font-bold hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_15px_rgba(16, 185, 129,0.4)]"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
