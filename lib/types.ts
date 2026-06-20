export type Category = 'study' | 'revision' | 'practice' | 'research' | 'assignment' | 'other';
export type Priority = 'high' | 'med' | 'low';

export interface Subtask {
  name: string;
  done: boolean;
}

export interface Task {
  id: string;
  name: string;
  category: Category;
  hours: number;
  priority: Priority;
  done: boolean;
  subtasks: Subtask[];
  createdAt: string;
}

export interface Goals {
  dailyHours: number;
  weeklyTasks: number;
  monthlyHours: number;
  categories: Category[];
  description: string;
}

export interface AppData {
  tasks: Record<string, Task[]>;
  hourTargets: Record<string, number>;
  goals: Goals;
}

export const DEFAULT_DATA: AppData = {
  tasks: {},
  hourTargets: {},
  goals: {
    dailyHours: 8,
    weeklyTasks: 20,
    monthlyHours: 200,
    categories: ['study', 'revision', 'practice'],
    description: '',
  },
};

export const CATEGORY_LABELS: Record<Category, string> = {
  study: 'Study',
  revision: 'Revision',
  practice: 'Practice',
  research: 'Research',
  assignment: 'Assignment',
  other: 'Other',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  study: '#4F46E5',
  revision: '#D97706',
  practice: '#16A34A',
  research: '#0891B2',
  assignment: '#DC2626',
  other: '#6B6B6B',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: 'High',
  med: 'Medium',
  low: 'Low',
};

export const PRIORITY_DOT: Record<Priority, string> = {
  high: '#DC2626',
  med: '#D97706',
  low: '#16A34A',
};
