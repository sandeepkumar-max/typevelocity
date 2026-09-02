const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf8');

code = code.replace(
  '<div className="flex items-center gap-2 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => onViewChange(\'home\')}>',
  '<a href="/" className="flex items-center gap-2 cursor-pointer hover:text-blue-500 transition-colors" onClick={(e) => { e.preventDefault(); onViewChange(\'home\'); }}>'
);
code = code.replace(
  '          <span className="font-semibold">TypeVelocity</span>\n        </div>',
  '          <span className="font-semibold">TypeVelocity</span>\n        </a>'
);

code = code.replace(
  /<button onClick=\{\(\) => onViewChange\('([^']+)'\)\} className="([^"]+)">([^<]+)<\/button>/g,
  '<a href="/$1" onClick={(e) => { e.preventDefault(); onViewChange(\'$1\'); }} className="$2">$3</a>'
);

fs.writeFileSync('src/components/Footer.tsx', code);
console.log('Fixed Footer');
