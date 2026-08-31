const fs = require('fs');
let code = fs.readFileSync('src/components/MeteorDrop.tsx', 'utf8');

// 1. Add states
code = code.replace(
  /const \[score, setScore\] = useState\(0\);/,
  `const [score, setScore] = useState(0);\n  const [clearedItems, setClearedItems] = useState(0);\n  const [combo, setCombo] = useState(0);\n  const [maxCombo, setMaxCombo] = useState(0);`
);

// 2. Update resetGame (startGame in MeteorDrop)
code = code.replace(
  /setScore\(0\);\n\s*setLives\(3\);/,
  `setScore(0);\n    setClearedItems(0);\n    setCombo(0);\n    setMaxCombo(0);\n    setLives(3);`
);

// 3. Update getDifficultySettings
code = code.replace(/const getDifficultySettings = \(\) => \{[\s\S]*?default:[\s\S]*?\}\s*?\};\s*const spawnMeteor/m, 
`const getDifficultySettings = () => {
    switch (settings.difficulty) {
      case 'easy':
        return { baseSpeed: 0.3, speedMultiplier: 0.002, baseSpawn: 3500, spawnMultiplier: 5, minSpawn: 2000, scoreMult: 1 };
      case 'medium':
        return { baseSpeed: 0.6, speedMultiplier: 0.01, baseSpawn: 2500, spawnMultiplier: 15, minSpawn: 1200, scoreMult: 1.5 };
      case 'hard':
        return { baseSpeed: 1.0, speedMultiplier: 0.025, baseSpawn: 1800, spawnMultiplier: 25, minSpawn: 800, scoreMult: 2 };
      case 'developer':
        return { baseSpeed: 1.5, speedMultiplier: 0.05, baseSpawn: 1200, spawnMultiplier: 35, minSpawn: 500, scoreMult: 3 };
      default:
        return { baseSpeed: 0.6, speedMultiplier: 0.01, baseSpawn: 2500, spawnMultiplier: 15, minSpawn: 1200, scoreMult: 1.5 };
    }
  };

  const spawnMeteor`
);

// 4. Use clearedItems instead of score for difficulty
code = code.replace(/score \* diffSettings.spawnMultiplier/g, 'clearedItems * diffSettings.spawnMultiplier');
code = code.replace(/score \* diffSettings.speedMultiplier/g, 'clearedItems * diffSettings.speedMultiplier');

// 5. Update score calculation in handleInput
code = code.replace(
  /setMeteors\(prev => prev.filter\(\(_, idx\) => idx !== matchedIndex\)\);\n\s*setScore\(s => s \+ 10\);/,
  `const matchedWord = meteors[matchedIndex].word;
        const diffSettings = getDifficultySettings();
        const pts = Math.round((matchedWord.length * 10) * diffSettings.scoreMult * (1 + combo * 0.1));
        
        setMeteors(prev => prev.filter((_, idx) => idx !== matchedIndex));
        setScore(s => s + pts);
        setClearedItems(c => c + 1);
        setCombo(c => {
          const next = c + 1;
          setMaxCombo(m => Math.max(m, next));
          return next;
        });`
);

// 6. Reset combo on mistake
code = code.replace(
  /setErrorCount\(prev => prev \+ 1\);\n\s*if \(settings.soundEnabled\) playErrorSound\(\);/,
  `setErrorCount(prev => prev + 1);\n        setCombo(0);\n        if (settings.soundEnabled) playErrorSound();`
);

// 7. Display Combo in UI
code = code.replace(
  /<span className="text-3xl font-bold text-blue-600 dark:text-blue-400">\{score\}<\/span>/,
  `<span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {score}
            {combo > 1 && <span className="ml-3 text-orange-400 text-lg font-bold animate-pulse">Combo x{combo}!</span>}
          </span>`
);

// 8. Subtract lives -> reset combo
code = code.replace(
  /setLives\(l => Math.max\(0, l - hitBottom.length\)\);/,
  `setLives(l => Math.max(0, l - hitBottom.length));\n        setCombo(0);`
);

fs.writeFileSync('src/components/MeteorDrop.tsx', code);
