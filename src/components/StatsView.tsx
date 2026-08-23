import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { SessionStats } from '../types';
import { auth, db } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import confetti from 'canvas-confetti';
import { Trophy } from 'lucide-react';

interface StatsViewProps {
  lastSession: SessionStats | null;
  onAction?: (action: 'home' | 'restart') => void;
}

export default function StatsView({ lastSession, onAction }: StatsViewProps) {
  const [history, setHistory] = useState<SessionStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    let fetchedHistory: SessionStats[] = [];
    
    if (user) {
      const fetchHistory = async () => {
        setLoading(true);
        try {
          const q = query(
            collection(db, 'users', user.uid, 'sessions'),
            orderBy('createdAt', 'desc'),
            limit(20)
          );
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map(doc => doc.data() as SessionStats);
          fetchedHistory = data.reverse();
          setHistory(fetchedHistory);
          
          if (lastSession) {
            // Check for new record: max WPM in previous history
            // We ignore the very latest one if it's the current session being saved
            // To be safe, just compare lastSession.wpm with all previous ones.
            const previousMax = fetchedHistory.reduce((max, s) => {
              // Note: since the last session might already be in history if it saved quickly,
              // we can just check if lastSession.wpm >= previous max. 
              // Actually, we should find the max of all sessions except the current one if possible,
              // but since they all have timestamps, let's just do a simple max of fetched WPMs.
              return Math.max(max, s.wpm);
            }, 0);
            
            if (lastSession.wpm > 0 && lastSession.wpm >= previousMax) {
              setIsNewRecord(true);
              triggerConfetti();
            } else if (fetchedHistory.length <= 1 && lastSession.wpm > 0) {
              setIsNewRecord(true); // First run is a record
              triggerConfetti();
            }
          }
        } catch (error) {
          console.error('Error fetching history:', error);
          toast.error('Could not load your history. Please check your connection.');
        }
        setLoading(false);
      };
      fetchHistory();
    } else {
      if (lastSession && lastSession.wpm > 0) {
        // Without user, always a "new record" just for fun
        setIsNewRecord(true);
        triggerConfetti();
      }
    }
  }, [user, lastSession]);

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random(), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-16">
      {lastSession && (
        <div className="glass-panel p-6 sm:p-10 rounded-3xl animate-fade-in relative overflow-hidden shadow-xl border border-blue-500/30">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-sky-500 to-blue-500 opacity-50"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
             <div>
               <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-3">
                 Session Complete 
                 {isNewRecord && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-500 text-sm rounded-full border border-yellow-500/50 animate-bounce">
                      <Trophy className="w-4 h-4" /> New Record!
                    </span>
                 )}
               </h2>
               <p className="text-slate-500 dark:text-slate-400 mt-2">
                 Great job, {user?.displayName || 'Guest'}! Here's how you did.
               </p>
             </div>
             <div className="text-right">
                <div className="text-5xl font-bold text-slate-900 dark:text-white drop-shadow-md">{Math.round(lastSession.wpm)} <span className="text-xl text-slate-500">WPM</span></div>
                <div className="text-xl text-sky-600 dark:text-sky-400 font-semibold">{Math.round(lastSession.accuracy)}% Accuracy</div>
             </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-black/5 dark:bg-white/5 rounded-xl text-center border border-black/10 dark:border-white/10">
              <div className="text-sm text-slate-500 dark:text-slate-400">Mode</div>
              <div className="text-xl font-bold capitalize">{lastSession.mode}</div>
            </div>
            <div className="p-4 bg-black/5 dark:bg-white/5 rounded-xl text-center border border-black/10 dark:border-white/10">
              <div className="text-sm text-slate-500 dark:text-slate-400">Time</div>
              <div className="text-xl font-bold">{lastSession.timeSpent}s</div>
            </div>
            <div className="p-4 bg-black/5 dark:bg-white/5 rounded-xl text-center border border-black/10 dark:border-white/10">
              <div className="text-sm text-slate-500 dark:text-slate-400">Errors</div>
              <div className="text-xl font-bold text-red-500">{lastSession.errorCount}</div>
            </div>
            <div className="p-4 bg-black/5 dark:bg-white/5 rounded-xl text-center border border-black/10 dark:border-white/10">
              <div className="text-sm text-slate-500 dark:text-slate-400">Backspaces</div>
              <div className="text-xl font-bold text-orange-500">{lastSession.backspaceCount}</div>
            </div>
          </div>
          
          {Object.keys(lastSession.wordStats || {}).length > 0 && (
             <div className="p-4 bg-black/5 dark:bg-white/5 rounded-xl max-h-48 overflow-y-auto border border-black/10 dark:border-white/10">
                 <h3 className="font-bold mb-2">Word Stats (ms/errors)</h3>
                 <div className="flex flex-wrap gap-2">
                     {Object.entries(lastSession.wordStats).map(([word, stat]) => (
                         <span key={word} className="text-xs bg-black/10 dark:bg-white/10 px-2 py-1 rounded">
                             {word} ({stat.timeSpent}ms / {stat.errors}e)
                         </span>
                     ))}
                 </div>
             </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
             <button onClick={() => onAction && onAction('restart')} className="px-8 py-3 bg-blue-500 text-slate-900 rounded-full font-bold hover:bg-blue-400 transition-colors w-full sm:w-auto shadow-md">
               Try Again
             </button>
             <button onClick={() => onAction && onAction('home')} className="px-8 py-3 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors w-full sm:w-auto shadow-md">
               Go to Homepage
             </button>
          </div>
        </div>
      )}

      <div className="glass-panel p-6 sm:p-10 rounded-3xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-2xl font-bold mb-6">
           {user ? 'Your Progress History' : 'Log in to save history'}
        </h2>
        
        {user ? (
           loading ? (
             <div className="text-center py-12 text-slate-500">Loading history...</div>
           ) : history.length > 0 ? (
             <div className="flex flex-col gap-12">
               <div className="w-full overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
                 <div className="h-[300px] sm:h-[400px] min-w-[600px] sm:min-w-0 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={history.map(s => {
                     let dateObj = new Date();
                     if (s.createdAt) {
                       if (typeof (s.createdAt as any).toDate === 'function') {
                         dateObj = (s.createdAt as any).toDate();
                       } else if (typeof s.createdAt === 'number') {
                         dateObj = new Date(s.createdAt);
                       }
                     }
                     return { ...s, date: format(dateObj, 'MMM dd, HH:mm') };
                   })}>
                     <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                     <XAxis dataKey="date" stroke="currentColor" opacity={0.5} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} minTickGap={20} tickMargin={10} />
                     <YAxis stroke="currentColor" opacity={0.5} axisLine={false} tickLine={false} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                     />
                     <Line type="monotone" dataKey="wpm" name="WPM" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 8 }} />
                     <Line type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#0ea5e9" strokeWidth={4} dot={{ r: 4, fill: '#0ea5e9' }} />
                   </LineChart>
                 </ResponsiveContainer>
                 </div>
               </div>
               
               <div>
                 <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">Recent Sessions</h3>
                 <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                     <thead>
                       <tr className="border-b border-slate-200 dark:border-slate-800">
                         <th className="p-3 text-sm font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                         <th className="p-3 text-sm font-semibold text-slate-500 uppercase tracking-wider">Mode</th>
                         <th className="p-3 text-sm font-semibold text-slate-500 uppercase tracking-wider">WPM</th>
                         <th className="p-3 text-sm font-semibold text-slate-500 uppercase tracking-wider">Accuracy</th>
                         <th className="p-3 text-sm font-semibold text-slate-500 uppercase tracking-wider">Time</th>
                       </tr>
                     </thead>
                     <tbody>
                       {[...history].reverse().slice(0, 10).map((s, i) => {
                         let dateObj = new Date();
                         if (s.createdAt) {
                           if (typeof (s.createdAt as any).toDate === 'function') {
                             dateObj = (s.createdAt as any).toDate();
                           } else if (typeof s.createdAt === 'number') {
                             dateObj = new Date(s.createdAt);
                           }
                         }
                         return (
                           <tr key={i} className="border-b border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                             <td className="p-3 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">{format(dateObj, 'MMM dd, HH:mm')}</td>
                             <td className="p-3 text-sm capitalize text-slate-700 dark:text-slate-300">{s.mode}</td>
                             <td className="p-3 text-sm font-bold text-slate-900 dark:text-slate-100">{Math.round(s.wpm)}</td>
                             <td className="p-3 text-sm font-bold text-slate-700 dark:text-slate-300">{Math.round(s.accuracy)}%</td>
                             <td className="p-3 text-sm text-slate-600 dark:text-slate-400">{s.timeSpent}s</td>
                           </tr>
                         )
                       })}
                     </tbody>
                   </table>
                 </div>
               </div>
             </div>
           ) : (
             <div className="text-center py-12 text-slate-500">No session history found. Complete a practice session to see your progress!</div>
           )
        ) : (
           <div className="text-center py-12 text-slate-500">
              Create an account or log in to track your WPM and accuracy over time.
           </div>
        )}
      </div>
    </div>
  );
}
