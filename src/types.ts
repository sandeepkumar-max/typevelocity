export type Difficulty = 'easy' | 'medium' | 'hard' | 'developer';
export type ViewState = 'home' | 'practice' | 'meteor' | 'sprint' | 'bubble' | 'about' | 'help' | 'contact' | 'stats' | 'guide' | 'lessons' | 'lesson-practice';
export type EasyCase = 'lower' | 'upper' | 'mixed';
export type Language = 'english' | 'hindi';
export type HindiFont = 'mangal' | 'krutidev';

export interface GameSettings {
  difficulty: Difficulty;
  time: number;
  easyCase: EasyCase;
  soundEnabled: boolean;
  backspaceLock: boolean;
  autoScroll: boolean;
  fontFamily: string;
  language: Language;
  hindiFont: HindiFont;
}

export interface SessionStats {
  mode: 'practice' | 'sprint' | 'meteor' | 'bubble';
  wpm: number;
  accuracy: number;
  timeSpent: number; // in seconds
  errorCount: number;
  backspaceCount: number;
  wordStats: Record<string, { timeSpent: number; errors: number }>;
  letterStats: Record<string, { timeSpent: number; errors: number }>;
  createdAt?: number;
}
