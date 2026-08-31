const fs = require('fs');
let code = fs.readFileSync('src/components/LessonPractice.tsx', 'utf8');

// Enhance the active character styling
code = code.replace(
  /'text-blue-600 dark:text-blue-400 bg-blue-500\/20 px-0.5 rounded animate-pulse border-b-2 border-blue-500'/g,
  "'text-blue-600 dark:text-blue-400 bg-blue-500/20 px-1 py-0.5 rounded animate-pulse border-b-2 border-blue-500 shadow-sm shadow-blue-500/20 relative after:content-[\\'\\'] after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-0.5 after:bg-blue-500 after:animate-pulse'"
);
code = code.replace(
  /'text-emerald-600 dark:text-emerald-400 bg-emerald-500\/20 px-0.5 rounded animate-pulse border-b-2 border-emerald-500'/g,
  "'text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-1 py-0.5 rounded animate-pulse border-b-2 border-emerald-500 shadow-sm shadow-emerald-500/20 relative after:content-[\\'\\'] after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-0.5 after:bg-emerald-500 after:animate-pulse'"
);
code = code.replace(
  /'text-amber-600 dark:text-amber-400 bg-amber-500\/20 px-0.5 rounded animate-pulse border-b-2 border-amber-500'/g,
  "'text-amber-600 dark:text-amber-400 bg-amber-500/20 px-1 py-0.5 rounded animate-pulse border-b-2 border-amber-500 shadow-sm shadow-amber-500/20 relative after:content-[\\'\\'] after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-0.5 after:bg-amber-500 after:animate-pulse'"
);

// We should also replace the span's rendering if char === ' ' to show a little dot or just space so the padding makes it obvious.
// Actually just space is fine because the px-1 will stretch the background.
// But let's explicitly render a subtle space indicator if it's the current character and it's a space.
code = code.replace(
  /\{char\}/g,
  "{char === ' ' && index === userInput.length ? '␣' : char}"
);

fs.writeFileSync('src/components/LessonPractice.tsx', code);
