import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const keyboardRows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

export default function HeroAnimation() {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [particles, setParticles] = useState<{id: number, char: string, x: number}[]>([]);
  let particleCounter = 0;

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    const typeInterval = setInterval(() => {
      if (isMobile && Math.random() > 0.5) return; // Skip half the frames on mobile
      // Randomly press 1-2 keys
      const numKeys = Math.random() > 0.5 ? 1 : 2;
      const newActive: string[] = [];
      const newParticles: {id: number, char: string, x: number}[] = [];
            
      for (let i = 0; i < numKeys; i++) {
        const rowIdx = Math.floor(Math.random() * keyboardRows.length);
        const colIdx = Math.floor(Math.random() * keyboardRows[rowIdx].length);
        const char = keyboardRows[rowIdx][colIdx];
        newActive.push(char);
                
        // Add particle
        particleCounter += 1;
        newParticles.push({
          id: particleCounter,
          char,
          x: (colIdx / keyboardRows[rowIdx].length) * 100 // approximate x position
        });
      }
            
      setActiveKeys(newActive);
      setParticles(prev => [...prev.slice(-15), ...newParticles]); // keep last 15 particles
            
      setTimeout(() => {
        setActiveKeys([]);
      }, 150);

    }, 300);

    return () => clearInterval(typeInterval);
  }, []);

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] flex items-center justify-center perspective-1000">
            
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        <AnimatePresence>
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 100, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], y: -200, scale: 1.5, rotate: Math.random() * 45 - 22.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute bottom-1/2 text-xl sm:text-2xl font-bold text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
              style={{ left: `${p.x}%` }}
            >
              {p.char}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 3D Keyboard Base */}
      <motion.div 
        initial={{ rotateX: 20, rotateY: -15, rotateZ: 5 }}
        animate={{ rotateX: [20, 25, 20], rotateY: [-15, -10, -15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative bg-slate-800 dark:bg-slate-900 sm:bg-slate-800/80 sm:dark:bg-slate-900/80 sm:backdrop-blur-md p-3 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 max-w-[95vw] sm:max-w-none"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-500/10 to-sky-500/10 pointer-events-none" />
                
        {/* Keyboard Keys */}
        <div className="flex flex-col gap-1 sm:gap-3">
          {keyboardRows.map((row, rIdx) => (
            <div key={rIdx} className={`flex gap-1 sm:gap-3 justify-center ${rIdx === 1 ? 'ml-1 sm:ml-4' : ''} ${rIdx === 2 ? 'ml-2 sm:ml-8' : ''}`}>
              {row.map(char => {
                const isActive = activeKeys.includes(char);
                return (
                  <motion.div
                    key={char}
                    animate={{
                      y: isActive ? 4 : 0,
                      scale: isActive ? 0.95 : 1,
                      backgroundColor: isActive ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255, 255, 255, 0.05)',
                      borderColor: isActive ? 'rgba(59, 130, 246, 0.8)' : 'rgba(255, 255, 255, 0.1)'
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className={`
                      w-6 h-6 sm:w-12 sm:h-12 rounded-md sm:rounded-xl border flex items-center justify-center text-[10px] sm:text-sm font-bold shadow-lg
                      ${isActive ? 'text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'text-slate-400 dark:text-slate-500'}
                      backdrop-blur-sm
                    `}
                  >
                    {char}
                  </motion.div>
                );
              })}
            </div>
          ))}
          {/* Spacebar */}
          <div className="flex gap-1 sm:gap-3 justify-center mt-1 sm:mt-2">
             <motion.div
                animate={{
                  y: activeKeys.length > 0 && Math.random() > 0.7 ? 4 : 0, // randomly press spacebar
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
                className="w-32 sm:w-64 h-6 sm:h-12 rounded-md sm:rounded-xl border flex items-center justify-center shadow-lg backdrop-blur-sm"
              />
          </div>
        </div>
      </motion.div>

      {/* Glow Effect underneath */}
      <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/20 blur-[100px] rounded-full -z-10 pointer-events-none" />
    </div>
  );
}
