import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RoutineItem } from '@/types';

interface RoutineStore {
  routine: RoutineItem[];
  addRoutineItem: (item: RoutineItem) => void;
  updateRoutineItem: (id: string, updates: Partial<RoutineItem>) => void;
  deleteRoutineItem: (id: string) => void;
  markCompleted: (id: string) => void;
  setRoutine: (routine: RoutineItem[]) => void;
  getTodayRoutine: () => RoutineItem[];
}

export const useRoutineStore = create<RoutineStore>()(
  persist(
    (set, get) => ({
      routine: [],
      addRoutineItem: (item) =>
        set((state) => ({ routine: [...state.routine, item] })),
      updateRoutineItem: (id, updates) =>
        set((state) => ({
          routine: state.routine.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),
      deleteRoutineItem: (id) =>
        set((state) => ({
          routine: state.routine.filter((item) => item.id !== id),
        })),
      markCompleted: (id) =>
        set((state) => ({
          routine: state.routine.map((item) =>
            item.id === id ? { ...item, completed: true } : item
          ),
        })),
      setRoutine: (routine) => set({ routine }),
      getTodayRoutine: () => {
        return get().routine;
      },
    }),
    {
      name: 'routine-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
