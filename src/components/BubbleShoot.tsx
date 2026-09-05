import React, { useState, useEffect, useRef } from 'react';
import { GameSettings, SessionStats } from '../types';
import { generateText } from '../utils/words';
import { mapKeystroke } from '../utils/keyboardMap';
import { Keyboard, RotateCcw } from 'lucide-react';
import SettingsBar from './SettingsBar';

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
  'border-emerald-400 bg-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]',
  'border-teal-400 bg-teal-500/20 text-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.4)]',
  'border-cyan-400 bg-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]',
  'border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-400 shadow-[0_0_20px_rgba(232,121,249,0.4)]',
  'border-indigo-400 bg-indigo-500/20 text-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.4)]',
];

export default function BubbleShoot({ settings, onSettingsChange, onComplete }: BubbleShootProps) {
  const [status, setStatus] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [clearedItems, setClearedItems] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lives, setLives] = useState(5);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  // Stats
  const [totalTypedChars, setTotalTypedChars] = useState(0);
  const [errors, setErrors] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const getDifficultySettings = () => {
    switch (settings.difficulty) {
      case 'easy':
        return { baseSpeed: 0.3, speedMultiplier: 0.005, baseSpawn: 3500, spawnMultiplier: 15, minSpawn: 2000, scoreMult: 1 };
      case 'medium':
        return { baseSpeed: 0.6, speedMultiplier: 0.01, baseSpawn: 2500, spawnMultiplier: 25, minSpawn: 1200, scoreMult: 1.5 };
      case 'hard':
        return { baseSpeed: 1.0, speedMultiplier: 0.03, baseSpawn: 1800, spawnMultiplier: 35, minSpawn: 800, scoreMult: 2 };
      case 'developer':
        return { baseSpeed: 1.5, speedMultiplier: 0.05, baseSpawn: 1200, spawnMultiplier: 45, minSpawn: 500, scoreMult: 3 };
      default:
        return { baseSpeed: 0.6, speedMultiplier: 0.01, baseSpawn: 2500, spawnMultiplier: 25, minSpawn: 1200, scoreMult: 1.5 };
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
    const spawnInterval = Math.max(diffSettings.minSpawn, diffSettings.baseSpawn - clearedItems * diffSettings.spawnMultiplier);
    
    if (timestamp - lastSpawnRef.current > spawnInterval) {
      const containerWidth = containerRef.current?.clientWidth || 800;
      const containerHeight = containerRef.current?.clientHeight || 600;
      const word = generateText(settings.difficulty, 1, settings.easyCase, settings.language, settings.hindiFont).trim();
      
      const size = Math.max(80, word.length * 16 + 40); // Size based on word length
      const safeX = Math.max(10, Math.random() * Math.max(10, containerWidth - size - 20) + 10);
      const colorClass = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
      
      const newBubble: Bubble = {
        id: Math.random(),
        word,
        x: safeX,
        y: containerHeight, // Start at the bottom edge so it appears immediately
        speed: diffSettings.baseSpeed + (clearedItems * diffSettings.speedMultiplier),
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
        setCombo(0);
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
      let isStarting = false;
      if (status === 'idle') {
        setStatus('playing');
        setStartTime(Date.now());
        isStarting = true;
      }
      
      if (status !== 'playing' && !isStarting) return;
      
      const addedChars = newVal.slice(userInput.length);
      let finalVal = userInput;
      let mistakes = 0;
      let matchedId = -1;
      
      for (const char of addedChars) {
        const mappedKey = mapKeystroke(char, settings.language, settings.hindiFont);
        const tempVal = finalVal + mappedKey;
        setTotalTypedChars(prev => prev + 1);
        
        const isPrefix = bubbles.some(b => b.word.startsWith(tempVal));
        if (!isPrefix && tempVal.length > 0) {
          mistakes++;
          finalVal = '';
          break;
        }
        
        finalVal = tempVal;
        const matchedIndex = bubbles.findIndex(b => b.word === finalVal.trim());
        if (matchedIndex !== -1) {
          matchedId = matchedIndex;
          break;
        }
      }
      
      if (mistakes > 0) {
        setErrors(e => e + mistakes);
        setCombo(0);
        setUserInput('');
        return;
      }
      
      if (matchedId !== -1) {
        const matchedWord = bubbles[matchedId].word;
        const diffSettings = getDifficultySettings();
        const pts = Math.round((matchedWord.length * 10) * diffSettings.scoreMult * (1 + combo * 0.1));
        
        setBubbles(prev => prev.filter((_, i) => i !== matchedId));
        setScore(s => s + pts);
        setClearedItems(c => c + 1);
        setCombo(c => {
          const next = c + 1;
          setMaxCombo(m => Math.max(m, next));
          return next;
        });
        setUserInput('');
      } else {
        setUserInput(finalVal);
      }
    }
  };

  const startGame = () => {
    resetGame();
    setStatus('playing');
    setStartTime(Date.now());
  };

  const resetGame = () => {
    setStatus('idle');
    setBubbles([]);
    setUserInput('');
    setScore(0);
    setClearedItems(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(5);
    setTotalTypedChars(0);
    setErrors(0);
    setStartTime(null);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="flex flex-col items-center w-full h-full min-h-[600px] max-w-4xl mx-auto relative">
      <SettingsBar settings={settings} onSettingsChange={onSettingsChange} disabled={status === 'playing'} />
      
      <div className="w-full flex justify-between items-center mb-4 px-6">
        <div className="text-slate-500 font-medium">
          Score: <span className="text-blue-500 text-2xl font-bold">{score}</span>
          {combo > 1 && <span className="ml-3 text-orange-400 text-lg font-bold animate-pulse">Combo x{combo}!</span>}
        </div>
        <div className="text-slate-500 font-medium">Lives: <span className="text-red-500 text-2xl font-bold">{lives}</span></div>
      </div>

            <div 
        ref={containerRef}
        className="flex-grow w-full max-w-4xl rounded-2xl relative overflow-hidden shadow-2xl border border-slate-700/50 bg-gradient-to-b from-[#0a192f] via-[#112240] to-[#020c1b]"
      >
        {/* Mystical Forest Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
           {/* Fog/Mist */}
           <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-emerald-900/40 to-transparent"></div>
           <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px]"></div>
           <div className="absolute top-40 right-20 w-48 h-48 bg-fuchsia-500/10 rounded-full blur-[60px]"></div>
           {/* Trees silhouettes */}
           <svg className="absolute bottom-0 w-full h-full opacity-20" preserveAspectRatio="xMidYMax slice" viewBox="0 0 100 100">
              <path d="M10,100 L12,40 L15,100 Z" fill="#020c1b" />
              <path d="M30,100 L35,20 L38,100 Z" fill="#0f172a" />
              <path d="M70,100 L73,30 L78,100 Z" fill="#020c1b" />
              <path d="M90,100 L91,50 L94,100 Z" fill="#0f172a" />
           </svg>
        </div>

        {status === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 backdrop-blur-sm">
            <h3 className="text-5xl font-bold text-white mb-2 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]">Spirit Catch</h3>
            <p className="text-slate-300 max-w-md text-center mb-6">Type the words inside the mystical spirits to catch them before they float away! Make a mistake, and your input resets.</p>
            <button onClick={startGame} className="px-8 py-3 bg-emerald-600 text-white rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              Enter Forest
            </button>
          </div>
        )}

        {status === 'finished' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 backdrop-blur-md">
            <h3 className="text-4xl font-bold text-emerald-400 mb-2 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">Time's Up!</h3>
            <p className="text-slate-300 mb-8">You caught {score} spirits.</p>
            <button onClick={startGame} className="px-8 py-3 bg-emerald-600 text-white rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              Play Again
            </button>
          </div>
        )}

        {/* Spirits */}
        {bubbles.map(bubble => {
          const isTargeted = userInput.length > 0 && bubble.word.startsWith(userInput);
          return (
            <div 
              key={bubble.id}
              className={`absolute top-0 left-0 flex flex-col items-center justify-center rounded-full border transition-transform duration-300 z-10 will-change-transform ${bubble.colorClass} ${isTargeted ? 'scale-125 border-white drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] z-20 animate-pulse' : 'opacity-90'}`}
              style={{ 
                transform: `translate3d(${bubble.x}px, ${bubble.y}px, 0)`,
                width: bubble.size,
                height: bubble.size,
                fontFamily: settings.language === 'hindi' ? (settings.hindiFont === 'krutidev' ? "'Kruti Dev 010', 'Kruti Dev', sans-serif" : "'Mangal', sans-serif") : (settings.fontFamily || 'font-fira')
              }}
            >
              <div className="absolute inset-0 rounded-full bg-white/10 pointer-events-none"></div>
              <div className="font-bold text-lg relative z-10 text-center px-2 word-break">
                {isTargeted ? (
                  <>
                    <span className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,1)]">{userInput}</span>
                    <span className="opacity-60">{bubble.word.slice(userInput.length)}</span>
                  </>
                ) : (
                  bubble.word
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Typing Input */}
      <div className="w-full max-w-4xl mt-4 z-20">
        <input ref={inputRef} 
          type="text" autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} data-gramm="false"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-emerald-400 px-6 py-4 rounded-2xl text-xl font-bold focus:outline-none focus:border-emerald-500 shadow-xl text-center"
          placeholder="Type to catch the spirits..."
        />
      </div>
    </div>
  );
}
