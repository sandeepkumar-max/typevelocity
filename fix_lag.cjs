const fs = require('fs');
let code = fs.readFileSync('src/components/BubbleShoot.tsx', 'utf8');

// Fix 1: Remove transition-all from moving bubble, use transition-transform.
// Fix 2: Remove backdrop-blur-sm and blur-md which cause heavy paint lag.
// Fix 3: Change how it animates when targeted (only scale and shadow, no transition-all).

code = code.replace(/transition-all duration-300/g, 'transition-transform duration-300');
code = code.replace(/opacity-90 backdrop-blur-sm/g, 'opacity-90');
code = code.replace(/<div className="absolute inset-0 rounded-full bg-white\/5 blur-md pointer-events-none"><\/div>/g, '<div className="absolute inset-0 rounded-full bg-white/10 pointer-events-none"></div>');

fs.writeFileSync('src/components/BubbleShoot.tsx', code);
