const fs = require('fs');
let code = fs.readFileSync('src/components/MeteorDrop.tsx', 'utf8');

const newLayout = `      <div 
        ref={containerRef}
        className="flex-grow w-full max-w-4xl rounded-2xl relative overflow-hidden flex flex-col justify-end shadow-2xl border border-slate-700/50 bg-gradient-to-b from-slate-900 via-indigo-950 to-[#050505]"
      >
        {/* Ninja Background Environment */}
        {/* Moon */}
        <div className="absolute top-8 right-12 w-24 h-24 rounded-full bg-slate-100 shadow-[0_0_60px_rgba(241,245,249,0.8)] opacity-90 z-0"></div>
        {/* Dark mountains / hills */}
        <svg preserveAspectRatio="none" viewBox="0 0 100 100" className="absolute bottom-0 w-full h-48 opacity-40 pointer-events-none z-0">
          <path d="M0,100 L0,50 Q20,30 40,60 T80,40 T100,60 L100,100 Z" fill="#0f172a" />
          <path d="M0,100 L0,70 Q25,40 50,70 T100,50 L100,100 Z" fill="#020617" />
        </svg>

        {status === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 backdrop-blur-sm">
            <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">Drop Ninja</h2>
            <p className="text-slate-300 mb-8 max-w-md text-center">Type the falling shuriken words and press Enter to deflect them before they hit the ground!</p>
            <button onClick={startGame} className="px-8 py-3 bg-red-600 text-white rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)]">
              Start Defense
            </button>
          </div>
        )}

        {status === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 backdrop-blur-md">
            <h2 className="text-4xl font-bold text-red-500 mb-2">Dojo Defeated</h2>
            <p className="text-slate-300 mb-6">Final Score: <span className="text-red-500 font-bold">{score}</span></p>
            <button onClick={startGame} className="px-8 py-3 bg-red-600 text-white rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)]">
              Play Again
            </button>
          </div>
        )}

        {/* Shurikens / Meteors */}
        {meteors.map(m => {
          const isTargeted = m.word.startsWith(input) && input.length > 0;
          return (
          <div 
            key={m.id}
            className="absolute flex flex-col items-center z-10"
            style={{ 
              left: m.x, 
              top: m.y
            }}
          >
            {/* Shuriken SVG */}
            <svg viewBox="0 0 100 100" className={\`w-12 h-12 mb-2 transition-all \${isTargeted ? 'animate-spin drop-shadow-[0_0_20px_rgba(239,68,68,1)] text-red-500' : 'animate-[spin_3s_linear_infinite] drop-shadow-[0_0_10px_rgba(148,163,184,0.5)] text-slate-300'}\`}>
               <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill="currentColor" />
               <circle cx="50" cy="50" r="12" fill="#020617" stroke="currentColor" strokeWidth="4" />
            </svg>
            
            <div className={\`px-3 py-1 rounded-md bg-black/60 backdrop-blur-md border \${isTargeted ? 'border-red-500/50' : 'border-white/10'} \${settings.language === 'hindi' ? '' : (settings.fontFamily || 'font-fira')} text-xl font-bold text-white shadow-lg\`}
              style={{
                fontFamily: settings.language === 'hindi' ? (settings.hindiFont === 'krutidev' ? "'Kruti Dev 010', 'Kruti Dev', sans-serif" : "'Mangal', sans-serif") : undefined
              }}
            >
              {isTargeted ? (
                <>
                  <span className="text-red-400">{input}</span>
                  <span className="opacity-80">{m.word.substring(input.length)}</span>
                </>
              ) : (
                <span className="opacity-80">{m.word}</span>
              )}
            </div>
          </div>
        )})}
      </div>`;

// We use regex to replace everything from <div ref={containerRef} ...> down to the end of the return statement.
code = code.replace(/<div \s*ref=\{containerRef\}[\s\S]*<\/div>\s*\)\s*;\s*\}\s*$/m, newLayout + '\n  );\n}');
fs.writeFileSync('src/components/MeteorDrop.tsx', code);
