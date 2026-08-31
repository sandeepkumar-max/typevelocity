export interface Lesson {
  id: number;
  title: string;
  description: string;
  keysFocused: string;
  content: string;
  hintMap: Record<string, string>;
  videoUrl?: string;
}

export const mangalLessons: Lesson[] = [
  {
    id: 1,
    title: "दायां हाथ (Right Hand) - Home Row",
    description: "दाएं हाथ की उंगलियों (Index to Pinky) से र, क, त, और च टाइप करना सीखें।",
    keysFocused: "j, k, l, ;",
    content: "र क त च र क त च रर कक तत चच र क त च",
    hintMap: { "र": "j", "क": "k", "त": "l", "च": ";" }
  },
  {
    id: 2,
    title: "बायां हाथ (Left Hand) - मात्राएं",
    description: "बाएं हाथ से इ (ि), ए (े), और ओ (ो) की मात्राएं लगाना सीखें।",
    keysFocused: "f, s, a",
    content: "कि के को रि रे रो ति ते तो चि चे चो",
    hintMap: { "क": "k", "र": "j", "त": "l", "च": ";", "ि": "f", "े": "s", "ो": "a", " ": "Space" }
  },
  {
    id: 3,
    title: "होम रो विस्तार (H और G)",
    description: "तर्जनी (Index finger) को थोड़ा आगे बढ़ाकर प (h) और ु की मात्रा (g) सीखें।",
    keysFocused: "h, g",
    content: "प पु पि पे कु को रु रो तु तो चु चो",
    hintMap: { "प": "h", "क": "k", "र": "j", "त": "l", "च": ";", "ु": "g", "ि": "f", "े": "s", "ो": "a", " ": "Space" }
  },
  {
    id: 4,
    title: "होम रो शब्द अभ्यास 1",
    description: "अब तक सीखी गई कुंजियों (Keys) को मिलाकर छोटे शब्द बनाएं।",
    keysFocused: "Home Row",
    content: "पर कर तक चक पक पिक रुक कोर चोर तोर",
    hintMap: { "प": "h", "र": "j", "क": "k", "त": "l", "च": ";", "ि": "f", "े": "s", "ो": "a", "ु": "g", " ": "Space" }
  },
  {
    id: 5,
    title: "होम रो शब्द अभ्यास 2",
    description: "थोड़े बड़े और कठिन शब्दों का अभ्यास करें।",
    keysFocused: "Home Row",
    content: "चुप रोक टोक करक परख कुक पोत रोते कोरे",
    hintMap: { "च": ";", "ु": "g", "प": "h", "र": "j", "ो": "a", "क": "k", "ट": "'", "त": "l", "े": "s", "ख": "K", " ": "Space" }
  }
];

export const krutidevLessons: Lesson[] = [
  {
    id: 1,
    title: "दायां हाथ (Right Hand) - Home Row",
    description: "दाएं हाथ की उंगलियों से र, ा (आ की मात्रा), स, और य टाइप करना सीखें। (Kruti Dev)",
    keysFocused: "j, k, l, ;",
    content: "j k l ; j k l ; jl lkj ;k j l",
    hintMap: { "j": "j", "k": "k", "l": "l", ";": ";", " ": "Space" }
  },
  {
    id: 2,
    title: "बायां हाथ (Left Hand) - Home Row",
    description: "बाएं हाथ की उंगलियों से क, ह, और ी (बड़ी ई की मात्रा) टाइप करना सीखें।",
    keysFocused: "d, g, h",
    content: "d g h d g h dd gg hh dgk gh",
    hintMap: { "d": "d", "g": "g", "h": "h", " ": "Space", "k": "k" }
  },
  {
    id: 3,
    title: "होम रो शब्द अभ्यास 1",
    description: "क, र, स, य, ह और मात्राओं को मिलाकर शब्द बनाएं।",
    keysFocused: "Home Row",
    content: "dkj gkj lkjk ghjk lgh jl dl ;d",
    hintMap: { "d": "d", "k": "k", "j": "j", "g": "g", "l": "l", "h": "h", ";": ";", " ": "Space" }
  },
  {
    id: 4,
    title: "अपर रो (Upper Row) - प, न, च, म",
    description: "ऊपर की लाइन से प (i), न (u), च (p), और म (e) टाइप करना सीखें।",
    keysFocused: "i, u, p, e",
    content: "i u p e ikj pki uke iku dke",
    hintMap: { "i": "i", "u": "u", "p": "p", "e": "e", "k": "k", "j": "j", "d": "d", " ": "Space" }
  },
  {
    id: 5,
    title: "होम रो + अपर रो शब्द",
    description: "अब तक सीखी गई कुंजियों का अभ्यास करें और तेज टाइपिंग करें।",
    keysFocused: "Mixed",
    content: "ikik pkpk ukuk ikl jkl dke uke",
    hintMap: { "i": "i", "k": "k", "p": "p", "u": "u", "l": "l", "j": "j", "d": "d", "e": "e", " ": "Space" }
  }
];
