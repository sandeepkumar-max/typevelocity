import React from 'react';
import { Keyboard } from 'lucide-react';
import { ViewState } from '../types';

interface FooterProps {
  onViewChange: (view: ViewState) => void;
}

export default function Footer({ onViewChange }: FooterProps) {
  return (
    <footer className="w-full glass-panel border-t border-slate-200 dark:border-white/10 mt-auto py-4 z-10 relative">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <a href="/" className="flex items-center gap-2 cursor-pointer hover:text-blue-500 transition-colors" onClick={(e) => { e.preventDefault(); onViewChange('home'); }}>
          <Keyboard className="h-4 w-4" />
          <span className="font-semibold">TypeVelocity</span>
        </a>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <a href="/privacy" onClick={(e) => { e.preventDefault(); onViewChange('privacy'); }} className="hover:text-blue-500 transition-colors">Privacy Policy</a>
          <a href="/terms" onClick={(e) => { e.preventDefault(); onViewChange('terms'); }} className="hover:text-blue-500 transition-colors">Terms & Conditions</a>
          <a href="/contact" onClick={(e) => { e.preventDefault(); onViewChange('contact'); }} className="hover:text-blue-500 transition-colors">Contact</a>
        </div>

        <p>© {new Date().getFullYear()} TypeVelocity. All rights reserved.</p>
      </div>
    </footer>
  );
}
