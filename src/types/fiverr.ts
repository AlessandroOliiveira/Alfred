export type TaskPriority = 'low' | 'medium' | 'high';

export interface FiverrTask {
  id: string;
  title: string;
  client: string;
  deadline: string;
  completed: boolean;
  priority: TaskPriority;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FiverrClient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  projects: number;
  totalRevenue: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
