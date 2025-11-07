export type StudyType = 'ingles' | 'concurso';

export interface StudySession {
  id: string;
  type: StudyType;
  duration: number; // in minutes
  date: string;
  topic?: string;
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudyProgress {
  totalEnglishHours: number;
  totalMPHours: number;
  weeklyGoal: number;
  currentWeekProgress: number;
}
