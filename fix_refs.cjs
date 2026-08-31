const fs = require('fs');

// Fix BubbleShoot
let bubble = fs.readFileSync('src/components/BubbleShoot.tsx', 'utf8');
bubble = bubble.replace(/<input/, '<input ref={inputRef}');
fs.writeFileSync('src/components/BubbleShoot.tsx', bubble);

// Fix MeteorDrop
let meteor = fs.readFileSync('src/components/MeteorDrop.tsx', 'utf8');
if (!meteor.includes('const inputRef = useRef')) {
    meteor = meteor.replace(/const requestRef = useRef/, 'const inputRef = useRef<HTMLInputElement>(null);\n  const requestRef = useRef');
}
meteor = meteor.replace(/<input/, '<input ref={inputRef}');
meteor = meteor.replace(/const startGame = \(\) => \{/, 'const startGame = () => {\n    setTimeout(() => inputRef.current?.focus(), 100);');
fs.writeFileSync('src/components/MeteorDrop.tsx', meteor);
