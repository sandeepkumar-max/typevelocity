import { Difficulty, EasyCase, Language, HindiFont } from '../types';

const easyWords = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what'];
const mediumWords = ['Quick', 'brown', 'fox', 'jumps!', 'over?', 'the,', 'lazy.', 'dog:', 'Hello,', 'World!', 'React;', 'TypeScript,', 'Vite?', 'Tailwind.', 'Glassmorphism!', 'Function,', 'Variable.', 'Component:', 'State!', 'Props?'];
const hardWords = ['#JavaScript', 'p@ssw0rd', '12345!', '$money', '%percent%', 'f00b@r', 'React_18', 'O(N^2)', '192.168.0.1', 'v1.0.0-rc.1', '{key:value}', '[1,2,3]', '=>', '===', '!==', 'async/await', 'try{catch}', 'git_commit', 'npm_run_dev'];
const devSnippets = ['const x = 10;', 'function foo() {}', '<div>Hello</div>', 'console.log("test");', 'import React from "react";', 'export default App;', 'if (x === y) {}', 'return false;', '<button onClick={handleClick}>', 'interface User { name: string; }', 'useEffect(() => {}, []);', 'const [val, setVal] = useState(0);'];

const hindiMangalEasy = ['और', 'के', 'में', 'है', 'कि', 'यह', 'से', 'को', 'पर', 'एक', 'नहीं', 'भी', 'तो', 'कर', 'ही', 'हो', 'लिए', 'अपने', 'था', 'जो', 'करना', 'था', 'साथ', 'क्या', 'इस'];
const hindiMangalMedium = ['भारत', 'सरकार', 'सबसे', 'पहले', 'समय', 'लोग', 'काम', 'देश', 'दिन', 'बहुत', 'बात', 'कहा', 'जाता', 'हैं', 'कुछ', 'अपने', 'वाले', 'होता', 'कोई', 'रहा'];
const hindiMangalHard = ['अंतर्राष्ट्रीय', 'प्रौद्योगिकी', 'संविधान', 'विश्वविद्यालय', 'आर्थिक', 'परिस्थितियों', 'उल्लेखनीय', 'विशेषताएं', 'स्वाभाविक', 'निम्नलिखित'];

const hindiKrutiEasy = ['vkSj', 'ds', 'esa', 'gS', 'fd', ';g', 'ls', 'dks', 'ij', ',d', 'ugha', 'Hkh', 'rks', 'dj', 'gh', 'gks', 'fy,', 'vius', 'Fkk', 'tks', 'djuk', 'lkFk', 'D;k', 'bl'];
const hindiKrutiMedium = ['Hkkjr', 'ljdkj', 'lcls', 'igys', 'le;', 'yksx', 'dke', 'ns”k', 'fnu', 'cgr', 'ckr', 'dgk', 'tkrk', 'gSa', 'dNN', 'vius', 'okys', 'gksrk', 'dksbZ', 'jgk'];
const hindiKrutiHard = ['varjkZ’Vªh;', 'izkS|ksfxdh', 'lafo/kku', 'fo”ofo|ky;', 'vkfFkZd', 'ifjfLFkfr;ksa', 'mYys[kuh;', 'fo”ks’krk,a', 'LokHkkfod', 'fuEufyf[kr'];

export function generateText(
  difficulty: Difficulty, 
  wordCount: number = 50, 
  easyCase: EasyCase = 'lower',
  language: Language = 'english',
  hindiFont: HindiFont = 'mangal'
): string {
  let source = easyWords;
  
  if (language === 'hindi') {
    if (hindiFont === 'krutidev') {
      if (difficulty === 'easy') source = hindiKrutiEasy;
      else if (difficulty === 'medium') source = hindiKrutiMedium;
      else source = hindiKrutiHard;
    } else {
      if (difficulty === 'easy') source = hindiMangalEasy;
      else if (difficulty === 'medium') source = hindiMangalMedium;
      else source = hindiMangalHard;
    }
  } else {
    if (difficulty === 'medium') source = mediumWords;
    if (difficulty === 'hard') source = hardWords;
    if (difficulty === 'developer') source = devSnippets;
  }

  let text = '';
  for (let i = 0; i < wordCount; i++) {
    const randomWord = source[Math.floor(Math.random() * source.length)];
    text += randomWord + (i === wordCount - 1 ? '' : ' ');
  }

  if (language === 'english' && difficulty === 'easy') {
    if (easyCase === 'upper') {
      text = text.toUpperCase();
    } else if (easyCase === 'mixed') {
      text = text.split(' ').map(w => Math.random() > 0.5 ? w.charAt(0).toUpperCase() + w.slice(1) : w.toLowerCase()).join(' ');
    } else {
      text = text.toLowerCase();
    }
  }

  return text;
}
