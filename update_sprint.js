const fs = require('fs');
let code = fs.readFileSync('src/components/NeonSprint.tsx', 'utf8');

const carSvg = `
          <svg viewBox="0 0 100 35" className="w-24 h-auto drop-shadow-[0_0_15px_rgba(59,130,246,0.8)] z-20">
            <defs>
              <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
              <linearGradient id="window" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
            </defs>
            {/* Shadow */}
            <ellipse cx="50" cy="33" rx="45" ry="4" fill="rgba(0,0,0,0.5)" filter="blur(2px)" />
            {/* Chassis */}
            <path d="M 12,25 L 20,13 C 25,8 35,7 45,8 L 65,10 C 75,12 82,18 88,22 L 96,23 C 98,23 99,25 99,27 L 99,30 C 99,32 97,33 95,33 L 5,33 C 2,33 1,32 1,30 L 1,27 C 1,26 2,25 5,25 Z" fill="url(#carBody)" stroke="#60a5fa" strokeWidth="0.5" />
            {/* Windows */}
            <path d="M 35,9 L 45,9 C 55,9 62,11 68,14 L 62,15 C 55,13 45,12 35,12 L 25,12 Z" fill="url(#window)" opacity="0.9" />
            <path d="M 22,14 L 32,10 L 32,13 L 24,16 Z" fill="url(#window)" opacity="0.9" />
            {/* Wheels */}
            <circle cx="20" cy="28" r="6" fill="#111827" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="78" cy="28" r="6" fill="#111827" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Rims */}
            <circle cx="20" cy="28" r="3" fill="#cbd5e1" />
            <circle cx="78" cy="28" r="3" fill="#cbd5e1" />
            {/* Headlight */}
            <path d="M 90,24 L 98,24 L 98,26 L 90,26 Z" fill="#fef08a" className="animate-pulse" filter="blur(0.5px)" />
            <polygon points="98,23 120,15 120,35 98,27" fill="rgba(253, 224, 71, 0.3)" filter="blur(2px)" />
            {/* Exhaust Glow */}
            <circle cx="2" cy="28" r="4" fill="#60a5fa" className="animate-pulse" filter="blur(2px)" />
            <circle cx="0" cy="28" r="2" fill="#fff" />
          </svg>
`;

const opponentSvg = carSvg.replace(/3b82f6/g, 'ef4444').replace(/1e3a8a/g, '7f1d1d').replace(/60a5fa/g, 'f87171').replace(/rgba\(59,130,246,0.8\)/g, 'rgba(239,68,68,0.8)');

// Replace the car div
code = code.replace(/<div className="w-24 h-auto text-blue-500 relative flex items-center justify-end px-1">[\s\S]*?(?=<span className="absolute)/, carSvg);
// Oh wait, there are two cars. Opponent and player. Let's do a smarter replace.

fs.writeFileSync('update_sprint.js', 'done');
