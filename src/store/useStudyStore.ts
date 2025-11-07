import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StudySession, StudyType, StudyProgress } from '@/types';

interface StudyStore {
  sessions: StudySession[];
  addSession: (session: StudySession) => void;
  updateSession: (id: string, updates: Partial<StudySession>) => void;
  deleteSession: (id: string) => void;
  setSessions: (sessions: StudySession[]) => void;
  getSessionsByType: (type: StudyType) => StudySession[];
  getTotalHours: (type: StudyType) => number;
  getProgress: () => StudyProgress;
}

export const useStudyStore = create<StudyStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      addSession: (session) =>
        set((state) => ({ sessions: [...state.sessions, session] })),
      updateSession: (id, updates) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),
      deleteSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
        })),
      setSessions: (sessions) => set({ sessions }),
      getSessionsByType: (type) => {
        return get().sessions.filter((s) => s.type === type);
      },
      getTotalHours: (type) => {
        const sessions = get().getSessionsByType(type);
        const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
        return totalMinutes / 60;
      },
      getProgress: () => {
        const totalEnglishHours = get().getTotalHours('ingles');
        const totalMPHours = get().getTotalHours('concurso');
        const weeklyGoal = 20; // hours

        // Calculate current week progress
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const currentWeekSessions = get().sessions.filter((s) => {
          const sessionDate = new Date(s.date);
          return sessionDate >= startOfWeek;
        });
        const currentWeekMinutes = currentWeekSessions.reduce(
          (sum, s) => sum + s.duration,
          0
        );

        return {
          totalEnglishHours,
          totalMPHours,
          weeklyGoal,
          currentWeekProgress: currentWeekMinutes / 60,
        };
      },
    }),
    {
      name: 'study-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
