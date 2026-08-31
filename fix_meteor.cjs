const fs = require('fs');
let code = fs.readFileSync('src/components/MeteorDrop.tsx', 'utf8');
code = code.replace(/      <\/div>\s*\);\s*\}\s*$/, '      </div>\n    </div>\n  );\n}\n');
fs.writeFileSync('src/components/MeteorDrop.tsx', code);
