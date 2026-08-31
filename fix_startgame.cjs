const fs = require('fs');
let code = fs.readFileSync('src/components/BubbleShoot.tsx', 'utf8');
code = code.replace(/const resetGame = \(\) => \{/, `const startGame = () => {
    resetGame();
    setStatus('playing');
    setStartTime(Date.now());
  };

  const resetGame = () => {`);
fs.writeFileSync('src/components/BubbleShoot.tsx', code);
