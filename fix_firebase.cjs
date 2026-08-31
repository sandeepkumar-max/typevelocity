const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

// replace the old patch
code = code.replace(
  /\/\/ Suppress Firestore offline warning in sandbox[\s\S]*?originalConsoleError\(\.\.\.args\);\n\};/,
  `// Suppress Firestore offline warning in sandbox
const originalConsoleError = console.error;
console.error = (...args) => {
  const msg = args.join(' ');
  if (msg.includes('Could not reach Cloud Firestore backend') || msg.includes('FirebaseError: [code=unavailable]')) {
    return;
  }
  originalConsoleError(...args);
};`
);

fs.writeFileSync('src/lib/firebase.ts', code);
