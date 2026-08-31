import { Mission, SessionStats } from '../types';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

const MISSION_POOL = [
  { id: 'm1', title: 'Complete 3 Practice Tests', type: 'games_played', targetMode: 'practice', targetValue: 3, rewardXp: 50 },
  { id: 'm2', title: 'Achieve 95% Accuracy', type: 'accuracy', targetMode: 'any', targetValue: 95, rewardXp: 40 },
  { id: 'm3', title: 'Play 5 Minutes Total', type: 'time_spent', targetMode: 'any', targetValue: 300, rewardXp: 60 }, // 300 seconds
  { id: 'm4', title: 'Hit 60 WPM', type: 'wpm_target', targetMode: 'any', targetValue: 60, rewardXp: 50 },
  { id: 'm5', title: 'Play 2 Meteor Drop Games', type: 'games_played', targetMode: 'meteor', targetValue: 2, rewardXp: 40 },
  { id: 'm6', title: 'Complete 2 Neon Sprints', type: 'games_played', targetMode: 'sprint', targetValue: 2, rewardXp: 40 },
  { id: 'm7', title: 'Play 2 Bubble Shoot Games', type: 'games_played', targetMode: 'bubble', targetValue: 2, rewardXp: 40 },
  { id: 'm8', title: 'Achieve 100% Accuracy', type: 'accuracy', targetMode: 'any', targetValue: 100, rewardXp: 100 },
];

export function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export async function fetchOrCreateDailyMissions(uid: string) {
  const dateStr = getTodayDateString();
  const docRef = doc(db, 'user_missions', `${uid}_${dateStr}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().missions as Mission[];
  }

  // Randomly select 3 missions
  const shuffled = [...MISSION_POOL].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3).map(m => ({
    ...m,
    currentProgress: 0,
    isCompleted: false,
    isClaimed: false
  })) as Mission[];

  await setDoc(docRef, {
    uid,
    date: dateStr,
    missions: selected
  });

  return selected;
}

export async function updateMissionProgress(uid: string, sessionStats: SessionStats) {
  if (!uid) return;
  const dateStr = getTodayDateString();
  const docRef = doc(db, 'user_missions', `${uid}_${dateStr}`);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return;

  const missions = docSnap.data().missions as Mission[];
  let modified = false;

  const updatedMissions = missions.map((mission) => {
    if (mission.isCompleted) return mission;
    
    // Check mode
    if (mission.targetMode !== 'any' && mission.targetMode !== sessionStats.mode) {
      return mission;
    }

    let progressIncrement = 0;
    let newValue = mission.currentProgress;

    switch (mission.type) {
      case 'games_played':
        progressIncrement = 1;
        break;
      case 'time_spent':
        progressIncrement = sessionStats.timeSpent;
        break;
      case 'accuracy':
        if (sessionStats.accuracy >= mission.targetValue) {
          newValue = mission.targetValue;
        }
        break;
      case 'wpm_target':
        if (sessionStats.wpm >= mission.targetValue) {
          newValue = mission.targetValue;
        }
        break;
    }

    if (progressIncrement > 0) {
      newValue += progressIncrement;
    }

    if (newValue > mission.currentProgress) {
      modified = true;
      const isCompleted = newValue >= mission.targetValue;
      return {
        ...mission,
        currentProgress: isCompleted ? mission.targetValue : newValue,
        isCompleted
      };
    }

    return mission;
  });

  if (modified) {
    await updateDoc(docRef, { missions: updatedMissions });
  }
}

export async function claimMissionReward(uid: string, missionId: string, rewardXp: number) {
  const dateStr = getTodayDateString();
  const docRef = doc(db, 'user_missions', `${uid}_${dateStr}`);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;
  const missions = docSnap.data().missions as Mission[];
  
  const updatedMissions = missions.map(m => {
    if (m.id === missionId && m.isCompleted && !m.isClaimed) {
      return { ...m, isClaimed: true };
    }
    return m;
  });

  await updateDoc(docRef, { missions: updatedMissions });
  
  const userRef = doc(db, 'users', uid);
  // Ensure user doc exists
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, { totalXp: rewardXp, createdAt: Date.now() }, { merge: true });
  } else {
    await updateDoc(userRef, { totalXp: increment(rewardXp) });
  }
  
  return updatedMissions;
}
