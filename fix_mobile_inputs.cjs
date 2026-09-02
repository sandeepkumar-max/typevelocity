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
  // Look for type="text" inputs in the typing areas. We can add attributes safely.
  code = code.replace(/type="text"/g, 'type="text" autoCapitalize="none" autoCorrect="off" autoComplete="off" spellCheck={false}');
  fs.writeFileSync(file, code);
});
console.log("Inputs fixed!");
