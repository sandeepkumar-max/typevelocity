const fs = require('fs');
const files = [
  'src/components/BubbleShoot.tsx',
  'src/components/LessonPractice.tsx',
  'src/components/MeteorDrop.tsx',
  'src/components/NeonSprint.tsx',
  'src/components/PracticeArea.tsx'
];

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  
  // First, strip all our injected duplicates
  code = code.replace(/ autoCapitalize="none" autoCorrect="off" autoComplete="off" spellCheck=\{false\}/g, '');
  code = code.replace(/ autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" data-gramm="false"/g, '');
  
  // Strip individual old attributes to avoid conflicts
  code = code.replace(/\s+autoComplete="off"/g, '');
  code = code.replace(/\s+autoCorrect="off"/g, '');
  code = code.replace(/\s+autoCapitalize="off"/g, '');
  code = code.replace(/\s+autoCapitalize="none"/g, '');
  code = code.replace(/\s+spellCheck="false"/g, '');
  code = code.replace(/\s+spellCheck=\{false\}/g, '');
  code = code.replace(/\s+data-gramm="false"/g, '');

  // Add them back cleanly once to type="text"
  code = code.replace(/type="text"/g, 'type="text" autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} data-gramm="false"');
  
  fs.writeFileSync(file, code);
});
console.log("Made inputs perfect!");
