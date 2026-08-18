import React, { useState, useEffect, useRef } from 'react';
import { GameSettings, SessionStats } from '../types';
import { generateText } from '../utils/words';
import { mapKeystroke } from '../utils/keyboardMap';
import { Keyboard } from 'lucide-react';
import SettingsBar from './SettingsBar';
import { RotateCcw } from 'lucide-react';

interface BubbleShootProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onComplete: (stats: SessionStats) => void;
}

interface Bubble {
  id: number;
  word: string;
  x: number;
  y: number;
  speed: number;
  size: number;
  colorClass: string;
}

const BUBBLE_COLORS = [
  'border-blue-400 bg-blue-500/10 text-blue-500',
  'border-sky-400 bg-sky-500/10 text-sky-500',
  'border-indigo-400 bg-indigo-500/10 text-indigo-500',
  'border-purple-400 bg-purple-500/10 text-purple-500',
  'border-teal-400 bg-teal-500/10 text-teal-500',
];

export default function BubbleShoot({ settings, onSettingsChange, onComplete }: BubbleShootProps) {
  const [status, setStatus] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  // Stats
  const [totalTypedChars, setTotalTypedChars] = useState(0);
  const [errors, setErrors] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const lastSpawnRef = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const getDifficultySettings = () => {
    switch (settings.difficulty) {
      case 'easy':
        return { baseSpeed: 0.3, speedMultiplier: 0.005, baseSpawn: 3500, spawnMultiplier: 15, minSpawn: 2000 };
      case 'medium':
        return { baseSpeed: 0.6, speedMultiplier: 0.01, baseSpawn: 2500, spawnMultiplier: 25, minSpawn: 1200 };
      case 'hard':
        return { baseSpeed: 1.0, speedMultiplier: 0.03, baseSpawn: 1800, spawnMultiplier: 35, minSpawn: 800 };
      case 'developer':
        return { baseSpeed: 1.5, speedMultiplier: 0.05, baseSpawn: 1200, spawnMultiplier: 45, minSpawn: 500 };
      default:
        return { baseSpeed: 0.6, speedMultiplier: 0.01, baseSpawn: 2500, spawnMultiplier: 25, minSpawn: 1200 };
    }
  };

  const endGame = () => {
    setStatus('finished');
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    
    const timeSpent = startTime ? (Date.now() - startTime) / 1000 : 0;
    const minutes = timeSpent / 60;
    const wpm = minutes > 0 ? Math.round((totalTypedChars / 5) / minutes) : 0;
    const accuracy = totalTypedChars > 0 ? Math.round(((totalTypedChars - errors) / totalTypedChars) * 100) : 0;
    
    onComplete({
      mode: 'bubble',
      wpm,
      accuracy: Math.max(0, accuracy),
      timeSpent,
      errorCount: errors,
      backspaceCount: 0, // Not really applicable here as we clear on error
      wordStats: {},
      letterStats: {}
    });
  };

  const spawnBubble = (timestamp: number) => {
    const diffSettings = getDifficultySettings();
    const spawnInterval = Math.max(diffSettings.minSpawn, diffSettings.baseSpawn - score * diffSettings.spawnMultiplier);
    
    if (timestamp - lastSpawnRef.current > spawnInterval) {
      const containerWidth = containerRef.current?.clientWidth || 800;
      const containerHeight = containerRef.current?.clientHeight || 600;
      const word = generateText(settings.difficulty, 1, settings.easyCase, settings.language, settings.hindiFont).trim();
      
      const size = Math.max(80, word.length * 15 + 40); // Size based on word length
      const colorClass = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
      
      const newBubble: Bubble = {
        id: Math.random(),
        word,
        x: Math.random() * (containerWidth - size),
        y: containerHeight, // Start at the bottom edge so it appears immediately
        speed: diffSettings.baseSpeed + (score * diffSettings.speedMultiplier),
        size,
        colorClass
      };
      
      setBubbles(prev => [...prev, newBubble]);
      lastSpawnRef.current = timestamp;
    }
  };

  const updateBubbles = (timestamp: number) => {
    if (status !== 'playing') return;
    
    spawnBubble(timestamp);

    setBubbles(prev => {
      // Move bubbles up
      const updated = prev.map(b => ({ ...b, y: b.y - b.speed }));
      
      // Check for bubbles that floated out of the top
      const floatedAway = updated.filter(b => b.y + b.size < 0);
      if (floatedAway.length > 0) {
        setLives(l => Math.max(0, l - floatedAway.length));
      }
      
      return updated.filter(b => b.y + b.size >= 0);
    });

    requestRef.current = requestAnimationFrame(updateBubbles);
  };

  useEffect(() => {
    if (lives <= 0 && status === 'playing') {
      endGame();
    }
  }, [lives, status]);

  useEffect(() => {
    if (status === 'playing') {
      requestRef.current = requestAnimationFrame(updateBubbles);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [status, score, settings.difficulty]);

  useEffect(() => {
    if (status === 'idle') {
      inputRef.current?.focus();
    }
  }, [status]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
       if (settings.backspaceLock) {
         e.preventDefault();
         return;
       }
       if (userInput.length > 0) {
         e.preventDefault();
         setUserInput(prev => prev.slice(0, -1));
       }
       return;
    }
    
    if (e.key === 'Escape') {
      e.preventDefault();
      resetGame();
      return;
    }

    if (e.ctrlKey || e.altKey || e.metaKey || e.key.length > 1) {
       return;
    }

    e.preventDefault();

    let isStarting = false;
    if (status === 'idle') {
      setStatus('playing');
      setStartTime(Date.now());
      isStarting = true;
    }
    
    if (status !== 'playing' && !isStarting) return;
    if (isStarting) return;

    const mappedKey = mapKeystroke(e.key, settings.language, settings.hindiFont);
    const val = userInput + mappedKey;

    setTotalTypedChars(prev => prev + 1);

    if (settings.soundEnabled) {
      // play click sound
    }

    const isPrefix = bubbles.some(b => b.word.startsWith(val));
    
    if (!isPrefix && val.length > 0) {
      setErrors(e => e + 1);
      setUserInput(''); // Reset on mistake
      return;
    }

    const matchedIndex = bubbles.findIndex(b => b.word === val.trim());
    if (matchedIndex !== -1) {
      setBubbles(prev => prev.filter((_, i) => i !== matchedIndex));
      setScore(s => s + 1);
      setUserInput('');
      
      if (settings.soundEnabled) {
        // play pop sound
      }
    } else {
      setUserInput(val);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handled by keydown
  };

  const resetGame = () => {
    setStatus('idle');
    setBubbles([]);
    setUserInput('');
    setScore(0);
    setLives(5);
    setTotalTypedChars(0);
    setErrors(0);
    setStartTime(null);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto relative">
      <SettingsBar settings={settings} onSettingsChange={onSettingsChange} disabled={status === 'playing'} />
      
      <div className="w-full flex justify-between items-center mb-4 px-6">
        <div className="text-slate-500 font-medium">Score: <span className="text-blue-500 text-2xl font-bold">{score}</span></div>
        <div className="text-slate-500 font-medium">Lives: <span className="text-red-500 text-2xl font-bold">{lives}</span></div>
      </div>

      <div 
        ref={containerRef}
        className="w-full h-[500px] shrink-0 relative overflow-hidden bg-slate-50 dark:bg-[#0F172A]/50 border border-slate-200 dark:border-slate-800 rounded-3xl"
        onClick={() => inputRef.current?.focus()}
      >
        {status === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 dark:bg-[#0F172A]/50 backdrop-blur-sm z-20">
            <Keyboard className="w-16 h-16 text-slate-400 mb-4 opacity-50" />
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Bubble Shoot</h3>
            <p className="text-slate-500 max-w-md text-center mb-6">Type the words inside the bubbles to pop them before they float away! Make a mistake, and your input resets.</p>
            <p className="text-blue-500 font-medium animate-pulse">Start typing to begin</p>
          </div>
        )}

        {bubbles.map(bubble => {
          const isTargeted = userInput.length > 0 && bubble.word.startsWith(userInput);
          
          return (
            <div
              key={bubble.id}
              className={`absolute flex items-center justify-center rounded-full border-2 transition-transform ${bubble.colorClass} ${isTargeted ? 'scale-110 shadow-[0_0_20px_rgba(59,130,246,0.5)] border-blue-500 z-10' : 'opacity-80'}`}
              style={{
                left: bubble.x,
                top: bubble.y,
                width: bubble.size,
                height: bubble.size,
                boxShadow: 'inset 0 0 20px rgba(255,255,255,0.2)'
              }}
            >
              <div className="absolute top-[15%] left-[20%] w-[20%] h-[20%] bg-white/30 rounded-full blur-[2px]"></div>
              <span className={`font-medium ${settings.language === 'hindi' ? '' : 'font-mono'} ${isTargeted ? 'text-lg font-bold' : 'text-base'}`}>
                {isTargeted ? (
                  <>
                    <span className="text-slate-900 dark:text-white">{userInput}</span>
                    <span className="opacity-50">{bubble.word.slice(userInput.length)}</span>
                  </>
                ) : (
                  bubble.word
                )}
              </span>
            </div>
          );
        })}

        {status === 'finished' && (
          <div className="absolute inset-0 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md z-30 flex flex-col items-center justify-center rounded-3xl">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Game Over!</h2>
            <p className="text-slate-500 mb-8">You popped {score} bubbles.</p>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="fixed opacity-0 pointer-events-none -z-10 w-[1px] h-[1px]"
        style={{ top: '50%', left: '50%' }}
        autoComplete="off"
        disabled={status === 'finished'}
      />
      
      <div className="mt-6 text-2xl font-mono text-slate-800 dark:text-slate-200 h-8 flex items-center justify-center w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        {userInput || <span className="text-slate-400 opacity-50">...</span>}
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
