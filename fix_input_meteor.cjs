const fs = require('fs');
let code = fs.readFileSync('src/components/MeteorDrop.tsx', 'utf8');

const inputField = `
      {/* Typing Input */}
      <div className="w-full max-w-4xl mt-4 z-20">
        <input 
          type="text"
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-white px-6 py-4 rounded-2xl text-xl font-bold focus:outline-none focus:border-red-500 shadow-xl text-center"
          placeholder="Type to deflect the shurikens..."
          autoComplete="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
}
`;

code = code.replace(/    <\/div>\n  \);\n\}\n?$/, inputField);
fs.writeFileSync('src/components/MeteorDrop.tsx', code);
