import React, { useEffect, useState } from 'react';
import { Mission } from '../types';
import { useAuth } from '../hooks/useAuth';
import { fetchOrCreateDailyMissions, claimMissionReward } from '../utils/missions';
import { Target, Gift, CheckCircle, Clock, ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function DailyMissions() {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setMissions([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    fetchOrCreateDailyMissions(user.uid)
      .then((data) => {
        if (isMounted) {
          setMissions(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Error fetching missions", err);
        setLoading(false);
      });

    return () => { isMounted = false; };
  }, [user]);

  const handleClaim = async (missionId: string, rewardXp: number) => {
    if (!user) return;
    try {
      const updated = await claimMissionReward(user.uid, missionId, rewardXp);
      if (updated) {
        setMissions(updated);
        toast.success(`Claimed ${rewardXp} XP!`, { icon: '✨' });
      }
    } catch (error) {
      console.error("Error claiming reward", error);
      toast.error('Failed to claim reward');
    }
  };

  if (loading || !user) return null;

  const uncompletedMissions = missions.filter(m => !m.isClaimed).length;

  return (
    <div className="glass-panel rounded-3xl w-full max-w-sm flex flex-col shadow-xl border border-blue-500/10 overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
             <Target className="w-6 h-6 text-blue-500" />
             {uncompletedMissions > 0 && (
               <span className="absolute -top-1 -right-1 flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
               </span>
             )}
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Daily Missions</h2>
        </div>
        <div className="flex items-center gap-3">
          {!isOpen && uncompletedMissions > 0 && (
            <span className="text-xs font-bold px-2 py-1 bg-red-500/10 text-red-500 rounded-full">
              {uncompletedMissions} Pending
            </span>
          )}
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="p-5 pt-0 flex flex-col gap-4 border-t border-slate-200/10 dark:border-slate-700/50 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs font-semibold px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full">
              Resets at Midnight
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {missions.map((mission) => {
              let progressPercent = (mission.currentProgress / mission.targetValue) * 100;
              if (progressPercent > 100) progressPercent = 100;
              
              return (
                <div key={mission.id} className={`p-4 rounded-2xl border transition-all ${
                  mission.isClaimed 
                    ? 'bg-green-500/5 border-green-500/20' 
                    : mission.isCompleted 
                      ? 'bg-blue-500/5 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                      : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {mission.title}
                    </div>
                    <div className="flex items-center text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full shrink-0 ml-2">
                      <Gift className="w-3 h-3 mr-1" /> {mission.rewardXp} XP
                    </div>
                  </div>
                  
                  {!mission.isCompleted && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
                        <span>
                          {mission.type === 'time_spent' 
                            ? `${Math.floor(mission.currentProgress / 60)}m / ${Math.floor(mission.targetValue / 60)}m`
                            : `${mission.currentProgress} / ${mission.targetValue}`
                          }
                        </span>
                        <span>{Math.floor(progressPercent)}%</span>
                      </div>
                      <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" 
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {mission.isCompleted && !mission.isClaimed && (
                    <button 
                      onClick={() => handleClaim(mission.id, mission.rewardXp)}
                      className="w-full mt-2 py-2 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl text-sm transition-all shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                    >
                      Claim Reward
                    </button>
                  )}

                  {mission.isClaimed && (
                    <div className="w-full mt-2 py-1.5 flex items-center justify-center gap-1 text-green-500 font-bold text-sm">
                      <CheckCircle className="w-4 h-4" /> Claimed
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
