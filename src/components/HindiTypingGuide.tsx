import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface HindiTypingGuideProps {
  onClose: () => void;
}

export default function HindiTypingGuide({ onClose }: HindiTypingGuideProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-3xl my-auto rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
         <div className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Keyboard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              How to Type in Hindi
            </h2>
            <button 
              onClick={onClose} 
              className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
               <X className="w-6 h-6" />
            </button>
         </div>
         
         <div className="p-4 sm:p-8 space-y-8 max-h-[70vh] overflow-y-auto">
            <section>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">Understanding the Modes</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
                TypeVelocity supports two distinct ways to type in Hindi. Depending on your choice in the settings, your keyboard will behave differently. You <strong className="text-slate-800 dark:text-slate-200">do not</strong> need to install Hindi input software on your computer—the game automatically maps your standard English QWERTY keyboard to Hindi letters!
              </p>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <section className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-5 border border-blue-100 dark:border-blue-900/30">
                <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-2">1. Mangal (Inscript)</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm leading-relaxed">
                  The standard Indian Government Unicode layout. Vowels are on the left, consonants on the right.
                </p>
                
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 text-sm uppercase tracking-wider">Common Keys:</h4>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex justify-between bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700"><span><strong>k</strong></span> <span className="font-hindi text-lg">क</span></li>
                  <li className="flex justify-between bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700"><span><strong>i</strong></span> <span className="font-hindi text-lg">ग</span></li>
                  <li className="flex justify-between bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700"><span><strong>h</strong></span> <span className="font-hindi text-lg">प</span></li>
                  <li className="flex justify-between bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700"><span><strong>u</strong></span> <span className="font-hindi text-lg">ह</span></li>
                  <li className="flex justify-between bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700"><span><strong>e</strong></span> <span className="font-hindi text-lg">म</span></li>
                  <li className="flex justify-between bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700"><span><strong>f</strong></span> <span className="font-hindi text-lg">ि</span></li>
                </ul>
              </section>
              
              <section className="bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-900/30">
                <h3 className="text-lg font-bold text-indigo-700 dark:text-indigo-400 mb-2">2. Kruti Dev (Remington)</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm leading-relaxed">
                  A legacy typewriter layout. It types visually, so you type the 'Matra' before the letter it applies to.
                </p>
                
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 text-sm uppercase tracking-wider">Common Keys:</h4>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex justify-between bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700"><span><strong>d</strong></span> <span className="font-hindi text-lg">क</span></li>
                  <li className="flex justify-between bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700"><span><strong>x</strong></span> <span className="font-hindi text-lg">ग</span></li>
                  <li className="flex justify-between bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700"><span><strong>i</strong></span> <span className="font-hindi text-lg">प</span></li>
                  <li className="flex justify-between bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700"><span><strong>g</strong></span> <span className="font-hindi text-lg">ह</span></li>
                  <li className="flex justify-between bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700"><span><strong>e</strong></span> <span className="font-hindi text-lg">म</span></li>
                  <li className="flex justify-between bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700"><span><strong>f</strong></span> <span className="font-hindi text-lg">ि</span></li>
                </ul>
              </section>
            </div>
            
            <section>
              <div className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl p-5 border border-amber-200 dark:border-amber-800/30">
                 <h3 className="text-lg font-bold text-amber-700 dark:text-amber-500 mb-3">Important Tips</h3>
                 <ul className="space-y-3 text-amber-900 dark:text-amber-200 text-sm leading-relaxed">
                   <li className="flex gap-2">
                     <span className="font-bold">•</span>
                     <span><strong>Uppercase matters:</strong> Pressing Shift changes the character. For example, in Mangal, 'k' is क but 'K' is ख.</span>
                   </li>
                   <li className="flex gap-2">
                     <span className="font-bold">•</span>
                     <span><strong>Half letters (Halant):</strong> In Mangal, to type half letters, use 'd' (्). Example: <code>k</code> + <code>d</code> + <code>i</code> = क्ग.</span>
                   </li>
                   <li className="flex gap-2">
                     <span className="font-bold">•</span>
                     <span><strong>Browser Keyboard:</strong> Make sure your computer's physical/OS keyboard is set to standard English (US). The game handles the translation automatically.</span>
                   </li>
                 </ul>
              </div>
            </section>
         </div>
      </div>
    </div>
  );
}
