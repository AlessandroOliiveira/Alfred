import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyChecklist, WeeklyGoal, BuyerRequest } from '@/types';

interface PlanningStore {
  // Daily Checklists
  checklists: DailyChecklist[];
  addChecklist: (checklist: DailyChecklist) => void;
  updateChecklist: (id: string, updates: Partial<DailyChecklist>) => void;
  getTodayChecklist: () => DailyChecklist | undefined;

  // Weekly Goals
  weeklyGoals: WeeklyGoal[];
  addWeeklyGoal: (goal: WeeklyGoal) => void;
  updateWeeklyGoal: (id: string, updates: Partial<WeeklyGoal>) => void;
  getCurrentWeekGoal: () => WeeklyGoal | undefined;

  // Buyer Requests
  buyerRequests: BuyerRequest[];
  addBuyerRequest: (request: BuyerRequest) => void;
  updateBuyerRequest: (id: string, updates: Partial<BuyerRequest>) => void;
  deleteBuyerRequest: (id: string) => void;
}

export const usePlanningStore = create<PlanningStore>()(
  persist(
    (set, get) => ({
      checklists: [],
      weeklyGoals: [],
      buyerRequests: [],

      // Daily Checklist
      addChecklist: (checklist) =>
        set((state) => ({ checklists: [...state.checklists, checklist] })),

      updateChecklist: (id, updates) =>
        set((state) => ({
          checklists: state.checklists.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      getTodayChecklist: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().checklists.find((c) => c.date.startsWith(today));
      },

      // Weekly Goals
      addWeeklyGoal: (goal) =>
        set((state) => ({ weeklyGoals: [...state.weeklyGoals, goal] })),

      updateWeeklyGoal: (id, updates) =>
        set((state) => ({
          weeklyGoals: state.weeklyGoals.map((g) =>
            g.id === id ? { ...g, ...updates } : g
          ),
        })),

      getCurrentWeekGoal: () => {
        const now = new Date();
        const year = now.getFullYear();
        const weekNumber = Math.ceil(
          ((now.getTime() - new Date(year, 0, 1).getTime()) / 86400000 +
          new Date(year, 0, 1).getDay() + 1) / 7
        );
        return get().weeklyGoals.find(
          (g) => g.year === year && g.weekNumber === weekNumber
        );
      },

      // Buyer Requests
      addBuyerRequest: (request) =>
        set((state) => ({
          buyerRequests: [...state.buyerRequests, request],
        })),

      updateBuyerRequest: (id, updates) =>
        set((state) => ({
          buyerRequests: state.buyerRequests.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),

      deleteBuyerRequest: (id) =>
        set((state) => ({
          buyerRequests: state.buyerRequests.filter((r) => r.id !== id),
        })),
    }),
    {
      name: 'planning-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
