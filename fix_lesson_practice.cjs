const fs = require('fs');
let code = fs.readFileSync('src/components/LessonPractice.tsx', 'utf8');

// Fix 1: Ensure space characters are visible (white-space: pre)
code = code.replace(
  /<span key=\{index\} className=\{`font-medium transition-colors \$\{colorClass\}`\}>/g,
  '<span key={index} className={`font-medium transition-colors whitespace-pre ${colorClass}`}>'
);

// We should also replace `{char}` with `{char}` because whitespace-pre will preserve the space naturally.

// Fix 2: Container styling - remove flex wrap on characters which breaks words weirdly, use block text.
code = code.replace(
  /flex items-center justify-center flex-wrap gap-y-4 shadow-xl/g,
  'flex items-center justify-center shadow-xl'
);
code = code.replace(
  /\{renderText\(\)\}/g,
  '<div className="w-full text-center whitespace-pre-wrap break-words">{renderText()}</div>'
);

fs.writeFileSync('src/components/LessonPractice.tsx', code);
