import { Lesson } from './hindiLessons';

export const englishLessons: Lesson[] = [
  {
    id: 1,
    title: "Home Row Basics (Left Hand)",
    description: "Learn to type A, S, D, F with your left hand on the home row.",
    keysFocused: "a, s, d, f",
    content: "a s d f a s d f as df as df fd sa fd sa",
    hintMap: { "a": "a", "s": "s", "d": "d", "f": "f", " ": "Space" },
    videoUrl: "https://www.youtube.com/embed/Y2w8-Z0_7E8"
  },
  {
    id: 2,
    title: "Home Row Basics (Right Hand)",
    description: "Learn to type J, K, L, ; with your right hand on the home row.",
    keysFocused: "j, k, l, ;",
    content: "j k l ; j k l ; jl k; jl k; ;l kj ;l kj",
    hintMap: { "j": "j", "k": "k", "l": "l", ";": ";", " ": "Space" },
    videoUrl: "https://www.youtube.com/embed/R2866j8mCbw"
  },
  {
    id: 3,
    title: "Full Home Row Words",
    description: "Combine left and right hands to type real words using the home row.",
    keysFocused: "Home Row",
    content: "aslad sad dad fall flask ask dash flash half",
    hintMap: { "a": "a", "s": "s", "d": "d", "f": "f", "j": "j", "k": "k", "l": "l", ";": ";", "h": "h", " ": "Space" },
    videoUrl: "https://www.youtube.com/embed/n4p3oA-OEQM"
  },
  {
    id: 4,
    title: "Top Row Intro (E & I)",
    description: "Learn to reach up to E and I with your middle fingers.",
    keysFocused: "e, i",
    content: "ded kik ded kik see fee die did field slide",
    hintMap: { "d": "d", "e": "e", "k": "k", "i": "i", "s": "s", "f": "f", "l": "l", " ": "Space" },
    videoUrl: "https://www.youtube.com/embed/p1o1fX_qFDI"
  },
  {
    id: 5,
    title: "Bottom Row Intro (C & M)",
    description: "Learn to reach down to C and M.",
    keysFocused: "c, m",
    content: "dcd jmj dcd jmj mac cam scam macs camp scam",
    hintMap: { "d": "d", "c": "c", "j": "j", "m": "m", "a": "a", "s": "s", "p": "p", " ": "Space" },
    videoUrl: "https://www.youtube.com/embed/zH3FpXX8tWk"
  }
];
