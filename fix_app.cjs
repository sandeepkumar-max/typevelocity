const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /case 'lesson-practice': return <LessonPractice/g,
  "case 'lesson-practice': return <LessonPractice key={currentLessonId}"
);

fs.writeFileSync('src/App.tsx', code);
