const fs = require('fs');
let code = fs.readFileSync('src/components/BubbleShoot.tsx', 'utf8');

const newColors = `const BUBBLE_COLORS = [
  'border-emerald-400 bg-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]',
  'border-teal-400 bg-teal-500/20 text-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.4)]',
  'border-cyan-400 bg-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]',
  'border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-400 shadow-[0_0_20px_rgba(232,121,249,0.4)]',
  'border-indigo-400 bg-indigo-500/20 text-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.4)]',
];`;

code = code.replace(/const BUBBLE_COLORS = \[[^\]]+\];/, newColors);

const newLayout = `      <div 
        ref={containerRef}
        className="flex-grow w-full max-w-4xl rounded-2xl relative overflow-hidden shadow-2xl border border-slate-700/50 bg-gradient-to-b from-[#0a192f] via-[#112240] to-[#020c1b]"
      >
        {/* Mystical Forest Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
           {/* Fog/Mist */}
           <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-emerald-900/40 to-transparent"></div>
           <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px]"></div>
           <div className="absolute top-40 right-20 w-48 h-48 bg-fuchsia-500/10 rounded-full blur-[60px]"></div>
           {/* Trees silhouettes */}
           <svg className="absolute bottom-0 w-full h-full opacity-20" preserveAspectRatio="xMidYMax slice" viewBox="0 0 100 100">
              <path d="M10,100 L12,40 L15,100 Z" fill="#020c1b" />
              <path d="M30,100 L35,20 L38,100 Z" fill="#0f172a" />
              <path d="M70,100 L73,30 L78,100 Z" fill="#020c1b" />
              <path d="M90,100 L91,50 L94,100 Z" fill="#0f172a" />
           </svg>
        </div>

        {status === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 backdrop-blur-sm">
            <h3 className="text-5xl font-bold text-white mb-2 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]">Spirit Catch</h3>
            <p className="text-slate-300 max-w-md text-center mb-6">Type the words inside the mystical spirits to catch them before they float away! Make a mistake, and your input resets.</p>
            <button onClick={startGame} className="px-8 py-3 bg-emerald-600 text-white rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              Enter Forest
            </button>
          </div>
        )}

        {status === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 backdrop-blur-md">
            <h3 className="text-4xl font-bold text-emerald-400 mb-2 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">Time's Up!</h3>
            <p className="text-slate-300 mb-8">You caught {score} spirits.</p>
            <button onClick={startGame} className="px-8 py-3 bg-emerald-600 text-white rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              Play Again
            </button>
          </div>
        )}

        {/* Spirits */}
        {bubbles.map(bubble => {
          const isTargeted = userInput.length > 0 && bubble.word.startsWith(userInput);
          return (
            <div 
              key={bubble.id}
              className={\`absolute flex flex-col items-center justify-center rounded-full border transition-all duration-300 z-10 \${bubble.colorClass} \${isTargeted ? 'scale-125 border-white drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] z-20 animate-pulse' : 'opacity-90 backdrop-blur-sm'}\`}
              style={{ 
                left: bubble.x, 
                top: bubble.y,
                width: bubble.size,
                height: bubble.size,
                fontFamily: settings.language === 'hindi' ? (settings.hindiFont === 'krutidev' ? "'Kruti Dev 010', 'Kruti Dev', sans-serif" : "'Mangal', sans-serif") : (settings.fontFamily || 'font-fira')
              }}
            >
              <div className="absolute inset-0 rounded-full bg-white/5 blur-md pointer-events-none"></div>
              <div className="font-bold text-lg relative z-10 text-center px-2 word-break">
                {isTargeted ? (
                  <>
                    <span className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,1)]">{userInput}</span>
                    <span className="opacity-60">{bubble.word.slice(userInput.length)}</span>
                  </>
                ) : (
                  bubble.word
                )}
              </div>
            </div>
          );
        })}
      </div>`;

code = code.replace(/<div \s*ref=\{containerRef\}[\s\S]*<\/div>\s*\)\s*;\s*\}\s*$/m, newLayout + '\n  );\n}');
fs.writeFileSync('src/components/BubbleShoot.tsx', code);
