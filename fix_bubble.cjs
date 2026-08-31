const fs = require('fs');
let code = fs.readFileSync('src/components/BubbleShoot.tsx', 'utf8');
code = code.replace(/      <\/div>\s*\);\s*\}\s*$/, '      </div>\n    </div>\n  );\n}\n');
fs.writeFileSync('src/components/BubbleShoot.tsx', code);
