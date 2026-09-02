const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<button onClick=\{\(\) => setCurrentView\('practice'\)\}([^>]+)>Start Typing<\/button>/,
  '<a href="/practice" onClick={(e) => { e.preventDefault(); setCurrentView(\'practice\'); }}$1>Start Typing</a>'
);
code = code.replace(
  /<button onClick=\{\(\) => setCurrentView\('guide'\)\}([^>]+)>Learn Typing Levels<\/button>/,
  '<a href="/guide" onClick={(e) => { e.preventDefault(); setCurrentView(\'guide\'); }}$1>Learn Typing Levels</a>'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed App Links');
