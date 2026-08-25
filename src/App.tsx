import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { ViewState, GameSettings, SessionStats } from './types';
import PracticeArea from './components/PracticeArea';
import MeteorDrop from './components/MeteorDrop';
import BubbleShoot from './components/BubbleShoot';
import NeonSprint from './components/NeonSprint';
import StatsView from './components/StatsView';
import TypingGuide from './components/TypingGuide';
import LessonList from './components/LessonList';
import LessonPractice from './components/LessonPractice';
import HeroAnimation from './components/HeroAnimation';
import { CustomCursor } from './components/CustomCursor';
import { auth, db } from './lib/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Keyboard } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [settings, setSettings] = useState<GameSettings>({
    difficulty: 'easy',
    time: 30,
    easyCase: 'lower',
    soundEnabled: true,
    backspaceLock: false,
    autoScroll: true,
    fontFamily: 'font-fira',
    language: 'english',
    hindiFont: 'mangal'
  });
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lastSession, setLastSession] = useState<SessionStats | null>(null);
  const [currentLessonId, setCurrentLessonId] = useState<number>(1);
  const [courseType, setCourseType] = useState<'mangal' | 'krutidev'>('mangal');

  const themeClasses = theme === 'dark' 
    ? "bg-[#0F172A] text-slate-200" 
    : "bg-slate-50 text-slate-900";

  const handleSessionComplete = async (stats: SessionStats) => {
    setLastSession(stats);
    setCurrentView('stats');

    if (auth.currentUser) {
      try {
        const sessionRef = doc(collection(db, 'users', auth.currentUser.uid, 'sessions'));
        await setDoc(sessionRef, {
          userId: auth.currentUser.uid,
          mode: stats.mode,
          wpm: stats.wpm,
          accuracy: stats.accuracy,
          timeSpent: stats.timeSpent,
          errorCount: stats.errorCount,
          backspaceCount: stats.backspaceCount,
          createdAt: serverTimestamp()
        });
      } catch (error) {
        console.error('Error saving session:', error);
        toast.error('Failed to save progress. Please check your connection.');
      }
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home': return (
        <div className="flex flex-col xl:flex-row items-center justify-between min-h-[70vh] max-w-7xl mx-auto gap-12 xl:gap-8 px-4 py-8 xl:py-0">
           
           <div className="flex-1 flex flex-col items-center xl:items-start text-center xl:text-left space-y-8 z-10">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium text-sm border border-blue-500/20 shadow-sm backdrop-blur-sm">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
               </span>
               New: Meteor Drop & Neon Sprint modes available!
             </div>
             <h1 className="text-5xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
               Type Faster, <br className="hidden sm:block" />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-400">Think Clearer.</span>
             </h1>
             <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
               TypeVelocity is a professional typing platform designed to enhance your speed and accuracy. Gamified exercises, competitive sprints, and detailed analytics.
             </p>
             
             <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full sm:w-auto pt-4 justify-center xl:justify-start">
               <button onClick={() => setCurrentView('practice')} className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-500 hover:scale-105 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2">
                 Start Typing <Keyboard className="w-5 h-5" />
               </button>
               <button onClick={() => setCurrentView('lessons')} className="px-8 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-500 hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2">
                 Learn Hindi Levels
               </button>
             </div>
           </div>
           
           <div className="flex-1 w-full max-w-2xl xl:max-w-none relative">
             <HeroAnimation />
           </div>
        </div>
      );
      case 'about': return (
        <div className="glass-panel p-8 sm:p-12 rounded-2xl w-full max-w-4xl mx-auto mt-4 sm:mt-8 space-y-6">
           <h2 className="text-3xl font-bold">About TypeVelocity</h2>
           <p className="text-slate-600 dark:text-slate-300 leading-relaxed">TypeVelocity is a next-generation typing trainer designed to make improving your typing speed fun and effective. We combine aesthetic UI with real-time feedback and engaging gamified experiences.</p>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              <div className="p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10">
                 <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-2">Practice</h3>
                 <p className="text-sm text-slate-600 dark:text-slate-400">Classic typing tests to accurately measure your WPM and accuracy.</p>
              </div>
              <div className="p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10">
                 <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-2">Meteor Drop</h3>
                 <p className="text-sm text-slate-600 dark:text-slate-400">Defend against falling words in this fast-paced survival mode.</p>
              </div>
              <div className="p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10">
                 <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-2">Neon Sprint</h3>
                 <p className="text-sm text-slate-600 dark:text-slate-400">Race against the clock in short, high-intensity typing bursts.</p>
              </div>
           </div>
        </div>
      );
      case 'help': return (
        <div className="glass-panel p-8 sm:p-12 rounded-2xl w-full max-w-4xl mx-auto mt-4 sm:mt-8 space-y-6">
           <h2 className="text-3xl font-bold">Help & Support</h2>
           <div className="space-y-4">
              <div className="p-4 border border-black/10 dark:border-white/10 rounded-lg">
                 <h3 className="font-bold text-lg mb-2 text-sky-600 dark:text-sky-400">How do I start a test?</h3>
                 <p className="text-slate-600 dark:text-slate-400">Navigate to Practice, Meteor Drop, or Neon Sprint using the sidebar or header menu. Simply start typing to begin the challenge automatically.</p>
              </div>
              <div className="p-4 border border-black/10 dark:border-white/10 rounded-lg">
                 <h3 className="font-bold text-lg mb-2 text-sky-600 dark:text-sky-400">What is WPM?</h3>
                 <p className="text-slate-600 dark:text-slate-400">WPM stands for Words Per Minute. It calculates your typing speed based on the standard of 5 characters per word.</p>
              </div>
           </div>
        </div>
      );
      case 'contact': return (
        <div className="glass-panel p-8 sm:p-12 rounded-2xl w-full max-w-4xl mx-auto mt-4 sm:mt-8 space-y-6">
           <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
           <form className="space-y-4 max-w-md" onSubmit={(e) => e.preventDefault()}>
              <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                 <input type="text" className="w-full bg-white dark:bg-transparent border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2 focus:border-blue-500 outline-none text-slate-900 dark:text-white" />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                 <input type="email" className="w-full bg-white dark:bg-transparent border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2 focus:border-blue-500 outline-none text-slate-900 dark:text-white" />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                 <textarea rows={4} className="w-full bg-white dark:bg-transparent border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2 focus:border-blue-500 outline-none text-slate-900 dark:text-white"></textarea>
              </div>
              <button className="px-6 py-2 bg-blue-500 text-slate-900 rounded-lg font-bold hover:bg-blue-400 transition-colors w-full sm:w-auto">Send Message</button>
           </form>
        </div>
      );
      case 'practice': return <PracticeArea settings={settings} onSettingsChange={setSettings} onComplete={handleSessionComplete} />;
      case 'meteor': return <MeteorDrop settings={settings} onSettingsChange={setSettings} onComplete={handleSessionComplete} />;
      case 'sprint': return <NeonSprint settings={settings} onSettingsChange={setSettings} onComplete={handleSessionComplete} />;
      case 'bubble': return <BubbleShoot settings={settings} onSettingsChange={setSettings} onComplete={handleSessionComplete} />;
      case 'guide': return <TypingGuide />;
      case 'lessons': return <LessonList 
        courseType={courseType}
        onCourseTypeChange={setCourseType}
        onSelectLesson={(id) => {
          setCurrentLessonId(id);
          setCurrentView('lesson-practice');
        }} 
      />;
      case 'lesson-practice': return <LessonPractice 
        lessonId={currentLessonId} 
        courseType={courseType}
        onBack={() => setCurrentView('lessons')} 
        onNextLesson={(id) => setCurrentLessonId(id)}
        soundEnabled={settings.soundEnabled}
      />;
      case 'stats': return <StatsView lastSession={lastSession} onAction={(action) => {
        if (action === 'home') setCurrentView('home');
        if (action === 'restart') {
          setCurrentView(lastSession?.mode as ViewState || 'practice');
        }
      }} />;
      default: return null;
    }
  }

  return (
    <div className={`min-h-screen relative overflow-hidden flex ${themeClasses} ${theme === 'light' ? 'light-theme' : 'dark'}`}>
      <CustomCursor />
      <Toaster position="bottom-right" toastOptions={{ style: { background: theme === 'dark' ? '#1e293b' : '#fff', color: theme === 'dark' ? '#fff' : '#0f172a' } }} />
      {/* Abstract Background Gradients */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-sky-500/20 blur-[120px] pointer-events-none"
      ></motion.div>
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, -90, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none"
      ></motion.div>

      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        theme={theme}
      />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative z-10 h-screen overflow-y-auto">
        <Header 
          currentView={currentView} 
          onViewChange={setCurrentView} 
          theme={theme} 
          onThemeToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          onMenuToggle={() => setIsSidebarOpen(true)}
          settings={settings}
          onSettingsChange={setSettings}
        />
        
        <main className="flex-grow flex flex-col py-8 px-4 sm:px-6 lg:px-8 w-full">
          {renderContent()}
        </main>
        <Footer onViewChange={setCurrentView} />
      </div>
    </div>
  );
}
