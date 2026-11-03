export type TaskCategory = 
  | 'work' 
  | 'study' 
  | 'fitness' 
  | 'health' 
  | 'personal' 
  | 'spiritual' 
  | 'meals' 
  | 'rest' 
  | 'other';

export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'skipped';

export interface RoutineTask {
  id: string;
  title: string;
  category: TaskCategory;
  startTime: string; // "06:00" in 24h format
  endTime: string;   // "07:00" in 24h format
  durationMinutes: number; // e.g. 60
  date: string;      // "YYYY-MM-DD"
  priority: TaskPriority;
  status: TaskStatus;
  notes?: string;
  reminderMinutesBefore: number; // 0 = at time, 5, 10, 15
  completedAt?: string; // ISO string
}

export type GoalPeriod = 'daily' | 'weekly' | 'monthly';

export interface Goal {
  id: string;
  title: string;
  period: GoalPeriod;
  targetValue: number;
  currentValue: number;
  unit: string; // e.g. "घंटे", "दिन", "कि.मी.", "टास्क"
  completed: boolean;
  category: TaskCategory;
  streakCount: number;
  dueDate?: string;
}

export interface DayPerformance {
  date: string; // "YYYY-MM-DD"
  totalTasks: number;
  completedTasks: number;
  skippedTasks: number;
  totalPlannedMinutes: number;
  completedMinutes: number;
  scorePercentage: number;
}

export interface UserSettings {
  userName: string;
  theme: 'light' | 'dark' | 'system';
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  notificationsEnabled: boolean;
  reminderLeadTime: number; // minutes before task (0, 5, 10, 15)
  morningWakeupTime: string; // "06:00"
  nightSleepTime: string; // "23:00"
  viewMode: 'mobile' | 'full'; // Android phone mockup or full screen
  language: 'hi' | 'en';
}

export interface CategoryMeta {
  id: TaskCategory;
  labelHi: string;
  labelEn: string;
  icon: string;
  color: string;
  bgLight: string;
  textLight: string;
}

export const CATEGORIES_CONFIG: Record<TaskCategory, CategoryMeta> = {
  work: {
    id: 'work',
    labelHi: 'काम / ऑफिस',
    labelEn: 'Work & Business',
    icon: 'Briefcase',
    color: '#2563EB',
    bgLight: 'bg-blue-50 text-blue-700 border-blue-200',
    textLight: 'text-blue-600',
  },
  study: {
    id: 'study',
    labelHi: 'पढ़ाई / अध्ययन',
    labelEn: 'Study & Learning',
    icon: 'BookOpen',
    color: '#4F46E5',
    bgLight: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    textLight: 'text-indigo-600',
  },
  fitness: {
    id: 'fitness',
    labelHi: 'व्यायाम / योग',
    labelEn: 'Workout & Fitness',
    icon: 'Dumbbell',
    color: '#059669',
    bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    textLight: 'text-emerald-600',
  },
  health: {
    id: 'health',
    labelHi: 'स्वास्थ्य एवं देखभाल',
    labelEn: 'Health & Care',
    icon: 'HeartPulse',
    color: '#E11D48',
    bgLight: 'bg-rose-50 text-rose-700 border-rose-200',
    textLight: 'text-rose-600',
  },
  spiritual: {
    id: 'spiritual',
    labelHi: 'पूजा / ध्यान',
    labelEn: 'Meditation & Prayer',
    icon: 'Sparkles',
    color: '#D97706',
    bgLight: 'bg-amber-50 text-amber-700 border-amber-200',
    textLight: 'text-amber-600',
  },
  meals: {
    id: 'meals',
    labelHi: 'भोजन / नाश्ता',
    labelEn: 'Meals & Food',
    icon: 'Utensils',
    color: '#EA580C',
    bgLight: 'bg-orange-50 text-orange-700 border-orange-200',
    textLight: 'text-orange-600',
  },
  personal: {
    id: 'personal',
    labelHi: 'व्यक्तिगत कार्य',
    labelEn: 'Personal Time',
    icon: 'User',
    color: '#0284C7',
    bgLight: 'bg-sky-50 text-sky-700 border-sky-200',
    textLight: 'text-sky-600',
  },
  rest: {
    id: 'rest',
    labelHi: 'विश्राम / नींद',
    labelEn: 'Rest & Sleep',
    icon: 'Moon',
    color: '#6366F1',
    bgLight: 'bg-violet-50 text-violet-700 border-violet-200',
    textLight: 'text-violet-600',
  },
  other: {
    id: 'other',
    labelHi: 'अन्य कार्य',
    labelEn: 'Other Routine',
    icon: 'CheckSquare',
    color: '#64748B',
    bgLight: 'bg-slate-100 text-slate-700 border-slate-200',
    textLight: 'text-slate-600',
  },
};
