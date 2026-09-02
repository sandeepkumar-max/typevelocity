const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace(
  '          <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">TypeVelocity</span>\n        </div>',
  '          <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">TypeVelocity</span>\n        </a>'
);
// It looks like the span in the code was actually:
// <span className="...">Type<span className="...">Velocity</span></span>
// Let's just blindly replace the `</div>` that comes after `Type<span...` 

let lines = code.split('\n');
for (let i=0; i<lines.length; i++) {
    if (lines[i].includes('Type<span') && lines[i+2].includes('</div>')) {
        lines[i+2] = lines[i+2].replace('</div>', '</a>');
    }
}
fs.writeFileSync('src/components/Header.tsx', lines.join('\n'));
console.log('Fixed closing tags in Header');
