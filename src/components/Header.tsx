import { ViewState, GameSettings } from '../types';
import { Keyboard, Play, Trophy, Menu, Sun, Moon, BookOpen, UserCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { auth } from '../lib/firebase';
import { signInWithPopup, signInWithRedirect, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import InstallButton from './InstallButton';
import UserProfileModal from './UserProfileModal';

interface HeaderProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
  onMenuToggle: () => void;
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
}

export default function Header({ currentView, onViewChange, theme, onThemeToggle, onMenuToggle, settings, onSettingsChange }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        await signInWithRedirect(auth, provider);
      } else {
        await signInWithPopup(auth, provider);
      }
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        return; // Ignore if user closes the popup
      }
      console.error('Error signing in', error);
      toast.error('Failed to sign in. Please try again later.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
      toast.error('Failed to sign out. Please check your connection.');
    }
  };

  const navItems = [
    { id: 'guide', label: 'Guide', icon: BookOpen },
    { id: 'practice', label: 'Practice', icon: Keyboard },
    { id: 'meteor', label: 'Meteor Drop', icon: Play },
    { id: 'sprint', label: 'Neon Sprint', icon: Trophy },
    { id: 'bubble', label: 'Bubble Shoot', icon: Play },
  ] as const;

  return (
    <header className="sticky top-0 z-40 glass-panel border-b-white/10 backdrop-blur-md">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button onClick={onMenuToggle} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 md:hidden">
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center cursor-pointer mr-6" onClick={() => onViewChange('home')}>
              <Keyboard className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-xl font-bold tracking-tight hidden sm:block">
                Type<span className="text-blue-600 dark:text-blue-400">Velocity</span>
              </span>
            </div>

            {/* Desktop Nav for games */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id as ViewState)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2
                    ${currentView === item.id 
                      ? 'bg-black/10 dark:bg-white/10 text-blue-600 dark:text-blue-400' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Auth & Theme Buttons */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 mr-2 border border-slate-200 dark:border-slate-700">
              <select
                value={settings.language === 'hindi' ? (settings.hindiFont === 'krutidev' ? 'hindi-krutidev' : 'hindi-mangal') : 'english'}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'english') {
                    onSettingsChange({ ...settings, language: 'english' });
                  } else if (val === 'hindi-mangal') {
                    onSettingsChange({ ...settings, language: 'hindi', hindiFont: 'mangal' });
                  } else if (val === 'hindi-krutidev') {
                    onSettingsChange({ ...settings, language: 'hindi', hindiFont: 'krutidev' });
                  }
                }}
                className="bg-transparent text-sm font-medium text-slate-700 dark:text-slate-300 outline-none cursor-pointer appearance-none px-2"
              >
                <option value="english" className="bg-white dark:bg-slate-900">English</option>
                <option value="hindi-mangal" className="bg-white dark:bg-slate-900">Hindi (Mangal)</option>
                <option value="hindi-krutidev" className="bg-white dark:bg-slate-900">Hindi (Kruti Dev)</option>
              </select>
            </div>
            
            <InstallButton variant="header" theme={theme} />
            <button 
              onClick={onThemeToggle}
              className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/10 p-1 pr-2 rounded-full transition-colors"
                  title="Edit Profile"
                >
                  {user.photoURL ? (
                     <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-blue-500 object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full border border-blue-500 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <UserCircle className="w-5 h-5 text-slate-500 dark:text-slate-300" />
                    </div>
                  )}
                  <span className="text-sm font-medium hidden sm:block max-w-[100px] truncate text-slate-700 dark:text-slate-200">
                    {user.displayName || 'User'}
                  </span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={handleLogin}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium border border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 transition-colors hidden sm:block"
                >
                  Login
                </button>
                <button 
                  onClick={handleLogin}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium bg-blue-500 text-slate-900 hover:bg-blue-400 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {isProfileModalOpen && user && (
        <UserProfileModal user={user} onClose={() => setIsProfileModalOpen(false)} />
      )}
    </header>
  );
}
