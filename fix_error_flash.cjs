const fs = require('fs');
let code = fs.readFileSync('src/components/LessonPractice.tsx', 'utf8');

// 1. Add state
code = code.replace(
  /const \[errorCount, setErrorCount\] = useState\(0\);/,
  "const [errorCount, setErrorCount] = useState(0);\n  const [isErrorFlash, setIsErrorFlash] = useState(false);"
);

// 2. Update else block in handleInputChange
code = code.replace(
  /\} else \{\n\s*setErrorCount\(prev => prev \+ 1\);\n\s*if \(soundEnabled\) playErrorSound\(\);\n\s*\}/,
  `} else {
      setErrorCount(prev => prev + 1);
      if (soundEnabled) playErrorSound();
      setIsErrorFlash(true);
      setTimeout(() => setIsErrorFlash(false), 200);
    }`
);

// 3. Update renderText
code = code.replace(
  /let colorClass = 'text-slate-400 dark:text-slate-500';[\s\S]*?const pulseClass = isActive \? 'animate-pulse rounded-sm' : '';/,
  `let colorClass = 'text-slate-400 dark:text-slate-500';
      if (isTyped) {
        colorClass = 'text-green-500 dark:text-green-400';
      } else if (isActive) {
        if (isErrorFlash) {
          colorClass = 'text-red-600 dark:text-red-300 bg-red-500/30';
        } else {
          colorClass = themeColor === 'blue'
            ? 'text-blue-600 dark:text-blue-300 bg-blue-500/30'
            : themeColor === 'emerald'
            ? 'text-emerald-600 dark:text-emerald-300 bg-emerald-500/30'
            : 'text-amber-600 dark:text-amber-300 bg-amber-500/30';
        }
      }
      
      let activeShadow = '';
      if (isActive) {
        if (isErrorFlash) {
          activeShadow = 'shadow-[0_2px_0_0_#ef4444]';
        } else {
          activeShadow = themeColor === 'blue' ? 'shadow-[0_2px_0_0_#3b82f6]' : themeColor === 'emerald' ? 'shadow-[0_2px_0_0_#10b981]' : 'shadow-[0_2px_0_0_#f59e0b]';
        }
      }
        
      const pulseClass = isActive ? (isErrorFlash ? 'rounded-sm' : 'animate-pulse rounded-sm') : '';`
);

fs.writeFileSync('src/components/LessonPractice.tsx', code);
