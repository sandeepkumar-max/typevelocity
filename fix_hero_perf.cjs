const fs = require('fs');
let code = fs.readFileSync('src/components/HeroAnimation.tsx', 'utf8');

// Disable heavy glow on mobile
code = code.replace(/className="absolute top-1\/2 left-1\/2 -translate-x-1\/2 -translate-y-1\/2 w-\[120%\] h-\[120%\] bg-blue-500\/20 blur-\[100px\] rounded-full -z-10 pointer-events-none" \/>/g, 
'className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/20 blur-[100px] rounded-full -z-10 pointer-events-none" />');

// Remove backdrop-blur on mobile, make solid background
code = code.replace(/bg-slate-800\/80 dark:bg-slate-900\/80 backdrop-blur-md/g, 
'bg-slate-800 dark:bg-slate-900 sm:bg-slate-800/80 sm:dark:bg-slate-900/80 sm:backdrop-blur-md');

// Reduce particle spawn rate on mobile by reading window size (we can do it inside useEffect)
code = code.replace(/const typeInterval = setInterval\(\(\) => \{/g, 
`const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    const typeInterval = setInterval(() => {
      if (isMobile && Math.random() > 0.5) return; // Skip half the frames on mobile`);

fs.writeFileSync('src/components/HeroAnimation.tsx', code);
