import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameSettings, SessionStats } from '../types';
import { generateText } from '../utils/words';
import { playKeystrokeSound, playErrorSound, playSuccessSound } from '../utils/audio';

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

export default function MeteorDrop({ settings, onComplete }: MeteorDropProps) {
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

  const spawnMeteor = (timestamp: number) => {
    // Spawn rate based on score (gets faster)
    const spawnInterval = Math.max(800, 2000 - score * 50);
    
    if (timestamp - lastSpawnRef.current > spawnInterval) {
      const containerWidth = containerRef.current?.clientWidth || 800;
      const word = generateText(settings.difficulty, 1, settings.easyCase).trim();
      
      const newMeteor: Meteor = {
        id: Math.random(),
        word,
        x: Math.random() * (containerWidth - 100) + 20, // keep away from edges
        y: -50,
        speed: 1 + (score * 0.05) // speed increases with score
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
    if (status !== 'playing') return;
    const val = e.target.value;
    
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
       setBackspaceCount(prev => prev + 1);
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
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full min-h-[600px]">
      <div className="flex justify-between w-full max-w-4xl mb-4 glass-panel px-6 py-4 rounded-xl">
         <div className="flex flex-col">
          <span className="text-slate-400 text-sm uppercase tracking-wider">Score</span>
          <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{score}</span>
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
            <button onClick={startGame} className="px-8 py-3 bg-emerald-500 text-slate-900 rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_15px_rgba(16, 185, 129,0.4)]">
              Start Game
            </button>
          </div>
        )}

        {status === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F172A]/80 z-10">
            <h2 className="text-4xl font-bold text-red-500 mb-2">Game Over</h2>
            <p className="text-slate-300 mb-6">Final Score: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{score}</span></p>
            <button onClick={startGame} className="px-8 py-3 bg-emerald-500 text-slate-900 rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_15px_rgba(16, 185, 129,0.4)]">
              Play Again
            </button>
          </div>
        )}

        {/* Meteors */}
        {meteors.map(m => (
          <div 
            key={m.id}
            className="absolute font-fira text-xl font-bold text-white px-3 py-1 rounded-md border border-white/20 bg-black/40 backdrop-blur-sm"
            style={{ 
              left: m.x, 
              top: m.y,
              boxShadow: '0 0 10px rgba(245, 158, 11,0.5)',
              textShadow: '0 0 5px rgba(255,255,255,0.5)'
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
            className="w-full bg-white dark:bg-transparent border-2 border-slate-300 dark:border-white/20 focus:border-emerald-500 rounded-lg px-4 sm:px-6 py-3 sm:py-4 text-xl sm:text-2xl font-fira text-slate-800 dark:text-white outline-none transition-colors shadow-sm"
            placeholder="Type word and press Enter..."
          />
        </div>
      </div>
    </div>
  );
}
