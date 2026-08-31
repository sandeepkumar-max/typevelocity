const fs = require('fs');
let code = fs.readFileSync('src/components/BubbleShoot.tsx', 'utf8');

const inputField = `
      {/* Typing Input */}
      <div className="w-full max-w-4xl mt-4 z-20">
        <input 
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-emerald-400 px-6 py-4 rounded-2xl text-xl font-bold focus:outline-none focus:border-emerald-500 shadow-xl text-center"
          placeholder="Type to catch the spirits..."
          autoComplete="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
}
`;

code = code.replace(/    <\/div>\n  \);\n\}\n?$/, inputField);
fs.writeFileSync('src/components/BubbleShoot.tsx', code);
