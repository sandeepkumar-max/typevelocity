import React, { useState, useEffect } from 'react';

// Keycap definition for a modern 65% mechanical keyboard
interface KeycapData {
  id: string;
  label: string;
  mobileLabel?: string;
  subLabel?: string;
  w: number; // grid width in relative units (1 = standard 1u, 1.5 = 1.5u, etc.)
  isAccent?: 'blue' | 'cyan' | 'slate' | 'space';
}

const KEYBOARD_ROWS: KeycapData[][] = [
  // Row 1: Esc, Numbers, Backspace, Delete
  [
    { id: 'Escape', label: 'ESC', mobileLabel: 'ESC', w: 1, isAccent: 'blue' },
    { id: '1', label: '1', subLabel: '!', w: 1 },
    { id: '2', label: '2', subLabel: '@', w: 1 },
    { id: '3', label: '3', subLabel: '#', w: 1 },
    { id: '4', label: '4', subLabel: '$', w: 1 },
    { id: '5', label: '5', subLabel: '%', w: 1 },
    { id: '6', label: '6', subLabel: '^', w: 1 },
    { id: '7', label: '7', subLabel: '&', w: 1 },
    { id: '8', label: '8', subLabel: '*', w: 1 },
    { id: '9', label: '9', subLabel: '(', w: 1 },
    { id: '0', label: '0', subLabel: ')', w: 1 },
    { id: '-', label: '-', subLabel: '_', w: 1 },
    { id: '=', label: '=', subLabel: '+', w: 1 },
    { id: 'Backspace', label: 'BKSP', mobileLabel: '⌫', w: 2, isAccent: 'slate' },
    { id: 'Delete', label: 'DEL', mobileLabel: 'DEL', w: 1, isAccent: 'cyan' },
  ],
  // Row 2: Tab, QWERTY, Backslash, Page Up
  [
    { id: 'Tab', label: 'TAB', mobileLabel: 'TAB', w: 1.5, isAccent: 'slate' },
    { id: 'q', label: 'Q', w: 1 },
    { id: 'w', label: 'W', w: 1 },
    { id: 'e', label: 'E', w: 1 },
    { id: 'r', label: 'R', w: 1 },
    { id: 't', label: 'T', w: 1, isAccent: 'blue' },
    { id: 'y', label: 'Y', w: 1 },
    { id: 'u', label: 'U', w: 1 },
    { id: 'i', label: 'I', w: 1 },
    { id: 'o', label: 'O', w: 1 },
    { id: 'p', label: 'P', w: 1 },
    { id: '[', label: '[', subLabel: '{', w: 1 },
    { id: ']', label: ']', subLabel: '}', w: 1 },
    { id: '\\', label: '\\', subLabel: '|', w: 1.5 },
    { id: 'PageUp', label: 'PGUP', mobileLabel: '▲', w: 1, isAccent: 'slate' },
  ],
  // Row 3: Caps, ASDF, Enter, Page Down
  [
    { id: 'CapsLock', label: 'CAPS', mobileLabel: 'CAP', w: 1.75, isAccent: 'slate' },
    { id: 'a', label: 'A', w: 1 },
    { id: 's', label: 'S', w: 1 },
    { id: 'd', label: 'D', w: 1 },
    { id: 'f', label: 'F', w: 1 },
    { id: 'g', label: 'G', w: 1 },
    { id: 'h', label: 'H', w: 1 },
    { id: 'j', label: 'J', w: 1 },
    { id: 'k', label: 'K', w: 1 },
    { id: 'l', label: 'L', w: 1 },
    { id: ';', label: ';', subLabel: ':', w: 1 },
    { id: "'", label: "'", subLabel: '"', w: 1 },
    { id: 'Enter', label: 'ENTER ↵', mobileLabel: '↵', w: 2.25, isAccent: 'blue' },
    { id: 'PageDown', label: 'PGDN', mobileLabel: '▼', w: 1, isAccent: 'slate' },
  ],
  // Row 4: Shift, ZXCV, Shift, Up, End
  [
    { id: 'Shift', label: 'SHIFT', mobileLabel: '⇧', w: 2.25, isAccent: 'slate' },
    { id: 'z', label: 'Z', w: 1 },
    { id: 'x', label: 'X', w: 1 },
    { id: 'c', label: 'C', w: 1 },
    { id: 'v', label: 'V', w: 1, isAccent: 'cyan' },
    { id: 'b', label: 'B', w: 1 },
    { id: 'n', label: 'N', w: 1 },
    { id: 'm', label: 'M', w: 1 },
    { id: ',', label: ',', subLabel: '<', w: 1 },
    { id: '.', label: '.', subLabel: '>', w: 1 },
    { id: '/', label: '/', subLabel: '?', w: 1 },
    { id: 'ShiftRight', label: 'SHIFT', mobileLabel: '⇧', w: 1.75, isAccent: 'slate' },
    { id: 'ArrowUp', label: '▲', w: 1, isAccent: 'cyan' },
    { id: 'End', label: 'END', mobileLabel: 'END', w: 1, isAccent: 'slate' },
  ],
  // Row 5: Ctrl, Win, Alt, Space, Alt, Fn, Left, Down, Right
  [
    { id: 'Control', label: 'CTRL', mobileLabel: 'CTR', w: 1.25, isAccent: 'slate' },
    { id: 'Meta', label: 'WIN', mobileLabel: 'WIN', w: 1.25, isAccent: 'slate' },
    { id: 'Alt', label: 'ALT', mobileLabel: 'ALT', w: 1.25, isAccent: 'slate' },
    { id: ' ', label: 'TYPEVELOCITY', mobileLabel: 'SPACE', w: 6.25, isAccent: 'space' },
    { id: 'AltGraph', label: 'ALT', mobileLabel: 'ALT', w: 1, isAccent: 'slate' },
    { id: 'Fn', label: 'FN', mobileLabel: 'FN', w: 1, isAccent: 'slate' },
    { id: 'ArrowLeft', label: '◄', w: 1, isAccent: 'cyan' },
    { id: 'ArrowDown', label: '▼', w: 1, isAccent: 'cyan' },
    { id: 'ArrowRight', label: '►', w: 1, isAccent: 'cyan' },
  ],
];

interface MechanicalKeyboardVisualProps {
  onKeyClick?: (key: string) => void;
}

export default function MechanicalKeyboardVisual({ onKeyClick }: MechanicalKeyboardVisualProps) {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set(['t', 'v']));
  const [lastPressed, setLastPressed] = useState<string>('T');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setActiveKeys((prev) => new Set(prev).add(key));
      setLastPressed(e.key.length === 1 ? e.key.toUpperCase() : e.key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Initial subtle breathing animation on T and V
    const timer = setTimeout(() => {
      setActiveKeys(new Set());
    }, 2500);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearTimeout(timer);
    };
  }, []);

  const handleKeyInteraction = (keyId: string, label: string) => {
    setActiveKeys((prev) => new Set(prev).add(keyId.toLowerCase()));
    setLastPressed(label);
    if (onKeyClick) onKeyClick(label);
    setTimeout(() => {
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(keyId.toLowerCase());
        return next;
      });
    }, 200);
  };

  return (
    <div className="relative w-full max-w-5xl lg:max-w-6xl mx-auto py-2 sm:py-4 px-1 sm:px-4 flex flex-col items-center select-none overflow-visible">
      
      {/* Ambient Blue and Cyan Underglow Aura */}
      <div className="absolute inset-x-4 sm:inset-x-12 top-8 sm:top-14 bottom-4 sm:bottom-8 bg-gradient-to-r from-blue-500/20 via-cyan-400/30 to-blue-600/20 blur-3xl -z-10 rounded-[48px] pointer-events-none transform scale-95" />

      {/* 3D Perspective Stage Container */}
      <div 
        className="w-full transition-transform duration-500 ease-out"
        style={{
          perspective: '1400px',
        }}
      >
        <div 
          className="relative mx-auto rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 md:p-5 lg:p-6 transition-all duration-500"
          style={{
            transform: 'rotateX(11deg) rotateY(-0.5deg)',
            transformStyle: 'preserve-3d',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 40%, #EDF2F7 100%)',
            boxShadow: `
              0 32px 70px -15px rgba(15, 23, 42, 0.14),
              0 20px 40px -18px rgba(0, 102, 255, 0.22),
              0 2px 0 1px #FFFFFF inset,
              0 0 0 1px rgba(226, 232, 240, 0.9),
              0 16px 0 0 #CBD5E1,
              0 18px 24px 0 rgba(0,0,0,0.08)
            `,
          }}
        >
          {/* Top Chassis Bevel Header with Status LEDs and Brand Mark */}
          <div className="flex items-center justify-between px-2 sm:px-3 pb-2 sm:pb-3 mb-1.5 sm:mb-2 border-b border-slate-200/90 text-[10px] sm:text-xs font-mono tracking-wider text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34D399] animate-pulse" />
              <span className="font-bold text-slate-600 dark:text-slate-700 uppercase tracking-widest text-[10px] sm:text-xs">
                TypeVelocity 65% Pro
              </span>
              <span className="hidden md:inline-block text-slate-300">•</span>
              <span className="hidden md:inline-block text-slate-400">Custom Linear Switches</span>
            </div>
            
            <div className="flex items-center gap-2.5 sm:gap-4">
              <div className="flex items-center gap-1.5 text-blue-600 font-bold bg-blue-50/90 px-3 py-0.5 sm:py-1 rounded-full border border-blue-200/80 shadow-xs">
                <span className="text-[10px] uppercase font-sans text-blue-500">Live Key:</span>
                <span className="text-xs sm:text-sm font-mono font-black">{lastPressed}</span>
              </div>
              <span className="hidden sm:inline-block text-slate-400 text-[11px]">1000Hz Ultra Polling</span>
            </div>
          </div>

          {/* Keycaps Matrix Bed */}
          <div className="relative rounded-xl sm:rounded-2xl bg-slate-100/95 p-1.5 sm:p-2.5 md:p-3 border border-slate-200/90 shadow-inner flex flex-col gap-1 sm:gap-1.5 md:gap-2">
            {KEYBOARD_ROWS.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-0.5 sm:gap-1.5 md:gap-2 w-full">
                {row.map((key) => {
                  const isPressed = activeKeys.has(key.id.toLowerCase());
                  
                  // Base styling according to key accent role
                  let keyBg = 'bg-white text-slate-800 hover:bg-slate-50';
                  let keyShadow = 'shadow-[0_4px_0_0_#CBD5E1,0_6px_12px_rgba(0,0,0,0.06)]';
                  let borderStyle = 'border border-slate-200';
                  let textColor = 'text-slate-800';

                  if (key.isAccent === 'blue') {
                    keyBg = 'bg-gradient-to-b from-blue-500 to-blue-600 text-white hover:from-blue-400 hover:to-blue-500';
                    keyShadow = 'shadow-[0_4px_0_0_#1D4ED8,0_6px_16px_rgba(37,99,235,0.38)]';
                    borderStyle = 'border border-blue-400/60';
                    textColor = 'text-white font-black';
                  } else if (key.isAccent === 'cyan') {
                    keyBg = 'bg-gradient-to-b from-cyan-400 to-sky-500 text-white hover:from-cyan-300 hover:to-sky-400';
                    keyShadow = 'shadow-[0_4px_0_0_#0284C7,0_6px_14px_rgba(6,182,212,0.35)]';
                    borderStyle = 'border border-cyan-300/70';
                    textColor = 'text-white font-black';
                  } else if (key.isAccent === 'slate') {
                    keyBg = 'bg-slate-50 text-slate-700 hover:bg-slate-100';
                    keyShadow = 'shadow-[0_4px_0_0_#94A3B8,0_5px_8px_rgba(0,0,0,0.05)]';
                    borderStyle = 'border border-slate-300';
                    textColor = 'text-slate-700 font-bold';
                  } else if (key.isAccent === 'space') {
                    keyBg = 'bg-white text-slate-700 hover:bg-slate-50';
                    keyShadow = 'shadow-[0_4px_0_0_#CBD5E1,0_7px_14px_rgba(0,0,0,0.08)]';
                    borderStyle = 'border border-slate-200';
                    textColor = 'text-blue-600 font-black';
                  }

                  if (isPressed) {
                    keyShadow = 'shadow-[0_1px_0_0_#94A3B8] translate-y-1';
                    if (key.isAccent === 'blue') keyShadow = 'shadow-[0_1px_0_0_#1E40AF] translate-y-1';
                  }

                  return (
                    <button
                      key={key.id}
                      type="button"
                      onClick={() => handleKeyInteraction(key.id, key.label)}
                      style={{ flex: `${key.w} 0 0%` }}
                      className={`
                        group relative flex flex-col items-center justify-center 
                        h-8 sm:h-11 md:h-13 lg:h-14 xl:h-15 rounded-md sm:rounded-xl 
                        transition-all duration-75 cursor-pointer 
                        ${keyBg} ${keyShadow} ${borderStyle} ${textColor}
                      `}
                    >
                      {/* Chamfered Keycap Top highlight */}
                      <div className="absolute inset-x-1 top-0.5 h-0.5 rounded-full bg-white/50 pointer-events-none" />

                      {/* Spacebar subtle LED indicator line */}
                      {key.isAccent === 'space' && (
                        <div className="w-14 sm:w-28 md:w-36 lg:w-44 h-1 sm:h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3B82F6] mb-0.5" />
                      )}

                      {/* Key Legend Labels */}
                      <div className="flex flex-col items-center justify-center leading-tight">
                        {key.subLabel && (
                          <span className="text-[7px] sm:text-[9px] md:text-[10px] opacity-60 font-mono mb-0.5 hidden sm:inline">
                            {key.subLabel}
                          </span>
                        )}
                        <span className={`
                          text-[9px] sm:text-xs md:text-sm lg:text-base font-bold tracking-tight
                          ${key.isAccent === 'space' ? 'text-[8px] sm:text-xs md:text-sm tracking-widest text-slate-400 group-hover:text-blue-600 font-mono' : ''}
                        `}>
                          <span className="sm:hidden">{key.mobileLabel || key.label}</span>
                          <span className="hidden sm:inline">{key.label}</span>
                        </span>
                      </div>

                      {/* Active Key Press Glow Pulse */}
                      {isPressed && (
                        <span className="absolute inset-0 rounded-md sm:rounded-xl bg-blue-400/25 pointer-events-none animate-ping opacity-75" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Keyboard Bottom Rim with subtle rubber feet accents and metallic chamfer */}
          <div className="mt-2.5 sm:mt-3 flex items-center justify-between px-2 text-[10px] sm:text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Gasket Mount Architecture</span>
            </div>
            <span className="hidden sm:inline italic opacity-80">Interactive Preview • Press any physical key to type</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>RGB Flow Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
