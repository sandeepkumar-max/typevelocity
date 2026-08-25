import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameSettings, SessionStats } from '../types';
import { generateText } from '../utils/words';
import { mapKeystroke } from '../utils/keyboardMap';
import SettingsBar from './SettingsBar';
import { playKeystrokeSound, playErrorSound, playSuccessSound } from '../utils/audio';
import { RotateCcw } from 'lucide-react';

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
  
  const totalTypedRef = useRef(0);
  const errorCountRef = useRef(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const [offsetY, setOffsetY] = useState(0);
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Initialize text
  useEffect(() => {
    resetTest();
  }, [settings]);

  const resetTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTargetText(generateText(settings.difficulty, 50, settings.easyCase, settings.language, settings.hindiFont));
    setUserInput('');
    setStatus('idle');
    setTimeLeft(settings.time);
    setWpm(0);
    setAccuracy(100);
    setErrorCount(0);
    setBackspaceCount(0);
    setOffsetY(0);
    totalTypedRef.current = 0;
    errorCountRef.current = 0;
    if (inputRef.current) inputRef.current.focus();
  }, [settings]);

  // Handle typing
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
       e.preventDefault();
       resetTest();
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
      setBackspaceCount(prev => prev + 1);
      setUserInput(newVal);
      return;
    }

    if (newVal.length > userInput.length) {
      if (status === 'idle') setStatus('running');
      
      const addedChars = newVal.slice(userInput.length);
      let finalVal = userInput;
      
      for (const char of addedChars) {
         if (finalVal.length >= targetText.length) break;
         
         const mappedKey = mapKeystroke(char, settings.language, settings.hindiFont);
         finalVal += mappedKey;
         
         totalTypedRef.current += 1;
         const expectedChar = targetText[finalVal.length - 1];
         if (mappedKey !== expectedChar) {
            errorCountRef.current += 1;
            setErrorCount(prev => prev + 1);
            if (settings.soundEnabled) playErrorSound();
         } else {
            if (settings.soundEnabled) playKeystrokeSound();
         }
      }
      
      setUserInput(finalVal);
      calculateStats(finalVal, timeLeft);
      
      if (targetText.length - finalVal.length < 100) {
         setTargetText(prev => prev + ' ' + generateText(settings.difficulty, 50, settings.easyCase, settings.language, settings.hindiFont));
      }
    }
  };

  const calculateStats = (input: string, currentLeft: number) => {
    let correctChars = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === targetText[i]) correctChars++;
    }

    const total = totalTypedRef.current;
    const errors = errorCountRef.current;
    const accuracyVal = total === 0 ? 100 : Math.max(0, Math.round(((total - errors) / total) * 100));
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

  const endTest = useCallback((input: string, currentLeft: number) => {
    setStatus('finished');
    if (timerRef.current) clearInterval(timerRef.current);
    
    let correctChars = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === targetText[i]) correctChars++;
    }

    const total = totalTypedRef.current;
    const errors = errorCountRef.current;
    const accuracyVal = total === 0 ? 100 : Math.max(0, Math.round(((total - errors) / total) * 100));
    setAccuracy(accuracyVal);

    const timeElapsedMinutes = (settings.time - currentLeft) / 60;
    const wpmVal = timeElapsedMinutes > 0 ? Math.round((correctChars / 5) / timeElapsedMinutes) : 0;
    const finalWpm = Math.max(0, wpmVal);
    setWpm(finalWpm);
    
    if (settings.soundEnabled) playSuccessSound();

    if (onComplete) {
      onComplete({
        wpm: finalWpm,
        accuracy: accuracyVal,
        errorCount: errors,
        backspaceCount: backspaceCount,
        timeSpent: settings.time - currentLeft,
        mode: 'practice',
        wordStats: {},
        letterStats: {}
      });
    }
  }, [onComplete, settings.soundEnabled, settings.time, targetText, backspaceCount]);

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

  // Track cursor position to keep active line centered
  useEffect(() => {
    if (!settings.autoScroll) {
      setOffsetY(0);
      if (cursorRef.current && status === 'running') {
        cursorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (cursorRef.current && textContainerRef.current && status !== 'finished') {
      const container = textContainerRef.current;
      const cursor = cursorRef.current;
      
      const lineHeight = cursor.offsetHeight || 32;
      const cursorTop = cursor.offsetTop;
      
      const firstSpan = container.querySelector('span');
      const baseOffset = firstSpan ? firstSpan.offsetTop : 0;
      
      const containerHeight = container.clientHeight;
      const centerOfContainer = (containerHeight / 2) - (lineHeight / 2);
      
      const targetOffsetY = centerOfContainer - (cursorTop - baseOffset);
      
      // Prevent scrolling down beyond the first line (so the first line starts at the top if autoScroll is on but we don't want it centered initially)
      // Actually the previous logic centered the first line. If we want that, we keep it. 
      // Let's just use the calculated offset.
      setOffsetY(targetOffsetY);
    }
  }, [userInput, status, settings.autoScroll]);

  // Render text with highlighting
  const renderText = () => {
    return (
      <div 
        ref={textContainerRef}
        className={`w-full select-none ${settings.autoScroll ? 'h-full overflow-hidden [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)] [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)]' : ''}`} 
        onClick={() => inputRef.current?.focus()}
      >
        <div 
          className={`${settings.language === 'hindi' ? (settings.hindiFont === 'krutidev' ? 'font-krutidev' : '') : (settings.fontFamily || 'font-fira')} text-lg sm:text-2xl leading-relaxed tracking-wide whitespace-pre-wrap transition-transform duration-200 ease-out`}
          style={{ 
            transform: `translateY(${offsetY}px)`,
            fontFamily: settings.language === 'hindi' ? (settings.hindiFont === 'krutidev' ? "'Kruti Dev 010', 'Kruti Dev', sans-serif" : "'Mangal', sans-serif") : undefined
          }}
        >
          {targetText.split('').map((char, index) => {
          let colorClass = 'text-slate-500 dark:text-slate-400'; // un-typed
          let borderClass = '';
          let isCursor = false;
          
          if (index < userInput.length) {
            colorClass = userInput[index] === char ? 'text-[#10B981]' : 'text-red-500 bg-red-500/20';
          }
          
          // Cursor
          if (index === userInput.length && status !== 'finished') {
            borderClass = 'border-l-2 border-blue-500 animate-pulse';
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
          <span className="text-2xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">{wpm}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm uppercase tracking-wider">Time</span>
          <span className={`text-2xl sm:text-4xl font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-slate-800 dark:text-slate-200'}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm uppercase tracking-wider">Accuracy</span>
          <span className="text-2xl sm:text-4xl font-bold text-sky-600 dark:text-sky-400">{accuracy}%</span>
        </div>
      </div>

      {/* Typing Area */}
      <div className={`w-full glass-panel p-4 sm:p-8 rounded-2xl relative h-64 sm:h-80 ${settings.autoScroll ? 'overflow-hidden' : 'overflow-y-auto'} cursor-text`} onClick={() => inputRef.current?.focus()}>
        
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="absolute inset-0 w-full h-full opacity-0 bg-transparent text-transparent border-none outline-none cursor-default sm:cursor-text z-10 resize-none"
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
            <p className="text-slate-600 dark:text-slate-300 mb-6 text-center px-4">You typed at <span className="text-blue-600 dark:text-blue-400 font-bold">{wpm} WPM</span> with <span className="text-sky-600 dark:text-sky-400 font-bold">{accuracy}%</span> accuracy.</p>
            <button
              onClick={resetTest}
              className="px-6 py-2 sm:px-8 sm:py-3 bg-blue-500 text-slate-900 rounded-full font-bold hover:bg-blue-400 hover:scale-105 transition-all shadow-[0_0_15px_rgba(59, 130, 246,0.4)]"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Restart Control */}
      <div className="mt-8 flex justify-center w-full opacity-60 hover:opacity-100 transition-opacity">
        <button 
          onClick={resetTest}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-200/50 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-700 transition-all font-medium text-sm border border-slate-300/50 dark:border-slate-700/50"
          title="Restart Test (Esc)"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restart Test (Esc)</span>
        </button>
      </div>
    </div>
  );
}
