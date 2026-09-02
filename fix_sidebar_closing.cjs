const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

let lines = code.split('\n');
for (let i=0; i<lines.length; i++) {
    if (lines[i].includes('Type<span') && lines[i+2].includes('</div>')) {
        lines[i+2] = lines[i+2].replace('</div>', '</a>');
    }
}
fs.writeFileSync('src/components/Sidebar.tsx', lines.join('\n'));
console.log('Fixed closing tags in Sidebar');
