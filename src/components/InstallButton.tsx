import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function InstallButton({ theme }: { theme?: 'dark' | 'light' }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We no longer need the prompt. Clear it up.
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  

  return (
    <div className="mt-8 px-3">
      <button 
        onClick={handleInstallClick}
        disabled={!deferredPrompt}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed
          ${theme === 'light' 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-blue-500 text-slate-900 hover:bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
          }
        `}
      >
        <Download className="w-5 h-5" />
        <span>Install App</span>
      </button>
    </div>
  );
}
