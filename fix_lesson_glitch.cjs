const fs = require('fs');
let code = fs.readFileSync('src/components/LessonPractice.tsx', 'utf8');

const replacement = `  const renderText = () => {
    return targetText.split('').map((char, index) => {
      const isActive = index === userInput.length;
      const isTyped = index < userInput.length;
      
      let colorClass = 'text-slate-400 dark:text-slate-500';
      if (isTyped) {
        colorClass = 'text-green-500 dark:text-green-400';
      } else if (isActive) {
        colorClass = themeColor === 'blue'
          ? 'text-blue-600 dark:text-blue-300 bg-blue-500/30'
          : themeColor === 'emerald'
          ? 'text-emerald-600 dark:text-emerald-300 bg-emerald-500/30'
          : 'text-amber-600 dark:text-amber-300 bg-amber-500/30';
      }
      
      // For the active character, we add an underline using box-shadow so it doesn't affect layout
      const activeShadow = isActive 
        ? (themeColor === 'blue' ? 'shadow-[0_2px_0_0_#3b82f6]' : themeColor === 'emerald' ? 'shadow-[0_2px_0_0_#10b981]' : 'shadow-[0_2px_0_0_#f59e0b]')
        : '';
        
      const pulseClass = isActive ? 'animate-pulse rounded-sm' : '';

      return (
        <span 
          key={index} 
          className={\`font-medium transition-colors \${colorClass} \${activeShadow} \${pulseClass}\`}
        >
          {char}
        </span>
      );
    });
  };`;

// Replace the existing renderText function
code = code.replace(/const renderText = \(\) => \{[\s\S]*?return \([\s\S]*?\}\);\s*\};\s*return \(/, replacement + '\n\n  return (');

fs.writeFileSync('src/components/LessonPractice.tsx', code);
