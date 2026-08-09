import React from 'react';
import { ViewState } from '../types';
import { Home, Keyboard, Info, HelpCircle, Mail, X, Play, Trophy, BarChart2 } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  theme: 'dark' | 'light';
}

export default function Sidebar({ currentView, onViewChange, isOpen, setIsOpen, theme }: SidebarProps) {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'practice', label: 'Practice', icon: Keyboard },
    { id: 'meteor', label: 'Meteor Drop', icon: Play },
    { id: 'sprint', label: 'Neon Sprint', icon: Trophy },
    { id: 'stats', label: 'Stats', icon: BarChart2 },
    { id: 'about', label: 'About', icon: Info },
    { id: 'help', label: 'Help', icon: HelpCircle },
    { id: 'contact', label: 'Contact', icon: Mail },
  ] as const;

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-50 glass-panel border-r-white/10 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${theme === 'light' ? 'bg-white/80' : 'bg-[#0F172A]/90'}
      `}>
        <div className="p-4 flex items-center justify-between border-b border-white/10 h-16">
          <div className="flex items-center cursor-pointer" onClick={() => { onViewChange('home'); closeSidebar(); }}>
            <Keyboard className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mr-2" />
            <span className="text-xl font-bold tracking-tight">
              Type<span className="text-emerald-600 dark:text-emerald-400">Velocity</span>
            </span>
          </div>
          <button onClick={closeSidebar} className="text-slate-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">Menu</div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onViewChange(item.id as ViewState); closeSidebar(); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === item.id 
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-[inset_0_0_10px_rgba(16, 185, 129,0.2)]'
                  : theme === 'light' 
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-black/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <item.icon className={`h-5 w-5 ${currentView === item.id ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
