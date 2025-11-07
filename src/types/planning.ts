export interface DailyChecklist {
  id: string;
  date: string;
  salesCount: number;
  buyerRequestsResponded: number;
  clientMessagesAnswered: boolean;
  projectsTested: boolean;
  readmeUpdated: boolean;
  reviewRequested: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyGoal {
  id: string;
  weekNumber: number; // 1-4
  year: number;
  gigsCreated: number;
  salesTarget: number;
  salesAchieved: number;
  reviewsTarget: number;
  reviewsAchieved: number;
  revenueTarget: number;
  revenueAchieved: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BuyerRequest {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  responded: boolean;
  won: boolean;
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface WeeklySchedule {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}
