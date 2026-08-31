const fs = require('fs');
let code = fs.readFileSync('src/components/MeteorDrop.tsx', 'utf8');

// Fix moving blur
code = code.replace(/bg-black\/60 backdrop-blur-md/g, 'bg-black/80');

fs.writeFileSync('src/components/MeteorDrop.tsx', code);
