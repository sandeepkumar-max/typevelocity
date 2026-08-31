import { Difficulty, EasyCase, Language, HindiFont } from '../types';

const easySentences = [
  "The quick brown fox jumps over the lazy dog.",
  "She sells seashells by the seashore.",
  "A journey of a thousand miles begins with a single step.",
  "To be or not to be, that is the question.",
  "All that glitters is not gold.",
  "Where there is a will, there is a way.",
  "Better late than never.",
  "Two wrongs do not make a right.",
  "Actions speak louder than words.",
  "Practice makes perfect.",
  "The early bird catches the worm.",
  "Every cloud has a silver lining.",
  "Don't judge a book by its cover.",
  "When in Rome, do as the Romans do.",
  "Honesty is the best policy."
];

const quotes = [
  "The only limit to our realization of tomorrow will be our doubts of today.",
  "In the end, it's not the years in your life that count. It's the life in your years.",
  "Life is what happens when you're busy making other plans.",
  "Do not go where the path may lead, go instead where there is no path and leave a trail.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "You miss 100% of the shots you don't take.",
  "I have not failed. I've just found 10,000 ways that won't work.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "A room without books is like a body without a soul.",
  "Be the change that you wish to see in the world.",
  "The greatest glory in living lies not in never falling, but in rising every time we fall.",
  "The way to get started is to quit talking and begin doing.",
  "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.",
  "Your time is limited, so don't waste it living someone else's life."
];

const trivia = [
  "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
  "The shortest war in history was between Britain and Zanzibar on August 27, 1896. Zanzibar surrendered after 38 minutes.",
  "A day on Venus is longer than a year on Venus. It takes Venus 243 Earth days to rotate once on its axis.",
  "Bananas are curved because they grow towards the sun in a process called negative geotropism.",
  "Octopuses have three hearts, nine brains, and blue blood. Two hearts pump blood to the gills, while the third pumps it to the rest of the body.",
  "The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion of the iron.",
  "Wombat poop is cube-shaped, which stops it from rolling away and helps mark their territory.",
  "There are more possible iterations of a game of chess than there are atoms in the observable universe.",
  "A jiffy is an actual unit of time. In physics, it represents the time it takes for light to travel one centimeter in a vacuum.",
  "The unicorn is the national animal of Scotland, chosen for its association with dominance and chivalry in Celtic mythology.",
  "Water makes up about 71 percent of the Earth's surface, while the other 29 percent consists of continents and islands.",
  "A group of flamingos is called a flamboyance. A group of crows is called a murder. A group of owls is called a parliament."
];

const codingSnippets = [
  "function debounce(func, wait) { let timeout; return function(...args) { clearTimeout(timeout); timeout = setTimeout(() => func.apply(this, args), wait); }; }",
  "const sum = arrays.reduce((acc, curr) => acc + curr, 0);",
  "export const fetchUserData = async (id: string): Promise<User> => { const res = await fetch(`/api/users/${id}`); return res.json(); };",
  "app.post('/api/login', passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/login' }));",
  "SELECT u.name, p.title FROM users u JOIN posts p ON u.id = p.user_id WHERE p.status = 'published' ORDER BY p.created_at DESC;",
  "const [state, dispatch] = useReducer(reducer, initialState);",
  "document.querySelectorAll('.btn').forEach(btn => btn.addEventListener('click', handleClick));",
  "class Singleton { static instance; constructor() { if (Singleton.instance) return Singleton.instance; Singleton.instance = this; } }",
  "@media (max-width: 768px) { .container { flex-direction: column; padding: 1rem; } }",
  "setTimeout(() => { console.log('Asynchronous execution complete.'); }, 2000);",
  "const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);",
  "import { useState, useEffect } from 'react'; export default function App() { return <div>Hello World</div>; }"
];

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
  let source = easySentences;
  
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
    if (difficulty === 'easy') source = easySentences;
    else if (difficulty === 'medium') source = quotes;
    else if (difficulty === 'hard') source = trivia;
    else if (difficulty === 'developer') source = codingSnippets;
  }

  let text = '';
  
  if (wordCount === 1) {
    // For games that need exactly 1 random word (e.g., BubbleShoot, MeteorDrop)
    const allWords = source.join(' ').split(/\s+/).filter(w => w.length > 0);
    text = allWords[Math.floor(Math.random() * allWords.length)];
  } else {
    // For practice areas, build until we reach the word count target
    let currentWordCount = 0;
    while (currentWordCount < wordCount) {
      const sentence = source[Math.floor(Math.random() * source.length)];
      text += (text ? ' ' : '') + sentence;
      currentWordCount = text.split(/\s+/).length;
    }
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
