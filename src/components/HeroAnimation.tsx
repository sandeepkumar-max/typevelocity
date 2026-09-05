import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, RotateCcw, Flame, Target, Play, Pause, Keyboard, X, Maximize2, Minimize2 } from 'lucide-react';

// Stream word pool with fast-flowing rhythm words
const WORD_POOL = [
  "it", "take", "the", "word", "those", "sand", "wetly", "flame", "swift", "pace",
  "rocket", "velocity", "focus", "flow", "hyper", "neon", "glide", "pulse", "cyber",
  "rhythm", "laser", "drift", "spark", "boost", "sprint", "strike", "ninja", "storm",
  "quick", "blaze", "orbit", "audio", "touch", "light", "shift", "power", "alpha",
  "delta", "prime", "nexus", "cloud", "track", "sound", "vivid", "dream", "flash"
];

function getRandomWords(count: number = 30): string[] {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)]);
  }
  return result;
}

// Finger definitions for standard touch typing
type FingerId = 'lp' | 'lr' | 'lm' | 'li' | 'lt' | 'rt' | 'ri' | 'rm' | 'rr' | 'rp';

interface KeyConfig {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  hand: 'left' | 'right';
  finger: FingerId;
}

// 5 rows of keyboard mapped to touch typing coordinates
const KEYBOARD_KEYS: KeyConfig[] = [
  // Row 0 - Numbers (y = 175)
  { id: '`', label: '~', x: 70, y: 175, w: 46, h: 36, hand: 'left', finger: 'lp' },
  { id: '1', label: '1', x: 122, y: 175, w: 46, h: 36, hand: 'left', finger: 'lp' },
  { id: '2', label: '2', x: 174, y: 175, w: 46, h: 36, hand: 'left', finger: 'lr' },
  { id: '3', label: '3', x: 226, y: 175, w: 46, h: 36, hand: 'left', finger: 'lm' },
  { id: '4', label: '4', x: 278, y: 175, w: 46, h: 36, hand: 'left', finger: 'li' },
  { id: '5', label: '5', x: 330, y: 175, w: 46, h: 36, hand: 'left', finger: 'li' },
  { id: '6', label: '6', x: 382, y: 175, w: 46, h: 36, hand: 'right', finger: 'ri' },
  { id: '7', label: '7', x: 434, y: 175, w: 46, h: 36, hand: 'right', finger: 'ri' },
  { id: '8', label: '8', x: 486, y: 175, w: 46, h: 36, hand: 'right', finger: 'rm' },
  { id: '9', label: '9', x: 538, y: 175, w: 46, h: 36, hand: 'right', finger: 'rr' },
  { id: '0', label: '0', x: 590, y: 175, w: 46, h: 36, hand: 'right', finger: 'rp' },
  { id: '-', label: '-', x: 642, y: 175, w: 46, h: 36, hand: 'right', finger: 'rp' },
  { id: '=', label: '=', x: 694, y: 175, w: 46, h: 36, hand: 'right', finger: 'rp' },
  { id: 'BACKSPACE', label: 'Bksp', x: 746, y: 175, w: 104, h: 36, hand: 'right', finger: 'rp' },

  // Row 1 - QWERTY (y = 217)
  { id: 'TAB', label: 'Tab', x: 70, y: 217, w: 68, h: 36, hand: 'left', finger: 'lp' },
  { id: 'Q', label: 'Q', x: 144, y: 217, w: 46, h: 36, hand: 'left', finger: 'lp' },
  { id: 'W', label: 'W', x: 196, y: 217, w: 46, h: 36, hand: 'left', finger: 'lr' },
  { id: 'E', label: 'E', x: 248, y: 217, w: 46, h: 36, hand: 'left', finger: 'lm' },
  { id: 'R', label: 'R', x: 300, y: 217, w: 46, h: 36, hand: 'left', finger: 'li' },
  { id: 'T', label: 'T', x: 352, y: 217, w: 46, h: 36, hand: 'left', finger: 'li' },
  { id: 'Y', label: 'Y', x: 404, y: 217, w: 46, h: 36, hand: 'right', finger: 'ri' },
  { id: 'U', label: 'U', x: 456, y: 217, w: 46, h: 36, hand: 'right', finger: 'ri' },
  { id: 'I', label: 'I', x: 508, y: 217, w: 46, h: 36, hand: 'right', finger: 'rm' },
  { id: 'O', label: 'O', x: 560, y: 217, w: 46, h: 36, hand: 'right', finger: 'rr' },
  { id: 'P', label: 'P', x: 612, y: 217, w: 46, h: 36, hand: 'right', finger: 'rp' },
  { id: '[', label: '[', x: 664, y: 217, w: 46, h: 36, hand: 'right', finger: 'rp' },
  { id: ']', label: ']', x: 716, y: 217, w: 46, h: 36, hand: 'right', finger: 'rp' },
  { id: '\\', label: '\\', x: 768, y: 217, w: 82, h: 36, hand: 'right', finger: 'rp' },

  // Row 2 - Home Row (y = 259)
  { id: 'CAPS', label: 'Caps', x: 70, y: 259, w: 78, h: 36, hand: 'left', finger: 'lp' },
  { id: 'A', label: 'A', x: 154, y: 259, w: 46, h: 36, hand: 'left', finger: 'lp' },
  { id: 'S', label: 'S', x: 206, y: 259, w: 46, h: 36, hand: 'left', finger: 'lr' },
  { id: 'D', label: 'D', x: 258, y: 259, w: 46, h: 36, hand: 'left', finger: 'lm' },
  { id: 'F', label: 'F', x: 310, y: 259, w: 46, h: 36, hand: 'left', finger: 'li' },
  { id: 'G', label: 'G', x: 362, y: 259, w: 46, h: 36, hand: 'left', finger: 'li' },
  { id: 'H', label: 'H', x: 414, y: 259, w: 46, h: 36, hand: 'right', finger: 'ri' },
  { id: 'J', label: 'J', x: 466, y: 259, w: 46, h: 36, hand: 'right', finger: 'ri' },
  { id: 'K', label: 'K', x: 518, y: 259, w: 46, h: 36, hand: 'right', finger: 'rm' },
  { id: 'L', label: 'L', x: 570, y: 259, w: 46, h: 36, hand: 'right', finger: 'rr' },
  { id: ';', label: ';', x: 622, y: 259, w: 46, h: 36, hand: 'right', finger: 'rp' },
  { id: "'", label: "'", x: 674, y: 259, w: 46, h: 36, hand: 'right', finger: 'rp' },
  { id: 'ENTER', label: 'Enter', x: 726, y: 259, w: 124, h: 36, hand: 'right', finger: 'rp' },

  // Row 3 - Bottom Row (y = 301)
  { id: 'SHIFT_L', label: 'Shift', x: 70, y: 301, w: 100, h: 36, hand: 'left', finger: 'lp' },
  { id: 'Z', label: 'Z', x: 176, y: 301, w: 46, h: 36, hand: 'left', finger: 'lp' },
  { id: 'X', label: 'X', x: 228, y: 301, w: 46, h: 36, hand: 'left', finger: 'lr' },
  { id: 'C', label: 'C', x: 280, y: 301, w: 46, h: 36, hand: 'left', finger: 'lm' },
  { id: 'V', label: 'V', x: 332, y: 301, w: 46, h: 36, hand: 'left', finger: 'li' },
  { id: 'B', label: 'B', x: 384, y: 301, w: 46, h: 36, hand: 'left', finger: 'li' },
  { id: 'N', label: 'N', x: 436, y: 301, w: 46, h: 36, hand: 'right', finger: 'ri' },
  { id: 'M', label: 'M', x: 488, y: 301, w: 46, h: 36, hand: 'right', finger: 'ri' },
  { id: ',', label: ',', x: 540, y: 301, w: 46, h: 36, hand: 'right', finger: 'rm' },
  { id: '.', label: '.', x: 592, y: 301, w: 46, h: 36, hand: 'right', finger: 'rr' },
  { id: '/', label: '/', x: 644, y: 301, w: 46, h: 36, hand: 'right', finger: 'rp' },
  { id: 'SHIFT_R', label: 'Shift', x: 696, y: 301, w: 154, h: 36, hand: 'right', finger: 'rp' },

  // Row 4 - Space & Control (y = 343)
  { id: 'CTRL_L', label: 'Ctrl', x: 70, y: 343, w: 60, h: 36, hand: 'left', finger: 'lp' },
  { id: 'ALT_L', label: 'Alt', x: 136, y: 343, w: 54, h: 36, hand: 'left', finger: 'lt' },
  { id: 'SPACE', label: 'SPACE', x: 196, y: 343, w: 430, h: 36, hand: 'left', finger: 'lt' },
  { id: 'ALT_R', label: 'Alt', x: 632, y: 343, w: 54, h: 36, hand: 'right', finger: 'rt' },
  { id: 'CTRL_R', label: 'Ctrl', x: 692, y: 343, w: 64, h: 36, hand: 'right', finger: 'rp' }
];

const KEY_MAP: Record<string, KeyConfig> = {};
KEYBOARD_KEYS.forEach(k => {
  KEY_MAP[k.id.toUpperCase()] = k;
});

// Sound engine for mechanical tactile audio
class MechanicalSoundEngine {
  private ctx: AudioContext | null = null;

  playClick(pitchMultiplier: number = 1.0) {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!this.ctx && AudioCtx) {
        this.ctx = new AudioCtx();
      }
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime((340 + Math.random() * 40) * pitchMultiplier, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.035);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);

      const bufferSize = Math.floor(this.ctx.sampleRate * 0.01);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);
      noise.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);
    } catch {
      // Audio safety
    }
  }

  playError() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Audio safety
    }
  }
}

const soundEngine = new MechanicalSoundEngine();

interface HeroAnimationProps {
  theme?: 'dark' | 'light';
  isCompact?: boolean;
  onClose?: () => void;
  onExpand?: () => void;
}

export default function HeroAnimation({ theme = 'dark', isCompact = false, onClose, onExpand }: HeroAnimationProps) {
  const isLight = theme === 'light';

  // Words state: continuous infinite queue
  const [wordList, setWordList] = useState<string[]>(() => getRandomWords(40));
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [charInWordIdx, setCharInWordIdx] = useState(0);

  // Performance telemetry
  const [wpm, setWpm] = useState(126);
  const [streak, setStreak] = useState(0);
  const [totalKeys, setTotalKeys] = useState(0);
  const [errors, setErrors] = useState(0);
  const [hasErrorOnCurrent, setHasErrorOnCurrent] = useState(false);

  // Settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);

  // Active key & finger animation state
  const [pressedKeyId, setPressedKeyId] = useState<string | null>(null);
  const [wrongKeyId, setWrongKeyId] = useState<string | null>(null);
  
  // Timing for WPM
  const startTimeRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  // Current target word & required character
  const currentWord = wordList[currentWordIdx] || "rocket";
  const isSpaceRequired = charInWordIdx >= currentWord.length;
  const targetChar = isSpaceRequired ? ' ' : currentWord[charInWordIdx] || ' ';
  const targetKeyId = isSpaceRequired ? 'SPACE' : targetChar.toUpperCase();

  // Determine which finger must strike target key
  const targetKeyConfig = KEY_MAP[targetKeyId] || KEY_MAP['SPACE'];
  const targetFinger: FingerId = targetKeyConfig?.finger || 'lt';
  const targetHand: 'left' | 'right' = targetKeyConfig?.hand || 'left';

  // Make sure word list doesn't deplete
  useEffect(() => {
    if (currentWordIdx >= wordList.length - 12) {
      setWordList(prev => [...prev, ...getRandomWords(25)]);
    }
  }, [currentWordIdx, wordList.length]);

  // Handle user typing action
  const handleTypedChar = useCallback((inputKey: string) => {
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    setTotalKeys(prev => prev + 1);

    // If space expected
    if (isSpaceRequired) {
      if (inputKey === ' ' || inputKey === 'SPACE') {
        if (soundEnabled) soundEngine.playClick(1.2);
        setPressedKeyId('SPACE');
        setTimeout(() => setPressedKeyId(null), 120);

        setCurrentWordIdx(prev => prev + 1);
        setCharInWordIdx(0);
        setHasErrorOnCurrent(false);
        setStreak(prev => prev + 1);

        const elapsedMins = (Date.now() - (startTimeRef.current || Date.now())) / 60000;
        if (elapsedMins > 0.02) {
          const calculated = Math.round(((totalKeys + 1) / 5) / elapsedMins);
          setWpm(Math.min(180, Math.max(45, calculated)));
        }
      } else {
        if (soundEnabled) soundEngine.playError();
        setErrors(prev => prev + 1);
        setStreak(0);
        setWrongKeyId(inputKey.toUpperCase());
        setTimeout(() => setWrongKeyId(null), 180);
      }
      return;
    }

    // Normal character expected
    const expectedChar = currentWord[charInWordIdx];
    if (inputKey.toLowerCase() === expectedChar.toLowerCase()) {
      if (soundEnabled) soundEngine.playClick(1.0);
      setPressedKeyId(inputKey.toUpperCase());
      setTimeout(() => setPressedKeyId(null), 120);

      setCharInWordIdx(prev => prev + 1);
      setHasErrorOnCurrent(false);
      setStreak(prev => prev + 1);

      const elapsedMins = (Date.now() - (startTimeRef.current || Date.now())) / 60000;
      if (elapsedMins > 0.02) {
        const calculated = Math.round(((totalKeys + 1) / 5) / elapsedMins);
        setWpm(Math.min(180, Math.max(45, calculated)));
      }
    } else {
      if (soundEnabled) soundEngine.playError();
      setErrors(prev => prev + 1);
      setHasErrorOnCurrent(true);
      setStreak(0);
      setWrongKeyId(inputKey.toUpperCase());
      setTimeout(() => setWrongKeyId(null), 180);
    }
  }, [isSpaceRequired, currentWord, charInWordIdx, soundEnabled, totalKeys]);

  // Auto focus on mount
  useEffect(() => {
    containerRef.current?.focus();
    hiddenInputRef.current?.focus();
  }, []);

  // Global & Container Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not intercept if user is typing in a real form input or textarea elsewhere on page
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') && target !== hiddenInputRef.current) {
        return;
      }

      if (e.ctrlKey || e.metaKey || e.altKey || e.key === 'Tab') return;

      if (e.key === 'Escape') {
        return;
      }

      if (autoPlay) {
        setAutoPlay(false);
      }

      if (e.key === ' ' || e.key.length === 1) {
        e.preventDefault();
        handleTypedChar(e.key === ' ' ? ' ' : e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        if (charInWordIdx > 0) {
          setCharInWordIdx(prev => prev - 1);
          setHasErrorOnCurrent(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTypedChar, autoPlay, charInWordIdx]);

  // Auto-play simulation loop (when autoPlay is ON)
  useEffect(() => {
    if (!autoPlay) return;

    const delay = Math.floor(Math.random() * 25) + 65; // ~125 WPM simulation pace
    const timer = setTimeout(() => {
      const nextChar = isSpaceRequired ? ' ' : currentWord[charInWordIdx];
      handleTypedChar(nextChar);
    }, delay);

    return () => clearTimeout(timer);
  }, [autoPlay, isSpaceRequired, currentWord, charInWordIdx, handleTypedChar]);

  // Reset function
  const handleReset = () => {
    setWordList(getRandomWords(40));
    setCurrentWordIdx(0);
    setCharInWordIdx(0);
    setWpm(126);
    setStreak(0);
    setTotalKeys(0);
    setErrors(0);
    setHasErrorOnCurrent(false);
    startTimeRef.current = null;
    hiddenInputRef.current?.focus();
  };

  const accuracy = totalKeys > 0 ? Math.max(0, Math.round(((totalKeys - errors) / totalKeys) * 100)) : 100;
  const activeKeyObj = KEY_MAP[pressedKeyId || targetKeyId] || KEY_MAP['SPACE'];

  const getFingerPosition = (finger: FingerId, defaultX: number, defaultY: number) => {
    const isThisFingerActive = (targetFinger === finger);
    if (isThisFingerActive && activeKeyObj) {
      return {
        x: activeKeyObj.x + activeKeyObj.w / 2,
        y: activeKeyObj.y + activeKeyObj.h / 2
      };
    }
    return { x: defaultX, y: defaultY };
  };

  // 10 Finger target points
  const lpTarget = getFingerPosition('lp', 177, 277);
  const lrTarget = getFingerPosition('lr', 229, 277);
  const lmTarget = getFingerPosition('lm', 281, 235);
  const liTarget = getFingerPosition('li', 333, 277);
  const ltTarget = getFingerPosition('lt', 345, 361);

  const rtTarget = getFingerPosition('rt', 475, 361);
  const riTarget = getFingerPosition('ri', 489, 277);
  const rmTarget = getFingerPosition('rm', 541, 277);
  const rrTarget = getFingerPosition('rr', 593, 277);
  const rpTarget = getFingerPosition('rp', 645, 277);

  // Dynamic Theme Colors
  const containerBg = isLight ? 'bg-white/95 text-slate-800 border-slate-200 shadow-xl' : 'bg-[#0B132B]/95 text-slate-100 border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.2)]';
  const streamBg = isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-[#030712] border-blue-500/20';
  const keyboardBg = isLight ? '#F1F5F9' : '#080F21';
  const keyboardBorder = isLight ? '#CBD5E1' : '#1E293B';
  const keyDefaultFill = isLight ? '#FFFFFF' : '#0F1A30';
  const keyDefaultStroke = isLight ? '#E2E8F0' : '#1E2C48';
  const keyDefaultText = isLight ? '#334155' : '#94A3B8';

  return (
    <div 
      ref={containerRef}
      onClick={() => hiddenInputRef.current?.focus()}
      className={`w-full ${isCompact ? 'max-w-xl' : 'max-w-6xl xl:max-w-7xl'} mx-auto select-none focus:outline-none transition-all duration-300`}
      tabIndex={0}
    >
      {/* Hidden input for mobile touch devices */}
      <input
        ref={hiddenInputRef}
        type="text"
        className="opacity-0 absolute pointer-events-none w-0 h-0"
        onChange={(e) => {
          const val = e.target.value;
          if (val.length > 0) {
            handleTypedChar(val[val.length - 1]);
            e.target.value = '';
          }
        }}
      />

      {/* Cyber/Theme Matched Arena Container */}
      <div className={`relative rounded-2xl md:rounded-3xl border ${isCompact ? 'p-2 sm:p-3' : 'p-3.5 sm:p-5 md:p-6 lg:p-7'} overflow-hidden backdrop-blur-xl ${containerBg}`}>
        
        {/* Ambient subtle glow */}
        <div className={`absolute -top-32 -left-32 w-80 h-80 rounded-full blur-[100px] pointer-events-none ${isLight ? 'bg-blue-400/10' : 'bg-blue-500/10'}`} />
        <div className={`absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-[100px] pointer-events-none ${isLight ? 'bg-indigo-400/10' : 'bg-indigo-600/10'}`} />

        {/* 1. TOP HUD BAR: SPEEDOMETER, ACCURACY, STREAK & CONTROLS */}
        <div className={`relative z-10 flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b ${isLight ? 'border-slate-200' : 'border-blue-900/40'}`}>
          
          {/* Speedometer Box */}
          <div className="flex items-center gap-3">
            <div className={`relative flex flex-col items-center justify-center px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-xl border-2 transition-colors ${
              isLight 
                ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-sm' 
                : 'bg-blue-950/50 border-blue-400 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.35)]'
            }`}>
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight leading-none">
                {wpm}
              </span>
              <span className={`text-[9px] sm:text-[10px] font-bold tracking-widest uppercase mt-0.5 ${isLight ? 'text-blue-500' : 'text-blue-400'}`}>
                WPM
              </span>
            </div>

            {/* Streak & Accuracy Badges */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono font-bold border ${
                  isLight 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300'
                }`}>
                  <Target className="w-3 h-3 text-emerald-500" />
                  {accuracy}%
                </span>
                {streak > 3 && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono font-bold border animate-pulse ${
                    isLight 
                      ? 'bg-amber-50 text-amber-700 border-amber-200' 
                      : 'bg-amber-950/60 border-amber-500/30 text-amber-300'
                  }`}>
                    <Flame className="w-3 h-3 text-amber-500" />
                    {streak}x
                  </span>
                )}
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mr-0.5" />
                <span>Follows keyboard input</span>
              </div>
            </div>
          </div>

          {/* Active Key / Finger Guidance Badge for wide desktop screens */}
          <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border font-mono text-xs transition-all bg-slate-100/80 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-slate-600 dark:text-slate-300">
              Target: <span className="font-bold text-amber-600 dark:text-amber-400 underline">{isSpaceRequired ? 'SPACE' : targetChar.toUpperCase()}</span>
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-slate-600 dark:text-slate-300">
              Finger: <span className="font-bold text-blue-600 dark:text-blue-400">{getFingerName(targetFinger)}</span>
            </span>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 ml-auto">
            {/* Auto Play Demo Switch */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setAutoPlay(!autoPlay);
              }}
              title={autoPlay ? "Switch to Manual Typing" : "Watch Auto Demo"}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg font-mono text-xs font-semibold transition-all flex items-center gap-1 border ${
                autoPlay
                  ? isLight ? 'bg-blue-100 text-blue-700 border-blue-400' : 'bg-blue-500/20 text-blue-300 border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                  : isLight ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {autoPlay ? <Pause className="w-3.5 h-3.5 text-blue-500" /> : <Play className="w-3.5 h-3.5 text-slate-400" />}
              <span className="hidden sm:inline">{autoPlay ? 'Pause' : 'Auto'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled(!soundEnabled);
              }}
              title="Toggle Mechanical Key Sounds"
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg font-mono text-xs font-semibold transition-all flex items-center gap-1 border ${
                soundEnabled
                  ? isLight ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-amber-500/20 text-amber-300 border-amber-400'
                  : isLight ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-500" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{soundEnabled ? 'Sound' : 'Mute'}</span>
            </button>

            {/* Reset */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              title="Reset Word Stream"
              className={`p-1.5 rounded-lg border transition-all ${
                isLight ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Expand / Modal Fullscreen option if provided */}
            {onExpand && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand();
                }}
                title="Expand Full View"
                className={`p-1.5 rounded-lg border transition-all ${
                  isLight ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Close button if inside floating overlay or modal */}
            {onClose && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                title="Close"
                className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 2. CENTER STREAMING CONVEYOR BELT */}
        <div className={`relative my-2.5 sm:my-4 rounded-xl border ${isCompact ? 'py-2 px-2 min-h-[58px]' : 'py-3.5 sm:py-4 px-3 min-h-[72px] sm:min-h-[85px]'} overflow-hidden flex items-center justify-center ${streamBg}`}>
          
          {/* Edge fade gradients (compact mode uses subtle narrow edges so no text is masked) */}
          <div className={`absolute top-0 bottom-0 left-0 ${isCompact ? 'w-3 sm:w-4' : 'w-10 sm:w-16'} pointer-events-none z-10 ${
            isLight ? 'bg-gradient-to-r from-slate-100 to-transparent' : 'bg-gradient-to-r from-[#030712] to-transparent'
          }`} />
          <div className={`absolute top-0 bottom-0 right-0 ${isCompact ? 'w-3 sm:w-4' : 'w-10 sm:w-16'} pointer-events-none z-10 ${
            isLight ? 'bg-gradient-to-l from-slate-100 to-transparent' : 'bg-gradient-to-l from-[#030712] to-transparent'
          }`} />

          {/* Centered Word Conveyor Track */}
          <div className={`relative flex items-center justify-center font-mono ${isCompact ? 'text-base sm:text-lg' : 'text-base sm:text-xl md:text-2xl'} tracking-wider w-full overflow-hidden`}>
            <div className={`flex items-center ${isCompact ? 'gap-2 sm:gap-3' : 'gap-3 sm:gap-5'} whitespace-nowrap transition-transform duration-100`}>
              
              {/* Past words (strictly limited so active word stays centered) */}
              {!isCompact && wordList.slice(Math.max(0, currentWordIdx - 2), currentWordIdx).map((w, idx) => (
                <span key={`past-${idx}`} className={`line-through opacity-30 font-medium ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>
                  {w}
                </span>
              ))}
              {isCompact && currentWordIdx > 0 && (
                <span className={`line-through opacity-25 font-medium text-xs truncate max-w-[60px] ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>
                  {wordList[currentWordIdx - 1]}
                </span>
              )}

              {/* CURRENT CENTER ACTIVE WORD (Guaranteed Center Visibility) */}
              <div className={`relative flex items-center ${isCompact ? 'px-2 py-0.5' : 'px-3 py-1'} rounded-xl border ${isCompact ? 'scale-100' : 'scale-105 sm:scale-110'} z-20 transition-all ${
                isLight 
                  ? 'bg-blue-50/90 border-blue-400 shadow-sm' 
                  : 'bg-blue-950/60 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
              }`}>
                {currentWord.split('').map((char, cIdx) => {
                  const isTyped = cIdx < charInWordIdx;
                  const isCurrent = cIdx === charInWordIdx;

                  let colorClass = isLight ? "text-slate-700" : "text-slate-200";
                  if (isTyped) {
                    colorClass = "text-emerald-500 dark:text-emerald-400 font-bold";
                  } else if (isCurrent) {
                    colorClass = hasErrorOnCurrent 
                      ? "text-rose-500 font-black animate-bounce" 
                      : (isLight ? "text-blue-600 font-black" : "text-white font-black drop-shadow-[0_0_8px_#ffffff]");
                  }

                  return (
                    <span key={`char-${cIdx}`} className={`relative inline-block transition-colors ${colorClass}`}>
                      {char}
                      {isCurrent && (
                        <span className="absolute -bottom-0.5 left-0 right-0 h-[2.5px] bg-amber-400 shadow-[0_0_8px_#facc15] rounded-full animate-pulse" />
                      )}
                    </span>
                  );
                })}

                {/* Clean unobtrusive space cursor - no bulky badge blocking the next word */}
                {isSpaceRequired && (
                  <span className="inline-block w-2 ml-1 h-4 sm:h-5 bg-amber-400/90 rounded-sm animate-pulse align-middle" title="Press SPACE" />
                )}
              </div>

              {/* Upcoming words - always visible without jump */}
              {wordList.slice(currentWordIdx + 1, currentWordIdx + (isCompact ? 2 : 5)).map((w, idx) => (
                <span key={`upcoming-${idx}`} className={`font-medium ${isCompact ? 'opacity-70 text-xs sm:text-sm' : 'opacity-60'} ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {w}
                </span>
              ))}

            </div>
          </div>
        </div>

        {/* 3. CYBERNETIC HANDS & KEYBOARD */}
        <div className={`relative w-full overflow-hidden rounded-xl border ${isCompact ? 'max-h-[145px] sm:max-h-[165px]' : 'max-h-[440px] sm:max-h-[500px] flex items-center justify-center'} ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#050B17] border-blue-950/80'
        }`}>
          
          <svg
            viewBox="0 145 920 395"
            className="w-full h-auto select-none"
            style={{ filter: isLight ? 'drop-shadow(0 4px 10px rgba(0,0,0,0.05))' : 'drop-shadow(0 10px 25px rgba(0,0,0,0.7))' }}
          >
            <defs>
              <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
                <feMerge>
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="redGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient id="palmGradLeft" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isLight ? '#3B82F6' : '#0891b2'} stopOpacity={isLight ? '0.15' : '0.3'} />
                <stop offset="100%" stopColor={isLight ? '#60A5FA' : '#0284c7'} stopOpacity="0.05" />
              </linearGradient>

              <linearGradient id="palmGradRight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isLight ? '#3B82F6' : '#0891b2'} stopOpacity={isLight ? '0.15' : '0.3'} />
                <stop offset="100%" stopColor={isLight ? '#60A5FA' : '#0284c7'} stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Keyboard Backplate */}
            <rect
              x="50"
              y="160"
              width="820"
              height="230"
              rx="16"
              fill={keyboardBg}
              stroke={keyboardBorder}
              strokeWidth="2"
            />

            {/* A. KEYBOARD KEYS */}
            <g id="keys">
              {KEYBOARD_KEYS.map((k) => {
                const isTarget = targetKeyId === k.id;
                const isPressed = pressedKeyId === k.id;
                const isWrong = wrongKeyId === k.id;

                let fill = keyDefaultFill;
                let stroke = keyDefaultStroke;
                let textColor = keyDefaultText;
                let filter: string | undefined = undefined;

                if (isWrong) {
                  fill = '#EF4444';
                  stroke = '#FCA5A5';
                  textColor = '#FFFFFF';
                  filter = 'url(#redGlow)';
                } else if (isPressed) {
                  fill = '#FACC15';
                  stroke = '#FEF08A';
                  textColor = '#000000';
                  filter = 'url(#goldGlow)';
                } else if (isTarget) {
                  fill = isLight ? '#DBEAFE' : '#1E3A8A';
                  stroke = isLight ? '#3B82F6' : '#60A5FA';
                  textColor = isLight ? '#1D4ED8' : '#FEF08A';
                }

                return (
                  <g
                    key={k.id}
                    onClick={() => handleTypedChar(k.id === 'SPACE' ? ' ' : k.id)}
                    className="cursor-pointer"
                  >
                    <rect
                      x={k.x}
                      y={(isPressed || isWrong) ? k.y + 2 : k.y}
                      width={k.w}
                      height={k.h}
                      rx="6"
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={isPressed || isTarget || isWrong ? '2' : '1'}
                      filter={filter}
                      className="transition-all duration-75"
                    />
                    <text
                      x={k.x + k.w / 2}
                      y={(isPressed || isWrong) ? k.y + k.h / 2 + 6 : k.y + k.h / 2 + 4}
                      textAnchor="middle"
                      fontSize={k.w > 60 ? '11' : '13'}
                      fontWeight={isPressed || isTarget ? 'bold' : '600'}
                      fontFamily="monospace"
                      fill={textColor}
                      className="transition-all duration-75"
                    >
                      {k.label}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* B. HOLOGRAPHIC PALMS */}
            <g id="left-palm" opacity={isLight ? '0.75' : '0.85'}>
              <path
                d="M 180 430 C 160 460, 190 530, 260 530 C 330 530, 360 480, 350 440 C 340 420, 280 410, 180 430 Z"
                fill="url(#palmGradLeft)"
                stroke={targetHand === 'left' ? '#3B82F6' : (isLight ? '#93C5FD' : '#0284C7')}
                strokeWidth="2"
                filter={isLight ? undefined : 'url(#cyanGlow)'}
              />
              <path
                d="M 200 455 Q 260 470 320 450"
                fill="none"
                stroke={isLight ? '#60A5FA' : '#38BDF8'}
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.6"
              />
              <circle cx="260" cy="480" r="14" fill="none" stroke={isLight ? '#60A5FA' : '#38BDF8'} strokeWidth="1.5" opacity="0.4" />
            </g>

            <g id="right-palm" opacity={isLight ? '0.75' : '0.85'}>
              <path
                d="M 740 430 C 760 460, 730 530, 660 530 C 590 530, 560 480, 570 440 C 580 420, 640 410, 740 430 Z"
                fill="url(#palmGradRight)"
                stroke={targetHand === 'right' ? '#3B82F6' : (isLight ? '#93C5FD' : '#0284C7')}
                strokeWidth="2"
                filter={isLight ? undefined : 'url(#cyanGlow)'}
              />
              <path
                d="M 720 455 Q 660 470 600 450"
                fill="none"
                stroke={isLight ? '#60A5FA' : '#38BDF8'}
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.6"
              />
              <circle cx="660" cy="480" r="14" fill="none" stroke={isLight ? '#60A5FA' : '#38BDF8'} strokeWidth="1.5" opacity="0.4" />
            </g>

            {/* C. 10 CYBERNETIC FINGERS */}
            {/* LEFT HAND */}
            <InteractiveFingerRay
              baseX={190} baseY={435} jointX={180} jointY={345} tipX={lpTarget.x} tipY={lpTarget.y}
              isActive={targetFinger === 'lp'} isPressed={pressedKeyId ? targetFinger === 'lp' : false} isLight={isLight}
            />
            <InteractiveFingerRay
              baseX={230} baseY={425} jointX={225} jointY={330} tipX={lrTarget.x} tipY={lrTarget.y}
              isActive={targetFinger === 'lr'} isPressed={pressedKeyId ? targetFinger === 'lr' : false} isLight={isLight}
            />
            <InteractiveFingerRay
              baseX={270} baseY={420} jointX={265} jointY={315} tipX={lmTarget.x} tipY={lmTarget.y}
              isActive={targetFinger === 'lm'} isPressed={pressedKeyId ? targetFinger === 'lm' : false} isLight={isLight}
            />
            <InteractiveFingerRay
              baseX={310} baseY={425} jointX={320} jointY={330} tipX={liTarget.x} tipY={liTarget.y}
              isActive={targetFinger === 'li'} isPressed={pressedKeyId ? targetFinger === 'li' : false} isLight={isLight}
            />
            <InteractiveFingerRay
              baseX={340} baseY={445} jointX={355} jointY={395} tipX={ltTarget.x} tipY={ltTarget.y}
              isActive={targetFinger === 'lt'} isPressed={pressedKeyId ? targetFinger === 'lt' : false} isThumb isLight={isLight}
            />

            {/* RIGHT HAND */}
            <InteractiveFingerRay
              baseX={580} baseY={445} jointX={565} jointY={395} tipX={rtTarget.x} tipY={rtTarget.y}
              isActive={targetFinger === 'rt'} isPressed={pressedKeyId ? targetFinger === 'rt' : false} isThumb isLight={isLight}
            />
            <InteractiveFingerRay
              baseX={610} baseY={425} jointX={600} jointY={330} tipX={riTarget.x} tipY={riTarget.y}
              isActive={targetFinger === 'ri'} isPressed={pressedKeyId ? targetFinger === 'ri' : false} isLight={isLight}
            />
            <InteractiveFingerRay
              baseX={650} baseY={420} jointX={655} jointY={315} tipX={rmTarget.x} tipY={rmTarget.y}
              isActive={targetFinger === 'rm'} isPressed={pressedKeyId ? targetFinger === 'rm' : false} isLight={isLight}
            />
            <InteractiveFingerRay
              baseX={690} baseY={425} jointX={695} jointY={330} tipX={rrTarget.x} tipY={rrTarget.y}
              isActive={targetFinger === 'rr'} isPressed={pressedKeyId ? targetFinger === 'rr' : false} isLight={isLight}
            />
            <InteractiveFingerRay
              baseX={730} baseY={435} jointX={740} jointY={345} tipX={rpTarget.x} tipY={rpTarget.y}
              isActive={targetFinger === 'rp'} isPressed={pressedKeyId ? targetFinger === 'rp' : false} isLight={isLight}
            />

          </svg>
        </div>

        {/* Bottom Guide */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between mt-2.5 px-1 text-[11px] sm:text-xs gap-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-semibold font-mono text-amber-500 dark:text-amber-300">
              Next Key: <span className="underline font-black">{isSpaceRequired ? 'SPACE' : targetChar.toUpperCase()}</span> ({getFingerName(targetFinger)})
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-slate-500 dark:text-slate-400">
            <Keyboard className="w-3.5 h-3.5 text-blue-500" />
            <span>Click or type to practice</span>
          </div>
        </div>

      </div>
    </div>
  );
}

interface InteractiveFingerRayProps {
  baseX: number;
  baseY: number;
  jointX: number;
  jointY: number;
  tipX: number;
  tipY: number;
  isActive: boolean;
  isPressed: boolean;
  isThumb?: boolean;
  isLight?: boolean;
}

function InteractiveFingerRay({
  baseX, baseY, jointX, jointY, tipX, tipY, isActive, isPressed, isThumb, isLight
}: InteractiveFingerRayProps) {
  const strokeColor = isActive ? '#FACC15' : (isLight ? 'rgba(59, 130, 246, 0.4)' : 'rgba(56, 189, 248, 0.35)');
  const coreColor = isActive ? '#FEF08A' : (isLight ? 'rgba(59, 130, 246, 0.15)' : 'rgba(56, 189, 248, 0.15)');
  const width = isThumb ? 18 : 14;

  return (
    <g className="transition-all duration-75">
      {isActive && (
        <path
          d={`M ${baseX} ${baseY} Q ${jointX} ${jointY} ${tipX} ${tipY}`}
          fill="none"
          stroke="#FACC15"
          strokeWidth={width + (isPressed ? 12 : 6)}
          strokeLinecap="round"
          filter="url(#goldGlow)"
          opacity={isPressed ? 1 : 0.8}
        />
      )}

      <path
        d={`M ${baseX} ${baseY} Q ${jointX} ${jointY} ${tipX} ${tipY}`}
        fill="none"
        stroke={strokeColor}
        strokeWidth={width}
        strokeLinecap="round"
        filter={isActive ? undefined : (isLight ? undefined : 'url(#cyanGlow)')}
      />

      <path
        d={`M ${baseX} ${baseY} Q ${jointX} ${jointY} ${tipX} ${tipY}`}
        fill="none"
        stroke={coreColor}
        strokeWidth={width / 2.5}
        strokeLinecap="round"
      />

      <circle
        cx={baseX}
        cy={baseY}
        r={isThumb ? 7 : 6}
        fill={isActive ? '#FACC15' : (isLight ? '#EFF6FF' : '#0B192E')}
        stroke={isActive ? '#FFFFFF' : (isLight ? '#3B82F6' : '#38BDF8')}
        strokeWidth="1.5"
      />

      <circle
        cx={jointX}
        cy={jointY}
        r={isThumb ? 6 : 5}
        fill={isActive ? '#FEF08A' : (isLight ? '#EFF6FF' : '#0B192E')}
        stroke={isActive ? '#FACC15' : (isLight ? '#3B82F6' : '#38BDF8')}
        strokeWidth="1.5"
      />

      <circle
        cx={tipX}
        cy={tipY}
        r={isThumb ? (isPressed ? 11 : 9) : (isPressed ? 9 : 7)}
        fill={isActive ? '#FEF08A' : (isLight ? '#3B82F6' : '#38BDF8')}
        stroke={isActive ? '#FFFFFF' : (isLight ? '#DBEAFE' : '#0B192E')}
        strokeWidth="2"
        filter={isActive ? 'url(#goldGlow)' : undefined}
      />
    </g>
  );
}

function getFingerName(id: FingerId): string {
  switch (id) {
    case 'lp': return 'Left Pinky';
    case 'lr': return 'Left Ring';
    case 'lm': return 'Left Middle';
    case 'li': return 'Left Index';
    case 'lt': return 'Left Thumb';
    case 'rt': return 'Right Thumb';
    case 'ri': return 'Right Index';
    case 'rm': return 'Right Middle';
    case 'rr': return 'Right Ring';
    case 'rp': return 'Right Pinky';
    default: return '';
  }
}
