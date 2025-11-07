import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FiverrTask, FiverrClient } from '@/types';

interface FiverrStore {
  tasks: FiverrTask[];
  clients: FiverrClient[];
  addTask: (task: FiverrTask) => void;
  updateTask: (id: string, updates: Partial<FiverrTask>) => void;
  deleteTask: (id: string) => void;
  setTasks: (tasks: FiverrTask[]) => void;
  getPendingTasks: () => FiverrTask[];
  getTasksByPriority: (priority: 'low' | 'medium' | 'high') => FiverrTask[];
  addClient: (client: FiverrClient) => void;
  updateClient: (id: string, updates: Partial<FiverrClient>) => void;
  deleteClient: (id: string) => void;
  setClients: (clients: FiverrClient[]) => void;
}

export const useFiverrStore = create<FiverrStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      clients: [],
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      setTasks: (tasks) => set({ tasks }),
      getPendingTasks: () => {
        return get().tasks.filter((t) => !t.completed);
      },
      getTasksByPriority: (priority) => {
        return get().tasks.filter((t) => t.priority === priority);
      },
      addClient: (client) =>
        set((state) => ({ clients: [...state.clients, client] })),
      updateClient: (id, updates) =>
        set((state) => ({
          clients: state.clients.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      deleteClient: (id) =>
        set((state) => ({
          clients: state.clients.filter((c) => c.id !== id),
        })),
      setClients: (clients) => set({ clients }),
    }),
    {
      name: 'fiverr-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
