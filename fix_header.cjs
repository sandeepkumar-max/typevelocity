const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace(
  '<div className="flex items-center cursor-pointer mr-6" onClick={() => onViewChange(\'home\')}>',
  '<a href="/" className="flex items-center cursor-pointer mr-6" onClick={(e) => { e.preventDefault(); onViewChange(\'home\'); }}>'
);
code = code.replace(
  '          <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">TypeVelocity</span>\n        </div>',
  '          <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">TypeVelocity</span>\n        </a>'
);

code = code.replace(
  '<button\n                  key={item.id}\n                  onClick={() => onViewChange(item.id as ViewState)}',
  '<a\n                  href={`/${item.id}`}\n                  key={item.id}\n                  onClick={(e) => { e.preventDefault(); onViewChange(item.id as ViewState); }}'
);
code = code.replace(
  '                  {item.label}\n                </button>',
  '                  {item.label}\n                </a>'
);

fs.writeFileSync('src/components/Header.tsx', code);
console.log('Fixed Header');
