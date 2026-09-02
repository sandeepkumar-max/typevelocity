const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import { ErrorBoundary }')) {
  code = code.replace(
    "import HeroAnimation from './components/HeroAnimation';",
    "import HeroAnimation from './components/HeroAnimation';\nimport { ErrorBoundary } from './components/ErrorBoundary';"
  );
}

// Wrap the main content (renderContent()) in ErrorBoundary
code = code.replace(
  "{renderContent()}",
  "<ErrorBoundary>\n            {renderContent()}\n          </ErrorBoundary>"
);

fs.writeFileSync('src/App.tsx', code);
