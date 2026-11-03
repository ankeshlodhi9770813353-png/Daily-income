import { RoutineTask, Goal, UserSettings, DayPerformance } from '../types/routine';

export const STORAGE_KEYS = {
  TASKS: 'ankesh_routine_tasks_v1',
  GOALS: 'ankesh_routine_goals_v1',
  SETTINGS: 'ankesh_routine_settings_v1',
  PERFORMANCE: 'ankesh_routine_performance_v1',
};

export const DEFAULT_SETTINGS: UserSettings = {
  userName: 'Ankesh Lodhi',
  theme: 'light',
  soundEnabled: true,
  soundVolume: 0.8,
  notificationsEnabled: true,
  reminderLeadTime: 5,
  morningWakeupTime: '06:00',
  nightSleepTime: '22:30',
  viewMode: 'full', // 'full' or 'mobile'
  language: 'hi',
};

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatTime12h(time24: string): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${period}`;
}

export function calculateDurationMinutes(start: string, end: string): number {
  if (!start || !end) return 30;
  const [sH, sM] = start.split(':').map(Number);
  const [eH, eM] = end.split(':').map(Number);
  let startMinutes = sH * 60 + sM;
  let endMinutes = eH * 60 + eM;
  if (endMinutes < startMinutes) {
    // Crosses midnight
    endMinutes += 24 * 60;
  }
  return Math.max(5, endMinutes - startMinutes);
}

export function generateDefaultTasks(dateStr: string): RoutineTask[] {
  return [
    {
      id: `task-1-${dateStr}`,
      title: 'प्रातः जागरण एवं गर्म पानी (Wake up & Warm Water)',
      category: 'health',
      startTime: '06:00',
      endTime: '06:30',
      durationMinutes: 30,
      date: dateStr,
      priority: 'high',
      status: 'pending',
      notes: 'दिन की सकारात्मक शुरुआत, 2 ग्लास गुनगुना पानी',
      reminderMinutesBefore: 5,
    },
    {
      id: `task-2-${dateStr}`,
      title: 'योगाभ्यास एवं शारीरिक व्यायाम (Morning Workout)',
      category: 'fitness',
      startTime: '06:30',
      endTime: '07:30',
      durationMinutes: 60,
      date: dateStr,
      priority: 'high',
      status: 'pending',
      notes: 'प्राणायाम, सूर्य नमस्कार एवं स्ट्रेंथ एक्सरसाइज',
      reminderMinutesBefore: 5,
    },
    {
      id: `task-3-${dateStr}`,
      title: 'स्नान, ध्यान एवं पूजा (Bath & Spiritual Time)',
      category: 'spiritual',
      startTime: '07:30',
      endTime: '08:15',
      durationMinutes: 45,
      date: dateStr,
      priority: 'medium',
      status: 'pending',
      notes: 'मानसिक शांति और दिन के लक्ष्यों का स्मरण',
      reminderMinutesBefore: 5,
    },
    {
      id: `task-4-${dateStr}`,
      title: 'पौष्टिक नाश्ता (Healthy Breakfast)',
      category: 'meals',
      startTime: '08:15',
      endTime: '09:00',
      durationMinutes: 45,
      date: dateStr,
      priority: 'medium',
      status: 'pending',
      notes: 'फल, अंकुरित अनाज, दूध/चाय',
      reminderMinutesBefore: 5,
    },
    {
      id: `task-5-${dateStr}`,
      title: 'मुख्य कार्य / डीप वर्क सत्र 1 (Core Focus Work / Study)',
      category: 'work',
      startTime: '09:00',
      endTime: '12:30',
      durationMinutes: 210,
      date: dateStr,
      priority: 'high',
      status: 'pending',
      notes: 'सबसे महत्वपूर्ण कार्य को बिना किसी सोशल मीडिया बाधा के पूरा करें',
      reminderMinutesBefore: 10,
    },
    {
      id: `task-6-${dateStr}`,
      title: 'दोपहर का भोजन एवं आराम (Lunch & Short Break)',
      category: 'meals',
      startTime: '12:30',
      endTime: '13:45',
      durationMinutes: 75,
      date: dateStr,
      priority: 'medium',
      status: 'pending',
      notes: 'संतुलित भोजन और 15-20 मिनट का पावर नैप',
      reminderMinutesBefore: 5,
    },
    {
      id: `task-7-${dateStr}`,
      title: 'कार्य सत्र 2 / कोडिंग व प्रोजेक्ट्स (Work Session 2)',
      category: 'study',
      startTime: '13:45',
      endTime: '17:30',
      durationMinutes: 225,
      date: dateStr,
      priority: 'high',
      status: 'pending',
      notes: 'प्रोजेक्ट डेवलपमेंट, रिव्यु एवं स्किल्स अपग्रेड',
      reminderMinutesBefore: 10,
    },
    {
      id: `task-8-${dateStr}`,
      title: 'शाम की चाय व टहलना (Evening Walk & Fresh Air)',
      category: 'personal',
      startTime: '17:30',
      endTime: '18:30',
      durationMinutes: 60,
      date: dateStr,
      priority: 'low',
      status: 'pending',
      notes: 'दोस्तों/परिवार से बातचीत, खुली हवा में घूमना',
      reminderMinutesBefore: 5,
    },
    {
      id: `task-9-${dateStr}`,
      title: 'पुस्तकालय / स्वाध्याय व ज्ञान संवर्धन (Reading Time)',
      category: 'study',
      startTime: '18:30',
      endTime: '20:00',
      durationMinutes: 90,
      date: dateStr,
      priority: 'medium',
      status: 'pending',
      notes: 'नई किताबें पढ़ना, टेक्नोलॉजी ब्लॉग्स या नोट्स बनाना',
      reminderMinutesBefore: 5,
    },
    {
      id: `task-10-${dateStr}`,
      title: 'रात्रि भोजन (Dinner)',
      category: 'meals',
      startTime: '20:00',
      endTime: '21:00',
      durationMinutes: 60,
      date: dateStr,
      priority: 'medium',
      status: 'pending',
      notes: 'हल्का सुपाच्य रात्रि भोजन',
      reminderMinutesBefore: 5,
    },
    {
      id: `task-11-${dateStr}`,
      title: 'दिन की समीक्षा और कल की योजना (Daily Review & Tomorrow Plan)',
      category: 'personal',
      startTime: '21:00',
      endTime: '21:45',
      durationMinutes: 45,
      date: dateStr,
      priority: 'high',
      status: 'pending',
      notes: 'आज के कामों का स्कोर देखना, कल का टाइमटेबल सेट करना',
      reminderMinutesBefore: 5,
    },
    {
      id: `task-12-${dateStr}`,
      title: 'विश्राम एवं गहरी नींद (Good Night Sleep)',
      category: 'rest',
      startTime: '22:00',
      endTime: '23:59',
      durationMinutes: 120,
      date: dateStr,
      priority: 'high',
      status: 'pending',
      notes: 'फोन साइलेंट करें, शांति से 7-8 घंटे की गहरी नींद',
      reminderMinutesBefore: 10,
    },
  ];
}

export const DEFAULT_GOALS: Goal[] = [
  {
    id: 'goal-1',
    title: 'दैनिक डीप वर्क व अध्ययन (7 घंटे लक्ष्य)',
    period: 'daily',
    targetValue: 7,
    currentValue: 5.5,
    unit: 'घंटे',
    completed: false,
    category: 'work',
    streakCount: 5,
  },
  {
    id: 'goal-2',
    title: 'प्रतिदिन योगा व व्यायाम (45 मिनट)',
    period: 'daily',
    targetValue: 45,
    currentValue: 45,
    unit: 'मिनट',
    completed: true,
    category: 'fitness',
    streakCount: 12,
  },
  {
    id: 'goal-3',
    title: 'सप्ताह में 6 दिन सुबह 6 बजे जागना',
    period: 'weekly',
    targetValue: 6,
    currentValue: 4,
    unit: 'दिन',
    completed: false,
    category: 'health',
    streakCount: 3,
  },
  {
    id: 'goal-4',
    title: 'साप्ताहिक नई तकनीकी स्किल / किताब पूरा करना',
    period: 'weekly',
    targetValue: 100,
    currentValue: 70,
    unit: '%',
    completed: false,
    category: 'study',
    streakCount: 2,
  },
  {
    id: 'goal-5',
    title: 'मासिक 25 दिन 80%+ रूटीन स्कोर हासिल करना',
    period: 'monthly',
    targetValue: 25,
    currentValue: 18,
    unit: 'दिन',
    completed: false,
    category: 'work',
    streakCount: 4,
  },
];

export function loadSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

export function loadTasks(): RoutineTask[] {
  if (typeof window === 'undefined') return generateDefaultTasks(getTodayDateString());
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      const initial = generateDefaultTasks(getTodayDateString());
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(initial));
      return initial;
    }
    const tasks: RoutineTask[] = JSON.parse(raw);
    const today = getTodayDateString();
    const hasTodayTasks = tasks.some(t => t.date === today);
    if (!hasTodayTasks) {
      // Automatically generate today's tasks if new day
      const todayTasks = generateDefaultTasks(today);
      const combined = [...tasks, ...todayTasks];
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(combined));
      return combined;
    }
    return tasks;
  } catch {
    return generateDefaultTasks(getTodayDateString());
  }
}

export function saveTasks(tasks: RoutineTask[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks:', err);
  }
}

export function loadGoals(): Goal[] {
  if (typeof window === 'undefined') return DEFAULT_GOALS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(DEFAULT_GOALS));
      return DEFAULT_GOALS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_GOALS;
  }
}

export function saveGoals(goals: Goal[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  } catch (err) {
    console.error('Failed to save goals:', err);
  }
}

export function exportBackupData(): string {
  const data = {
    app: 'ANKESH DAILY ROUTINE',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    settings: loadSettings(),
    tasks: loadTasks(),
    goals: loadGoals(),
  };
  return JSON.stringify(data, null, 2);
}

export function importBackupData(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !Array.isArray(parsed.tasks)) {
      return false;
    }
    if (parsed.settings) saveSettings(parsed.settings);
    if (Array.isArray(parsed.tasks)) saveTasks(parsed.tasks);
    if (Array.isArray(parsed.goals)) saveGoals(parsed.goals);
    return true;
  } catch {
    return false;
  }
}
