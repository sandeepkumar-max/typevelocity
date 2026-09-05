import React, { useState } from 'react';
import { ViewState, GameSettings } from '../types';
import MechanicalKeyboardVisual from './MechanicalKeyboardVisual';
import HeroAnimation from './HeroAnimation';
import PracticeArea from './PracticeArea';
import DailyMissions from './DailyMissions';
import { 
  Keyboard, 
  Zap, 
  Trophy, 
  Target, 
  Clock, 
  Flame, 
  Languages, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Play, 
  TrendingUp, 
  Award,
  ChevronDown
} from 'lucide-react';

interface HomeViewProps {
  theme: 'light' | 'dark';
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onViewChange: (view: ViewState) => void;
}

export default function HomeView({
  theme,
  settings,
  onSettingsChange,
  onViewChange,
}: HomeViewProps) {
  const [arenaMode, setArenaMode] = useState<'stream' | 'timed'>('stream');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleStartTimedPractice = (timeSeconds: number, lang: 'english' | 'hindi' = 'english', hindiFont?: 'krutidev' | 'mangal') => {
    onSettingsChange({
      ...settings,
      time: timeSeconds,
      language: lang,
      hindiFont: hindiFont || settings.hindiFont,
    });
    onViewChange('practice');
  };

  return (
    <div className="w-full flex flex-col space-y-20 sm:space-y-28 pb-16">

      {/* ========================================================= */}
      {/* 1. HERO SECTION                                           */}
      {/* ========================================================= */}
      <section className="relative pt-6 sm:pt-10 md:pt-14 flex flex-col items-center text-center w-full max-w-7xl mx-auto px-3 sm:px-6">
        
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-5xl h-[420px] bg-gradient-to-b from-blue-500/15 via-cyan-400/15 to-transparent blur-3xl pointer-events-none -z-10" />

        {/* 1. Brand/Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full bg-blue-50/95 dark:bg-blue-950/60 border border-blue-200/90 dark:border-blue-800/70 shadow-xs mb-5 sm:mb-6 backdrop-blur-md">
          <img src="/icon.svg" alt="TypeVelocity Logo" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
          <span className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300 tracking-wide">
            TypeVelocity.in <span className="text-slate-400 font-normal dark:text-slate-500">•</span> Precision Typing Platform
          </span>
        </div>

        {/* 2. Main Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.05] max-w-5xl">
          Type Faster.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 dark:from-blue-400 dark:via-sky-400 dark:to-cyan-300">
            Type Smarter.
          </span>
        </h1>

        {/* 3. Short Supporting Line */}
        <p className="mt-5 sm:mt-6 text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl font-normal leading-relaxed">
          Practice your typing, improve your accuracy, and track your progress with real-time feedback and structured tests.
        </p>

        {/* 4. Prominent CTAs with "Start Typing" as focal button */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-5 z-10">
          <button
            type="button"
            onClick={() => scrollToSection('typing-arena')}
            className="group px-8 sm:px-11 py-4 sm:py-4.5 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-3 cursor-pointer ring-4 ring-blue-500/15"
          >
            <span>Start Typing</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('practice-modes')}
            className="px-7 py-4 sm:py-4.5 rounded-full bg-white dark:bg-slate-800/95 border border-slate-200/90 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-bold text-base shadow-xs hover:shadow-sm transition-all flex items-center gap-2.5 cursor-pointer"
          >
            <Keyboard className="w-5 h-5 text-blue-500" />
            <span>Practice Modes</span>
          </button>
        </div>

        {/* 5. Prominent Large Mechanical Keyboard Visual */}
        <div className="w-full mt-10 sm:mt-14 lg:mt-16 relative flex flex-col items-center">
          <MechanicalKeyboardVisual 
            onKeyClick={() => {
              // Smooth tactile interaction
            }}
          />

          {/* Clean downward flow indicator to arena */}
          <button
            type="button"
            onClick={() => scrollToSection('typing-arena')}
            className="mt-6 sm:mt-8 flex flex-col items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group"
          >
            <span className="tracking-wider uppercase text-[11px]">Scroll to Live Arena</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform animate-bounce text-blue-500" />
          </button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. INTERACTIVE TYPING ARENA SECTION                       */}
      {/* ========================================================= */}
      <section id="typing-arena" className="scroll-mt-20 w-full max-w-6xl xl:max-w-7xl mx-auto px-3 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Zap className="w-4 h-4" />
              <span>Interactive Typing Arena</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Start Typing Instantly.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">
              Type on your keyboard to test your speed with live rhythm feedback and tactile hand guidance.
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <button
              type="button"
              onClick={() => setArenaMode('stream')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                arenaMode === 'stream'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Flow Arena</span>
            </button>
            <button
              type="button"
              onClick={() => setArenaMode('timed')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                arenaMode === 'timed'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Timed Practice</span>
            </button>
          </div>
        </div>

        {/* Embedded Interactive Arena Container */}
        <div className="w-full">
          {arenaMode === 'stream' ? (
            <HeroAnimation theme={theme} isCompact={false} />
          ) : (
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 p-4 sm:p-6 backdrop-blur-xl shadow-lg">
              <PracticeArea
                settings={settings}
                onSettingsChange={onSettingsChange}
                onOpenArena={() => setArenaMode('stream')}
              />
            </div>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. TYPING TEST / PRACTICE MODES SECTION                   */}
      {/* ========================================================= */}
      <section id="practice-modes" className="scroll-mt-20 w-full max-w-6xl mx-auto px-2 sm:px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Keyboard className="w-4 h-4" />
            <span>Practice Options & Tests</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Choose Your Practice Style
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
            Whether you want a quick 30-second speed benchmark or specialized Hindi typing for competitive exams, we have you covered.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: 60-Second Speed Benchmark */}
          <div className="group relative rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500/60 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                  <Clock className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
                  Standard Test
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                60-Second Speed Test
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                The international gold standard test. Accurately calculates your net WPM, accuracy %, and raw keystroke consistency.
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Time: 1 Minute</span>
              <button
                type="button"
                onClick={() => handleStartTimedPractice(60, 'english')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Take 60s Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: 30-Second Quick Blitz */}
          <div className="group relative rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:border-sky-400 dark:hover:border-sky-500/60 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/50">
                  <Flame className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/60">
                  Fast Sprint
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                30-Second Sprint
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Short high-intensity bursts designed to push past your current speed ceiling and build rapid reflex memory.
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Time: 30 Seconds</span>
              <button
                type="button"
                onClick={() => handleStartTimedPractice(30, 'english')}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Take 30s Sprint</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Hindi Typing (Kruti Dev & Mangal) */}
          <div className="group relative rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-500/60 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                  <Languages className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                  Hindi Exams
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Hindi Typing (Kruti Dev & Mangal)
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Specialized test suite for CPCT, SSC, High Court, and State exams with authentic Kruti Dev 010 and Mangal InScript layouts.
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Bilingual Support</span>
              <button
                type="button"
                onClick={() => handleStartTimedPractice(60, 'hindi', 'krutidev')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Practice Hindi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4: Accuracy & Precision Mode */}
          <div className="group relative rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500/60 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                  Accuracy First
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Precision Typing Mode
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Build 99%+ accuracy by mastering muscle memory and eliminating excessive backspacing habits.
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Backspace Lock</span>
              <button
                type="button"
                onClick={() => {
                  onSettingsChange({ ...settings, backspaceLock: true });
                  onViewChange('practice');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Test Precision</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 5: Gamified Arcade Mini-Games */}
          <div className="group relative rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500/60 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50">
                  <Trophy className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
                  Gamified
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Drop Ninja & Neon Sprint
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Defend against falling meteor words, burst through racing checkpoints, or shoot spirit bubbles.
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">3 Arcade Games</span>
              <button
                type="button"
                onClick={() => onViewChange('meteor')}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Play Games</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 6: Structured Touch Typing Lessons */}
          <div className="group relative rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:border-cyan-400 dark:hover:border-cyan-500/60 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/50">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-200/60 dark:border-cyan-800/60">
                  Curriculum
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Step-by-Step Lessons
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                From home-row basics (ASDF JKL;) to numbers and symbols. Master proper 10-finger placement.
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Beginner to Pro</span>
              <button
                type="button"
                onClick={() => onViewChange('lessons')}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Lessons</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. PROGRESS / RESULTS SECTION                             */}
      {/* ========================================================= */}
      <section id="progress" className="scroll-mt-20 w-full max-w-6xl mx-auto px-2 sm:px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <TrendingUp className="w-4 h-4" />
            <span>Track Your Mastery</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Performance & Analytics
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
            Clear visual statistics to monitor your typing speed growth, consistency, and daily missions.
          </p>
        </div>

        {/* Big Telemetry Stats Showcase */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          
          <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col items-center text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
              Typing Speed
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-slate-900 dark:text-white">
              WPM
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Words per minute measured on standard 5-character intervals.
            </p>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col items-center text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
              Precision
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-slate-900 dark:text-white">
              98%+
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Target accuracy benchmark to minimize backspace corrections.
            </p>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col items-center text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              Telemetry
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-slate-900 dark:text-white">
              Real-time
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Instant error heatmaps and per-key response latency feedback.
            </p>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col items-center text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
              Consistency
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-slate-900 dark:text-white">
              Daily
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Streak tracking and daily XP missions to keep you building habits.
            </p>
          </div>

        </div>

        {/* Daily Missions Embedded Block */}
        <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Award className="w-4 h-4" />
              <span>Daily Practice Quests</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Complete Missions & Earn XP
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Log in to save your personal best scores, view detailed historical charts, and claim daily XP rewards.
            </p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-2">
            <DailyMissions />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. WHY TYPEVELOCITY SECTION                               */}
      {/* ========================================================= */}
      <section id="why-typevelocity" className="scroll-mt-20 w-full max-w-6xl mx-auto px-2 sm:px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Core Advantages</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Why Choose TypeVelocity?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
            Engineered with modern web performance, ergonomic finger guidance, and authentic Hindi font engines.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/90 p-6 shadow-xs flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
              Improve Typing Speed
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Break past 60 and 80+ WPM barriers through repetitive rhythm cadence and continuous word streaming.
            </p>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/90 p-6 shadow-xs flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
              Master Pinpoint Accuracy
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Eliminate costly typos with instant acoustic error alerts and strict backspace constraint modes.
            </p>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/90 p-6 shadow-xs flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center mb-4">
              <Languages className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
              Hindi & English Bilingual
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Full support for Hindi Kruti Dev 010 and Mangal Remington/InScript fonts used in government and court exams.
            </p>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/90 p-6 shadow-xs flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/50 flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
              Build Typing Confidence
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Develop subconscious touch typing habits so you never have to glance down at your keyboard again.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. FINAL CALL TO ACTION                                   */}
      {/* ========================================================= */}
      <section id="cta" className="scroll-mt-20 w-full max-w-4xl mx-auto px-2 sm:px-4">
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 sm:p-12 text-center text-white shadow-xl shadow-blue-500/15 overflow-hidden">
          
          {/* Subtle Graphic Accents */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-cyan-400/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Ready to improve your typing?
            </h2>
            <p className="text-base sm:text-lg text-blue-100/90 font-normal leading-relaxed">
              Join thousands of typists and students building lightning-fast speed, accuracy, and muscle memory today.
            </p>
            
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => scrollToSection('typing-arena')}
                className="px-8 py-4 rounded-full bg-white hover:bg-slate-100 active:scale-95 text-blue-700 font-bold text-base shadow-lg transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <span>Start Typing</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => onViewChange('guide')}
                className="px-6 py-4 rounded-full bg-blue-800/60 hover:bg-blue-800 border border-white/20 text-white font-semibold text-base transition-all flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-5 h-5" />
                <span>Typing Guide</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
