export type Difficulty = 'easy' | 'medium' | 'hard' | 'developer';
export type ViewState = 'home' | 'practice' | 'meteor' | 'sprint' | 'bubble' | 'arena' | 'about' | 'help' | 'contact' | 'stats' | 'guide' | 'lessons' | 'lesson-practice' | 'privacy' | 'terms';
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

export type MissionType = 'games_played' | 'accuracy' | 'time_spent' | 'wpm_target';

export interface Mission {
  id: string;
  title: string;
  type: MissionType;
  targetMode: 'any' | 'practice' | 'meteor' | 'sprint' | 'bubble';
  targetValue: number;
  currentProgress: number;
  rewardXp: number;
  isCompleted: boolean;
  isClaimed: boolean;
}

export interface DailyMissionsDoc {
  uid: string;
  date: string;
  missions: Mission[];
}

export interface UserProfile {
  displayName: string | null;
  photoURL: string | null;
  totalXp: number;
  createdAt: number;
}
