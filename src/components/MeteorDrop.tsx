import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameSettings, SessionStats } from '../types';
import { generateText } from '../utils/words';
import { playKeystrokeSound, playErrorSound, playSuccessSound } from '../utils/audio';
import { mapKeystroke } from '../utils/keyboardMap';
import SettingsBar from './SettingsBar';
import { RotateCcw } from 'lucide-react';

interface Meteor {
  id: number;
  word: string;
  x: number;
  y: number;
  speed: number;
}

interface MeteorDropProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onComplete?: (stats: SessionStats) => void;
}

export default function MeteorDrop({ settings, onSettingsChange, onComplete }: MeteorDropProps) {
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [clearedItems, setClearedItems] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [status, setStatus] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const [backspaceCount, setBackspaceCount] = useState(0);
  const [totalTypedChars, setTotalTypedChars] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef<number>();
  const lastSpawnRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const startGame = () => {
    setTimeout(() => inputRef.current?.focus(), 100);
    setStatus('playing');
    setScore(0);
    setClearedItems(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(3);
    setMeteors([]);
    setInput('');
    setStartTime(Date.now());
    setErrorCount(0);
    setBackspaceCount(0);
    setTotalTypedChars(0);
  };

  const resetGame = () => {
    setStatus('idle');
    setScore(0);
    setLives(3);
    setMeteors([]);
    setInput('');
    setStartTime(null);
    setErrorCount(0);
    setBackspaceCount(0);
    setTotalTypedChars(0);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  const getDifficultySettings = () => {
    switch (settings.difficulty) {
      case 'easy':
        return { baseSpeed: 0.3, speedMultiplier: 0.002, baseSpawn: 3500, spawnMultiplier: 5, minSpawn: 2000, scoreMult: 1 };
      case 'medium':
        return { baseSpeed: 0.6, speedMultiplier: 0.01, baseSpawn: 2500, spawnMultiplier: 15, minSpawn: 1200, scoreMult: 1.5 };
      case 'hard':
        return { baseSpeed: 1.0, speedMultiplier: 0.025, baseSpawn: 1800, spawnMultiplier: 25, minSpawn: 800, scoreMult: 2 };
      case 'developer':
        return { baseSpeed: 1.5, speedMultiplier: 0.05, baseSpawn: 1200, spawnMultiplier: 35, minSpawn: 500, scoreMult: 3 };
      default:
        return { baseSpeed: 0.6, speedMultiplier: 0.01, baseSpawn: 2500, spawnMultiplier: 15, minSpawn: 1200, scoreMult: 1.5 };
    }
  };

  const spawnMeteor = (timestamp: number) => {
    const diffSettings = getDifficultySettings();
    // Spawn rate based on score (gets faster)
    const spawnInterval = Math.max(diffSettings.minSpawn, diffSettings.baseSpawn - clearedItems * diffSettings.spawnMultiplier);
    
    if (timestamp - lastSpawnRef.current > spawnInterval) {
      const containerWidth = containerRef.current?.clientWidth || 800;
      const word = generateText(settings.difficulty, 1, settings.easyCase, settings.language, settings.hindiFont).trim();
      
      const newMeteor: Meteor = {
        id: Math.random(),
        word,
        x: Math.random() * (containerWidth - 100) + 20, // keep away from edges
        y: -50,
        speed: diffSettings.baseSpeed + (clearedItems * diffSettings.speedMultiplier) // speed increases with score
      };
      
      setMeteors(prev => [...prev, newMeteor]);
      lastSpawnRef.current = timestamp;
    }
  };

  const endGame = useCallback(() => {
    setStatus('gameover');
    if (settings.soundEnabled) playSuccessSound(); // Use success sound as game over sound for now
    if (onComplete) {
       const timeSpent = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
       const finalWpm = timeSpent > 0 ? Math.round((totalTypedChars / 5) / (timeSpent / 60)) : 0;
       const finalAccuracy = totalTypedChars === 0 ? 100 : Math.round(((totalTypedChars - errorCount) / totalTypedChars) * 100);

       onComplete({
         mode: 'meteor',
         wpm: Math.max(0, finalWpm),
         accuracy: Math.max(0, finalAccuracy),
         timeSpent,
         errorCount,
         backspaceCount,
         wordStats: {},
         letterStats: {}
       });
    }
  }, [onComplete, startTime, totalTypedChars, errorCount, backspaceCount, settings.soundEnabled]);

  const updateMeteors = useCallback((timestamp: number) => {
    if (status !== 'playing') return;

    spawnMeteor(timestamp);

    setMeteors(prev => {
      const updated = prev.map(m => ({ ...m, y: m.y + m.speed }));
      const containerHeight = containerRef.current?.clientHeight || 600;
      
      // Check for meteors that hit the bottom
      const hitBottom = updated.filter(m => m.y > containerHeight);
      if (hitBottom.length > 0) {
        setLives(l => Math.max(0, l - hitBottom.length));
        setCombo(0);
      }
      
      return updated.filter(m => m.y <= containerHeight);
    });

    requestRef.current = requestAnimationFrame(updateMeteors);
  }, [status, score, settings.difficulty, endGame, settings.soundEnabled]);

  useEffect(() => {
    if (status === 'playing') {
      requestRef.current = requestAnimationFrame(updateMeteors);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [status, updateMeteors]);

  const prevLivesRef = useRef(3);
  useEffect(() => {
    if (status === 'playing' && lives < prevLivesRef.current) {
      if (lives <= 0) {
        endGame();
      } else {
        if (settings.soundEnabled) playErrorSound();
      }
    }
    prevLivesRef.current = lives;
  }, [lives, status, endGame, settings.soundEnabled]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status !== 'playing') {
      // Auto start on first typing
      if (status === 'idle' && e.target.value.length > 0) {
         setStatus('playing');
         setStartTime(Date.now());
      } else {
         return;
      }
    }
    
    let newVal = e.target.value;
    
    // Auto-submit on space
    if (newVal.endsWith(' ')) {
      const trimmed = newVal.trim();
      const matchedIndex = meteors.findIndex(m => m.word === trimmed);
      if (matchedIndex !== -1) {
        const matchedWord = meteors[matchedIndex].word;
        const diffSettings = getDifficultySettings();
        const pts = Math.round((matchedWord.length * 10) * diffSettings.scoreMult * (1 + combo * 0.1));
        
        setMeteors(prev => prev.filter((_, idx) => idx !== matchedIndex));
        setScore(s => s + pts);
        setClearedItems(c => c + 1);
        setCombo(c => {
          const next = c + 1;
          setMaxCombo(m => Math.max(m, next));
          return next;
        });
        setInput('');
        if (settings.soundEnabled) playSuccessSound();
      } else {
        setInput('');
        setErrorCount(prev => prev + 1);
        setCombo(0);
        if (settings.soundEnabled) playErrorSound();
      }
      return;
    }
    
    if (newVal.length < input.length) {
      if (settings.backspaceLock) return;
      setBackspaceCount(prev => prev + 1);
      setInput(newVal);
      return;
    }

    if (newVal.length > input.length) {
      const addedChars = newVal.slice(input.length);
      let finalVal = input;
      
      for (const char of addedChars) {
        const mappedKey = mapKeystroke(char, settings.language, settings.hindiFont);
        finalVal += mappedKey;
        setTotalTypedChars(prev => prev + 1);
        
        const isPrefix = meteors.some(m => m.word.startsWith(finalVal));
        if (!isPrefix) {
          setErrorCount(prev => prev + 1);
          if (settings.soundEnabled) playErrorSound();
        } else {
          if (settings.soundEnabled) playKeystrokeSound();
        }
      }
      setInput(finalVal);
    }
  };

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
    if (e.key === 'Enter' && status === 'playing') {
      const matchedIndex = meteors.findIndex(m => m.word === input.trim());
      if (matchedIndex !== -1) {
        setMeteors(prev => prev.filter((_, idx) => idx !== matchedIndex));
        setScore(s => s + 10);
        setInput('');
        if (settings.soundEnabled) playSuccessSound();
      } else {
        setInput('');
        setErrorCount(prev => prev + 1);
        if (settings.soundEnabled) playErrorSound();
      }
      return;
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full min-h-[600px]">
      <SettingsBar settings={settings} onSettingsChange={onSettingsChange} disabled={status === 'playing'} />
      <div className="flex justify-between w-full max-w-4xl mb-4 glass-panel px-6 py-4 rounded-xl">
         <div className="flex flex-col">
          <span className="text-slate-400 text-sm uppercase tracking-wider">Score</span>
          <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {score}
            {combo > 1 && <span className="ml-3 text-orange-400 text-lg font-bold animate-pulse">Combo x{combo}!</span>}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-slate-400 text-sm uppercase tracking-wider">Lives</span>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3].map(l => (
              <div key={l} className={`w-6 h-6 rounded-full ${l <= lives ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-slate-700'}`} />
            ))}
          </div>
        </div>
      </div>

            <div 
        ref={containerRef}
        className="flex-grow w-full max-w-4xl rounded-2xl relative overflow-hidden flex flex-col justify-end shadow-2xl border border-slate-700/50 bg-gradient-to-b from-slate-900 via-indigo-950 to-[#050505]"
      >
        {/* Ninja Background Environment */}
        {/* Moon */}
        <div className="absolute top-8 right-12 w-24 h-24 rounded-full bg-slate-100 shadow-[0_0_60px_rgba(241,245,249,0.8)] opacity-90 z-0"></div>
        {/* Dark mountains / hills */}
        <svg preserveAspectRatio="none" viewBox="0 0 100 100" className="absolute bottom-0 w-full h-48 opacity-40 pointer-events-none z-0">
          <path d="M0,100 L0,50 Q20,30 40,60 T80,40 T100,60 L100,100 Z" fill="#0f172a" />
          <path d="M0,100 L0,70 Q25,40 50,70 T100,50 L100,100 Z" fill="#020617" />
        </svg>

        {status === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 backdrop-blur-sm">
            <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">Drop Ninja</h2>
            <p className="text-slate-300 mb-8 max-w-md text-center">Type the falling shuriken words and press Enter to deflect them before they hit the ground!</p>
            <button onClick={startGame} className="px-8 py-3 bg-red-600 text-white rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)]">
              Start Defense
            </button>
          </div>
        )}

        {status === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 backdrop-blur-md">
            <h2 className="text-4xl font-bold text-red-500 mb-2">Dojo Defeated</h2>
            <p className="text-slate-300 mb-6">Final Score: <span className="text-red-500 font-bold">{score}</span></p>
            <button onClick={startGame} className="px-8 py-3 bg-red-600 text-white rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)]">
              Play Again
            </button>
          </div>
        )}

        {/* Shurikens / Meteors */}
        {meteors.map(m => {
          const isTargeted = m.word.startsWith(input) && input.length > 0;
          return (
          <div 
            key={m.id}
            className="absolute flex flex-col items-center z-10"
            style={{ 
              left: m.x, 
              top: m.y
            }}
          >
            {/* Shuriken SVG */}
            <svg viewBox="0 0 100 100" className={`w-12 h-12 mb-2 transition-all ${isTargeted ? 'animate-spin drop-shadow-[0_0_20px_rgba(239,68,68,1)] text-red-500' : 'animate-[spin_3s_linear_infinite] drop-shadow-[0_0_10px_rgba(148,163,184,0.5)] text-slate-300'}`}>
               <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill="currentColor" />
               <circle cx="50" cy="50" r="12" fill="#020617" stroke="currentColor" strokeWidth="4" />
            </svg>
            
            <div className={`px-3 py-1 rounded-md bg-black/80 border ${isTargeted ? 'border-red-500/50' : 'border-white/10'} ${settings.language === 'hindi' ? '' : (settings.fontFamily || 'font-fira')} text-xl font-bold text-white shadow-lg`}
              style={{
                fontFamily: settings.language === 'hindi' ? (settings.hindiFont === 'krutidev' ? "'Kruti Dev 010', 'Kruti Dev', sans-serif" : "'Mangal', sans-serif") : undefined
              }}
            >
              {isTargeted ? (
                <>
                  <span className="text-red-400">{input}</span>
                  <span className="opacity-80">{m.word.substring(input.length)}</span>
                </>
              ) : (
                <span className="opacity-80">{m.word}</span>
              )}
            </div>
          </div>
        )})}
      </div>

      {/* Typing Input */}
      <div className="w-full max-w-4xl mt-4 z-20">
        <input ref={inputRef} 
          type="text"
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-white px-6 py-4 rounded-2xl text-xl font-bold focus:outline-none focus:border-red-500 shadow-xl text-center"
          placeholder="Type to deflect the shurikens..."
          autoComplete="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
}
