export interface Housemate {
  id: string;
  name: string;
  color: string;
  avatar?: string;
}

export interface CleaningTask {
  id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  icon?: string;
}

export interface TaskAssignment {
  id: string;
  taskId: string;
  housemateId: string;
  weekStartDate: string; // ISO date string for the week this assignment is for
  completed: boolean;
  completedAt?: string; // ISO date string
}

export interface CompletionHistory {
  id: string;
  taskId: string;
  housemateId: string;
  completedAt: string;
  weekStartDate: string;
}

export type Theme = 'purple' | 'blue' | 'pink' | 'green' | 'sunset';

export interface AppSettings {
  theme: Theme;
  rotationDay: number; // 0-6, where 0 is Sunday
}
