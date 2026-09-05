import { ViewState, GameSettings } from '../types';
import { Keyboard, Play, Trophy, Menu, Sun, Moon, BookOpen, UserCircle, Zap, Languages, ChevronDown, Check } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
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
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Close language popup on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
      toast.success('Signed in successfully!');
    } catch (error: any) {
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        // User closed the popup intentionally
        return;
      }
      if (error.code === 'auth/popup-blocked') {
        toast.error('Sign-in popup was blocked by your browser. Please allow popups for this page.', { icon: '🚫' });
        return;
      }
      if (error.code === 'auth/unauthorized-domain') {
        toast.error(`Domain "${window.location.hostname}" is not yet authorized in Firebase Console. Please add it under Authentication > Settings > Authorized domains.`);
        console.warn('Firebase Auth domain needs authorization:', window.location.hostname);
        return;
      }
      console.warn('Sign in notice:', error?.message || error);
      toast.error(`Sign in notice: ${error.message || 'Could not complete sign in'}`);
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
    { id: 'arena', label: 'Typing Arena', icon: Zap },
    { id: 'meteor', label: 'Drop Ninja', icon: Play },
    { id: 'sprint', label: 'Neon Sprint', icon: Trophy },
    { id: 'bubble', label: 'Spirit Catch', icon: Play },
  ] as const;

  return (
    <header className="sticky top-0 z-40 glass-panel border-b-white/10 backdrop-blur-md">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button onClick={onMenuToggle} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 md:hidden">
              <Menu className="h-6 w-6" />
            </button>
            
            <a href="/" className="flex items-center cursor-pointer mr-6 group" onClick={(e) => { e.preventDefault(); onViewChange('home'); }}>
              <img src="/icon.svg" alt="TypeVelocity Logo" className="h-8 w-8 object-contain mr-2.5 transition-transform group-hover:scale-105" />
              <span className="text-xl font-bold tracking-tight hidden sm:block">
                Type<span className="text-blue-600 dark:text-blue-400">Velocity</span>
              </span>
            </a>

            {/* Desktop Nav for games */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <a
                  href={`/${item.id}`}
                  key={item.id}
                  onClick={(e) => { e.preventDefault(); onViewChange(item.id as ViewState); }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2
                    ${currentView === item.id 
                      ? 'bg-black/10 dark:bg-white/10 text-blue-600 dark:text-blue-400' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Auth & Theme Buttons */}
          <div className="flex items-center space-x-3">
            {/* Custom Designed Language & Font Popup Selector */}
            <div ref={langDropdownRef} className="relative hidden sm:block">
              {/* Accessible select synchronized for standard behavior & selectors */}
              <select
                id="header-language-select"
                aria-label="Select typing language and font layout"
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
                className="sr-only"
                tabIndex={-1}
              >
                <option value="english">English</option>
                <option value="hindi-mangal">Hindi (Mangal)</option>
                <option value="hindi-krutidev">Hindi (Kruti Dev)</option>
              </select>

              {/* Styled Trigger Button */}
              <button
                id="language-popup-trigger"
                type="button"
                onClick={() => setIsLangDropdownOpen(prev => !prev)}
                aria-expanded={isLangDropdownOpen}
                aria-haspopup="listbox"
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 select-none ${
                  isLangDropdownOpen
                    ? 'bg-blue-50/90 dark:bg-slate-800 border-blue-500/60 text-blue-600 dark:text-blue-400 shadow-sm ring-2 ring-blue-500/20'
                    : 'bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-700/80 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-center w-5 h-5 rounded-md bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  <Languages className="w-3.5 h-3.5" />
                </div>
                
                <span className="flex items-center gap-1.5 font-medium">
                  {settings.language === 'hindi' ? (
                    settings.hindiFont === 'krutidev' ? (
                      <>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">क</span>
                        <span>Hindi (Kruti Dev)</span>
                      </>
                    ) : (
                      <>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">अ</span>
                        <span>Hindi (Mangal)</span>
                      </>
                    )
                  ) : (
                    <>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">EN</span>
                      <span>English</span>
                    </>
                  )}
                </span>

                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180 text-blue-500' : 'group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
              </button>

              {/* Custom Designed Popup Box */}
              {isLangDropdownOpen && (
                <div 
                  id="language-custom-popup"
                  role="listbox"
                  className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  style={{ filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.18))' }}
                >
                  {/* Popup Header */}
                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800/80 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Languages className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        Language & Script
                      </span>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      3 Layouts
                    </span>
                  </div>

                  {/* Options List */}
                  <div className="space-y-1">
                    {/* Option 1: English */}
                    <button
                      type="button"
                      role="option"
                      aria-selected={settings.language === 'english'}
                      onClick={() => {
                        onSettingsChange({ ...settings, language: 'english' });
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-150 group ${
                        settings.language === 'english'
                          ? 'bg-blue-50/90 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300 ring-1 ring-blue-500/30 font-medium'
                          : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs ${
                          settings.language === 'english'
                            ? 'bg-blue-500 text-white shadow-blue-500/25'
                            : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60'
                        }`}>
                          EN
                        </div>
                        <div>
                          <div className="text-xs font-semibold flex items-center gap-1.5">
                            English
                            <span className="text-[10px] font-normal text-slate-600 dark:text-slate-300">(Default)</span>
                          </div>
                          <div className="text-[11px] text-slate-600 dark:text-slate-300 font-normal">
                            Standard QWERTY layout
                          </div>
                        </div>
                      </div>
                      {settings.language === 'english' && (
                        <div className="w-5 h-5 rounded-full bg-blue-500/10 dark:bg-blue-400/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>

                    {/* Option 2: Hindi Mangal */}
                    <button
                      type="button"
                      role="option"
                      aria-selected={settings.language === 'hindi' && settings.hindiFont === 'mangal'}
                      onClick={() => {
                        onSettingsChange({ ...settings, language: 'hindi', hindiFont: 'mangal' });
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-150 group ${
                        settings.language === 'hindi' && settings.hindiFont === 'mangal'
                          ? 'bg-amber-50/90 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/30 font-medium'
                          : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-xs ${
                          settings.language === 'hindi' && settings.hindiFont === 'mangal'
                            ? 'bg-amber-500 text-white shadow-amber-500/25'
                            : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/60'
                        }`}>
                          अ
                        </div>
                        <div>
                          <div className="text-xs font-semibold">
                            Hindi (Mangal)
                          </div>
                          <div className="text-[11px] text-slate-600 dark:text-slate-300 font-normal">
                            Unicode Remington / Inscript
                          </div>
                        </div>
                      </div>
                      {settings.language === 'hindi' && settings.hindiFont === 'mangal' && (
                        <div className="w-5 h-5 rounded-full bg-amber-500/10 dark:bg-amber-400/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>

                    {/* Option 3: Hindi Kruti Dev */}
                    <button
                      type="button"
                      role="option"
                      aria-selected={settings.language === 'hindi' && settings.hindiFont === 'krutidev'}
                      onClick={() => {
                        onSettingsChange({ ...settings, language: 'hindi', hindiFont: 'krutidev' });
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-150 group ${
                        settings.language === 'hindi' && settings.hindiFont === 'krutidev'
                          ? 'bg-emerald-50/90 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30 font-medium'
                          : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-xs ${
                          settings.language === 'hindi' && settings.hindiFont === 'krutidev'
                            ? 'bg-emerald-500 text-white shadow-emerald-500/25'
                            : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/60'
                        }`}>
                          क
                        </div>
                        <div>
                          <div className="text-xs font-semibold">
                            Hindi (Kruti Dev)
                          </div>
                          <div className="text-[11px] text-slate-600 dark:text-slate-300 font-normal">
                            Typewriter 010 Legacy Font
                          </div>
                        </div>
                      </div>
                      {settings.language === 'hindi' && settings.hindiFont === 'krutidev' && (
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 dark:bg-emerald-400/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              )}
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
                     <img src={user.photoURL} alt={user.displayName || "User profile picture"} className="w-8 h-8 rounded-full border border-blue-500 object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full border border-blue-500 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <UserCircle className="w-5 h-5 text-slate-500 dark:text-slate-300" />
                    </div>
                  )}
                  <span className="text-sm font-medium hidden sm:block whitespace-nowrap sm:whitespace-normal max-w-[120px] sm:max-w-[180px] break-words text-left leading-tight text-slate-700 dark:text-slate-200">
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
