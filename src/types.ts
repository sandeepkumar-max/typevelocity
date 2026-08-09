export type Difficulty = 'easy' | 'medium' | 'hard' | 'developer';
export type ViewState = 'home' | 'practice' | 'meteor' | 'sprint' | 'about' | 'help' | 'contact' | 'stats';
export type EasyCase = 'lower' | 'upper' | 'mixed';

export interface GameSettings {
  difficulty: Difficulty;
  time: number;
  easyCase: EasyCase;
  soundEnabled: boolean;
}

export interface SessionStats {
  mode: 'practice' | 'sprint' | 'meteor';
  wpm: number;
  accuracy: number;
  timeSpent: number; // in seconds
  errorCount: number;
  backspaceCount: number;
  wordStats: Record<string, { timeSpent: number; errors: number }>;
  letterStats: Record<string, { timeSpent: number; errors: number }>;
  createdAt?: number;
}
