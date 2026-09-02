import React, { useState, useEffect, Suspense, lazy } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { ViewState, GameSettings, SessionStats } from './types';
import { ErrorBoundary } from './components/ErrorBoundary';
import DailyMissions from './components/DailyMissions';
import { updateMissionProgress } from './utils/missions';

import { auth, db } from './lib/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Keyboard, Loader2 } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

// Lazy load heavy views
const PracticeArea = lazy(() => import('./components/PracticeArea'));
const MeteorDrop = lazy(() => import('./components/MeteorDrop'));
const BubbleShoot = lazy(() => import('./components/BubbleShoot'));
const NeonSprint = lazy(() => import('./components/NeonSprint'));
const StatsView = lazy(() => import('./components/StatsView'));
const TypingGuide = lazy(() => import('./components/TypingGuide'));
const LessonList = lazy(() => import('./components/LessonList'));
const LessonPractice = lazy(() => import('./components/LessonPractice'));
const HeroAnimation = lazy(() => import('./components/HeroAnimation'));

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace('/', '');
      const validViews = ['home', 'practice', 'meteor', 'sprint', 'bubble', 'about', 'help', 'contact', 'stats', 'guide', 'lessons', 'lesson-practice', 'privacy', 'terms'];
      if (validViews.includes(path)) return path as ViewState;
    }
    return 'home';
  });
  const [settings, setSettings] = useState<GameSettings>({
    difficulty: 'easy',
    time: 30,
    easyCase: 'lower',
    soundEnabled: false,
    backspaceLock: false,
    autoScroll: typeof window !== 'undefined' ? window.innerWidth > 768 : true,
    fontFamily: 'font-fira',
    language: 'english',
    hindiFont: 'mangal'
  });
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lastSession, setLastSession] = useState<SessionStats | null>(null);
  const [currentLessonId, setCurrentLessonId] = useState<number>(1);
  const [courseType, setCourseType] = useState<'mangal' | 'krutidev' | 'english'>('english');

  const themeClasses = theme === 'dark' 
    ? "bg-[#0F172A] text-slate-200" 
    : "bg-slate-50 text-slate-900";

  const handleSessionComplete = async (stats: SessionStats) => {
    setLastSession(stats);
    setCurrentView('stats');

    if (auth.currentUser) {
      try {
        const sessionRef = doc(collection(db, 'users', auth.currentUser.uid, 'sessions'));
        await updateMissionProgress(auth.currentUser.uid, stats);
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

    // SEO & Routing Effect
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Update URL
    const path = currentView === 'home' ? '/' : `/${currentView}`;
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }

    // Update Title and Meta
    const titles: Record<string, string> = {
      home: 'TypeVelocity - Best Online Typing Tutor & Speed Test',
      practice: 'Typing Practice - Test your WPM | TypeVelocity',
      meteor: 'Meteor Drop - Typing Game | TypeVelocity',
      sprint: 'Neon Sprint - Typing Game | TypeVelocity',
      bubble: 'Spirit Catch - Typing Game | TypeVelocity',
      guide: 'Typing Guide - Learn Touch Typing | TypeVelocity',
      about: 'About Us | TypeVelocity',
      privacy: 'Privacy Policy | TypeVelocity',
      terms: 'Terms & Conditions | TypeVelocity'
    };
    
    const descriptions: Record<string, string> = {
      home: 'Master your typing speed with TypeVelocity. Free online typing tutor, WPM tests, and typing games.',
      practice: 'Take a free typing test to find out your WPM and accuracy. Practice English and Hindi typing.',
      meteor: 'Defend against falling words in this fast-paced typing survival game.',
      sprint: 'Race against the clock in short, high-intensity typing bursts to maximize speed.',
      guide: 'Learn the fundamentals of touch typing, finger placement, and posture to type faster.'
    };

    document.title = titles[currentView] || 'TypeVelocity - Typing Tutor';
    
    const desc = descriptions[currentView] || descriptions.home;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', desc);
    }
    
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', document.title);
    
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);

  }, [currentView]);

  // Handle Popstate (Back/Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace('/', '');
      const validViews = ['home', 'practice', 'meteor', 'sprint', 'bubble', 'about', 'help', 'contact', 'stats', 'guide', 'lessons', 'lesson-practice', 'privacy', 'terms'];
      if (validViews.includes(path)) {
        setCurrentView(path as ViewState);
      } else {
        setCurrentView('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
             <h1 className="text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
               Type Faster, <br className="hidden sm:block" />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-400">Think Clearer.</span>
             </h1>
             <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
               TypeVelocity is a professional typing platform designed to enhance your speed and accuracy. Gamified exercises, competitive sprints, and detailed analytics.
             </p>
             
             <div className="w-full flex flex-col items-center xl:items-start space-y-8">
              <DailyMissions />
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full sm:w-auto pt-4 justify-center xl:justify-start">
               <button onClick={() => setCurrentView('practice')} className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-500 hover:scale-105 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2">
                 Start Typing <Keyboard className="w-5 h-5" />
               </button>
               <button onClick={() => setCurrentView('lessons')} className="px-8 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-500 hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2">
                 Learn Typing Levels
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
           <h1 className="text-3xl font-bold">About TypeVelocity</h1>
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
           <h1 className="text-3xl font-bold">Help & Support</h1>
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
           <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
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
      case 'privacy': return (
        <div className="glass-panel p-8 sm:p-12 rounded-2xl w-full max-w-4xl mx-auto mt-4 sm:mt-8 space-y-6 text-slate-800 dark:text-slate-200">
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Privacy Policy</h1>
           <p>Last updated: {new Date().toLocaleDateString()}</p>
           <h3 className="text-xl font-bold mt-6 mb-2">1. Information We Collect</h3>
           <p>TypeVelocity collects basic profile information (such as name and email) when you choose to log in using Google or Email authentication. We also store your typing performance data (WPM, accuracy, history) to provide you with personal statistics.</p>
           <h3 className="text-xl font-bold mt-6 mb-2">2. How We Use Information</h3>
           <p>We use your information exclusively to provide, maintain, and improve the TypeVelocity typing platform. We do not sell your personal data to third parties.</p>
           <h3 className="text-xl font-bold mt-6 mb-2">3. Data Security</h3>
           <p>Your data is securely stored using Google Firebase. We implement standard industry security measures to protect your information.</p>
           <h3 className="text-xl font-bold mt-6 mb-2">4. Third-Party Ads (AdSense)</h3>
           <p>We may use Google AdSense to display ads. Google may use cookies to serve ads based on your prior visits to our website or other websites.</p>
           <h3 className="text-xl font-bold mt-6 mb-2">5. Contact Us</h3>
           <p>If you have any questions about this Privacy Policy, please contact us via the Contact page.</p>
        </div>
      );
      case 'terms': return (
        <div className="glass-panel p-8 sm:p-12 rounded-2xl w-full max-w-4xl mx-auto mt-4 sm:mt-8 space-y-6 text-slate-800 dark:text-slate-200">
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Terms & Conditions</h1>
           <p>Last updated: {new Date().toLocaleDateString()}</p>
           <h3 className="text-xl font-bold mt-6 mb-2">1. Acceptance of Terms</h3>
           <p>By accessing and using TypeVelocity, you accept and agree to be bound by the terms and provision of this agreement.</p>
           <h3 className="text-xl font-bold mt-6 mb-2">2. Use License</h3>
           <p>Permission is granted to temporarily use the materials on TypeVelocity's website for personal, non-commercial transitory viewing only.</p>
           <h3 className="text-xl font-bold mt-6 mb-2">3. Disclaimer</h3>
           <p>The materials on TypeVelocity's website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose.</p>
           <h3 className="text-xl font-bold mt-6 mb-2">4. Limitations</h3>
           <p>In no event shall TypeVelocity or its suppliers be liable for any damages arising out of the use or inability to use the materials on TypeVelocity's website.</p>
           <h3 className="text-xl font-bold mt-6 mb-2">5. Modifications</h3>
           <p>TypeVelocity may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</p>
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
      case 'lesson-practice': return <LessonPractice key={currentLessonId} 
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

      <Toaster position="bottom-right" toastOptions={{ style: { background: theme === 'dark' ? '#1e293b' : '#fff', color: theme === 'dark' ? '#fff' : '#0f172a' } }} />
      {/* Abstract Background Gradients */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="hidden sm:block fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-sky-500/20 blur-[120px] pointer-events-none"
      ></motion.div>
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, -90, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="hidden sm:block fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none"
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
          <ErrorBoundary>
            <Suspense fallback={<div className="flex-1 flex items-center justify-center min-h-[50vh]"><Loader2 className="w-10 h-10 animate-spin text-blue-500" /></div>}>
              {renderContent()}
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer onViewChange={setCurrentView} />
      </div>
    </div>
  );
}
