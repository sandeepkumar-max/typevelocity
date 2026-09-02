const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The problematic lines:
const problemStr = `      case 'home': \nreturn () => window.removeEventListener('popstate', handlePopState);\n  }, []);\n\n  return (`;
code = code.replace(problemStr, `      case 'home': return (`);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed mess.");
