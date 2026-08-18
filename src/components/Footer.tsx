import React from 'react';
import { Keyboard, Github, Twitter, Linkedin } from 'lucide-react';
import { ViewState } from '../types';

interface FooterProps {
  onViewChange: (view: ViewState) => void;
}

export default function Footer({ onViewChange }: FooterProps) {
  return (
    <footer className="w-full glass-panel border-t border-slate-200 dark:border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 cursor-pointer mb-4" onClick={() => onViewChange('home')}>
              <Keyboard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold tracking-tight">
                Type<span className="text-blue-600 dark:text-blue-400">Velocity</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Master your keystrokes with the most engaging and professional typing platform. Practice, compete, and track your progress.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-blue-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-500 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-500 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><button onClick={() => onViewChange('practice')} className="hover:text-blue-500 transition-colors">Practice Area</button></li>
              <li><button onClick={() => onViewChange('meteor')} className="hover:text-blue-500 transition-colors">Meteor Drop</button></li>
              <li><button onClick={() => onViewChange('sprint')} className="hover:text-blue-500 transition-colors">Neon Sprint</button></li>
              <li><button onClick={() => onViewChange('bubble')} className="hover:text-blue-500 transition-colors">Bubble Shoot</button></li>
              <li><button onClick={() => onViewChange('stats')} className="hover:text-blue-500 transition-colors">Leaderboards</button></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><button onClick={() => onViewChange('help')} className="hover:text-blue-500 transition-colors">Help Center</button></li>
              <li><button onClick={() => onViewChange('contact')} className="hover:text-blue-500 transition-colors">Contact Us</button></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Newsletter</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Subscribe for updates on new modes and features.</p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-white/10 rounded-l-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} TypeVelocity. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Built for Speed</span>
            <span>•</span>
            <span>Designed for Accuracy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
