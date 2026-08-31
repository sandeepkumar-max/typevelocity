const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');
code = code.replace(/\\n/g, ''); // remove literal \n if exists at the end
fs.writeFileSync('src/lib/firebase.ts', code);
