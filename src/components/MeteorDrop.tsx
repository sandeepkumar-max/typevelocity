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
  const [lives, setLives] = useState(3);
  const [status, setStatus] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const [backspaceCount, setBackspaceCount] = useState(0);
  const [totalTypedChars, setTotalTypedChars] = useState(0);
  
  const requestRef = useRef<number>();
  const lastSpawnRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const startGame = () => {
    setStatus('playing');
    setScore(0);
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
        return { baseSpeed: 0.5, speedMultiplier: 0.01, baseSpawn: 3000, spawnMultiplier: 20, minSpawn: 1500 };
      case 'medium':
        return { baseSpeed: 1.0, speedMultiplier: 0.02, baseSpawn: 2200, spawnMultiplier: 30, minSpawn: 1000 };
      case 'hard':
        return { baseSpeed: 1.5, speedMultiplier: 0.04, baseSpawn: 1500, spawnMultiplier: 40, minSpawn: 600 };
      case 'developer':
        return { baseSpeed: 2.0, speedMultiplier: 0.06, baseSpawn: 1000, spawnMultiplier: 50, minSpawn: 400 };
      default:
        return { baseSpeed: 1.0, speedMultiplier: 0.02, baseSpawn: 2200, spawnMultiplier: 30, minSpawn: 1000 };
    }
  };

  const spawnMeteor = (timestamp: number) => {
    const diffSettings = getDifficultySettings();
    // Spawn rate based on score (gets faster)
    const spawnInterval = Math.max(diffSettings.minSpawn, diffSettings.baseSpawn - score * diffSettings.spawnMultiplier);
    
    if (timestamp - lastSpawnRef.current > spawnInterval) {
      const containerWidth = containerRef.current?.clientWidth || 800;
      const word = generateText(settings.difficulty, 1, settings.easyCase, settings.language, settings.hindiFont).trim();
      
      const newMeteor: Meteor = {
        id: Math.random(),
        word,
        x: Math.random() * (containerWidth - 100) + 20, // keep away from edges
        y: -50,
        speed: diffSettings.baseSpeed + (score * diffSettings.speedMultiplier) // speed increases with score
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
    // Handled by keydown
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      resetGame();
      return;
    }

    if (e.key === 'Backspace') {
       if (settings.backspaceLock) {
         e.preventDefault();
         return;
       }
       setBackspaceCount(prev => prev + 1);
       if (input.length > 0) {
         e.preventDefault();
         setInput(prev => prev.slice(0, -1));
       }
       return;
    }
    
    if (e.key === 'Enter' && status === 'playing') {
      const matchedIndex = meteors.findIndex(m => m.word === input.trim());
      if (matchedIndex !== -1) {
        // Destroy meteor
        setMeteors(prev => prev.filter((_, idx) => idx !== matchedIndex));
        setScore(s => s + 10);
        setInput('');
        if (settings.soundEnabled) playSuccessSound(); // Small success
      } else {
        // Penalty? Clear input at least
        setInput('');
        setErrorCount(prev => prev + 1);
        if (settings.soundEnabled) playErrorSound();
      }
      return;
    }

    if (e.ctrlKey || e.altKey || e.metaKey || e.key.length > 1) {
       return;
    }

    e.preventDefault();
    if (status !== 'playing') return;

    const mappedKey = mapKeystroke(e.key, settings.language, settings.hindiFont);
    const val = input + mappedKey;
    
    if (val.length > input.length) {
       setTotalTypedChars(prev => prev + 1);
       // Simple error heuristic for meteor mode: if the typed text isn't a prefix of any meteor
       const isPrefix = meteors.some(m => m.word.startsWith(val));
       if (!isPrefix) {
          setErrorCount(prev => prev + 1);
          if (settings.soundEnabled) playErrorSound();
       } else {
          if (settings.soundEnabled) playKeystrokeSound();
       }
    }
    
    setInput(val);
  };

  return (
    <div className="flex flex-col items-center w-full h-full min-h-[600px]">
      <SettingsBar settings={settings} onSettingsChange={onSettingsChange} disabled={status === 'playing'} />
      <div className="flex justify-between w-full max-w-4xl mb-4 glass-panel px-6 py-4 rounded-xl">
         <div className="flex flex-col">
          <span className="text-slate-400 text-sm uppercase tracking-wider">Score</span>
          <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{score}</span>
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
        className="flex-grow w-full max-w-4xl glass-panel rounded-2xl relative overflow-hidden flex flex-col justify-end"
      >
        {status === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F172A]/50 z-10">
            <h2 className="text-4xl font-bold text-white mb-4">Meteor Drop</h2>
            <p className="text-slate-300 mb-8 max-w-md text-center">Type the falling words and press Enter to destroy them before they hit the ground!</p>
            <button onClick={startGame} className="px-8 py-3 bg-blue-500 text-slate-900 rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_15px_rgba(59, 130, 246,0.4)]">
              Start Game
            </button>
          </div>
        )}

        {status === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F172A]/80 z-10">
            <h2 className="text-4xl font-bold text-red-500 mb-2">Game Over</h2>
            <p className="text-slate-300 mb-6">Final Score: <span className="text-blue-600 dark:text-blue-400 font-bold">{score}</span></p>
            <button onClick={startGame} className="px-8 py-3 bg-blue-500 text-slate-900 rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_15px_rgba(59, 130, 246,0.4)]">
              Play Again
            </button>
          </div>
        )}

        {/* Meteors */}
        {meteors.map(m => (
          <div 
            key={m.id}
            className={`absolute ${settings.language === 'hindi' ? '' : (settings.fontFamily || 'font-fira')} text-xl font-bold text-white px-3 py-1 rounded-md border border-white/20 bg-black/40 backdrop-blur-sm`}
            style={{ 
              left: m.x, 
              top: m.y,
              boxShadow: '0 0 10px rgba(14, 165, 233,0.5)',
              textShadow: '0 0 5px rgba(255,255,255,0.5)',
              fontFamily: settings.language === 'hindi' ? (settings.hindiFont === 'krutidev' ? "'Kruti Dev 010', 'Kruti Dev', sans-serif" : "'Mangal', sans-serif") : undefined
            }}
          >
            {m.word.startsWith(input) && input.length > 0 ? (
              <>
                <span className="text-[#10B981]">{input}</span>
                <span>{m.word.substring(input.length)}</span>
              </>
            ) : (
              m.word
            )}
          </div>
        ))}

        {/* Input area */}
        <div className="w-full p-2 sm:p-4 border-t border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/20">
          <input 
            autoFocus
            type="text" 
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={status !== 'playing'}
            className={`w-full bg-white dark:bg-transparent border-2 border-slate-300 dark:border-white/20 focus:border-blue-500 rounded-lg px-4 sm:px-6 py-3 sm:py-4 text-xl sm:text-2xl ${settings.language === 'hindi' ? '' : (settings.fontFamily || 'font-fira')} text-slate-800 dark:text-white outline-none transition-colors shadow-sm`}
            style={{ fontFamily: settings.language === 'hindi' ? (settings.hindiFont === 'krutidev' ? "'Kruti Dev 010', 'Kruti Dev', sans-serif" : "'Mangal', sans-serif") : undefined }}
            placeholder="Type word and press Enter..."
          />
        </div>
      </div>

      {/* Restart Control */}
      <div className="mt-8 flex justify-center w-full opacity-60 hover:opacity-100 transition-opacity">
        <button 
          onClick={resetGame}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-200/50 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-700 transition-all font-medium text-sm border border-slate-300/50 dark:border-slate-700/50"
          title="Restart Game (Esc)"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restart Game (Esc)</span>
        </button>
      </div>
    </div>
  );
}
