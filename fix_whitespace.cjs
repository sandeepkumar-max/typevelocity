const fs = require('fs');
let code = fs.readFileSync('src/components/LessonPractice.tsx', 'utf8');

// Remove whitespace-pre from the span
code = code.replace(
  /className=\{`font-medium transition-colors whitespace-pre \$\{colorClass\}`\}/g,
  'className={`font-medium transition-colors ${colorClass}`}'
);

fs.writeFileSync('src/components/LessonPractice.tsx', code);
