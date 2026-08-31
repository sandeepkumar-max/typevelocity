const fs = require('fs');
let code = fs.readFileSync('src/components/NeonSprint.tsx', 'utf8');

const newTrack = `{/* High-Quality Cyberpunk Track & Realistic Car */}
      <div className="w-full h-24 sm:h-32 relative mb-6 rounded-3xl overflow-hidden bg-slate-900 border border-slate-700/50 flex items-center shadow-2xl shadow-blue-900/20">
        
        {/* Deep background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-black"></div>
        
        {/* Grid lines moving backwards */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: \`linear-gradient(90deg, rgba(59,130,246,0.2) 1px, transparent 1px), linear-gradient(0deg, rgba(59,130,246,0.1) 1px, transparent 1px)\`,
            backgroundSize: '40px 40px',
            animation: status === 'running' && !isIdle ? \`moveBg \${Math.max(0.5, 3 - wpm/50)}s linear infinite\` : 'none'
          }}
        />

        {/* Neon racing lines (Top & Bottom) */}
        <div className="absolute top-4 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_15px_#3b82f6]"></div>
        <div className="absolute bottom-4 left-0 right-0 h-[2px] bg-fuchsia-500 shadow-[0_0_15px_#d946ef]"></div>

        {/* Realistic Sports Car */}
        <div 
          className="absolute transition-all duration-300 ease-out z-10 flex items-center justify-center"
          style={{ left: \`calc(\${progress}% - 30px)\` }}
        >
          <svg viewBox="0 0 100 35" className="w-24 sm:w-32 h-auto drop-shadow-[0_0_15px_rgba(59,130,246,0.8)] z-20 transition-all duration-300">
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
            {status === 'running' && !isIdle && (
              <>
                <polygon points="98,23 120,15 120,35 98,27" fill="rgba(253, 224, 71, 0.3)" filter="blur(2px)" />
                {/* Exhaust Glow */}
                <circle cx="2" cy="28" r="4" fill="#60a5fa" className="animate-pulse" filter="blur(2px)" />
                <circle cx="0" cy="28" r="2" fill="#fff" />
              </>
            )}
          </svg>
        </div>
        
        {/* Finish Line */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzIyMiIvPjxyZWN0IHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMyMjIiLz48cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] opacity-80 border-l-4 border-fuchsia-500 shadow-[-5px_0_15px_rgba(217,70,239,0.5)] z-0" />
      </div>`;

code = code.replace(/\{\/\* Clean Flat Track & Car \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*\{\/\* Finish Line \*\/\}[\s\S]*?<\/div>\s*<\/div>/, newTrack);
fs.writeFileSync('src/components/NeonSprint.tsx', code);
