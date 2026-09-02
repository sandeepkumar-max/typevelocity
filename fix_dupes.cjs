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
  
  // Clean up duplicate text replacements
  code = code.replace(/type="text" autoCapitalize="none" autoCorrect="off" autoComplete="off" spellCheck=\{false\}/g, 'type="text"');
  code = code.replace(/autoCapitalize="none" autoCorrect="off" autoComplete="off" spellCheck=\{false\}/g, '');
  code = code.replace(/type="text"(\s*)type="text"/g, 'type="text"');
  
  fs.writeFileSync(file, code);
});
console.log("Cleaned up duplicates!");
