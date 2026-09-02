const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

code = code.replace(
  '<div className="flex items-center cursor-pointer" onClick={() => { onViewChange(\'home\'); closeSidebar(); }}>',
  '<a href="/" className="flex items-center cursor-pointer" onClick={(e) => { e.preventDefault(); onViewChange(\'home\'); closeSidebar(); }}>'
);
code = code.replace(
  '            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">TypeVelocity</span>\n          </div>',
  '            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">TypeVelocity</span>\n          </a>'
);

code = code.replace(
  '<button\n              key={item.id}\n              onClick={() => { onViewChange(item.id as ViewState); closeSidebar(); }}',
  '<a\n              href={`/${item.id}`}\n              key={item.id}\n              onClick={(e) => { e.preventDefault(); onViewChange(item.id as ViewState); closeSidebar(); }}'
);
code = code.replace(
  '              {item.label}\n            </button>',
  '              {item.label}\n            </a>'
);

fs.writeFileSync('src/components/Sidebar.tsx', code);
console.log('Fixed Sidebar');
