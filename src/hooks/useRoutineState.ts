import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  RoutineTask,
  Goal,
  UserSettings,
  DayPerformance,
  TaskStatus,
} from '../types/routine';
import {
  loadTasks,
  saveTasks,
  loadGoals,
  saveGoals,
  loadSettings,
  saveSettings,
  getTodayDateString,
  generateDefaultTasks,
  calculateDurationMinutes,
} from '../utils/storage';
import { soundManager, sendBrowserNotification } from '../utils/audio';
import confetti from 'canvas-confetti';

export function useRoutineState() {
  const [tasks, setTasks] = useState<RoutineTask[]>(() => loadTasks());
  const [goals, setGoals] = useState<Goal[]>(() => loadGoals());
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings());
  const [selectedDate, setSelectedDate] = useState<string>(() => getTodayDateString());
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [activeAlert, setActiveAlert] = useState<{ task: RoutineTask; message: string } | null>(null);

  const alertedTasksRef = useRef<Set<string>>(new Set());

  // Update soundManager config when settings change
  useEffect(() => {
    soundManager.setConfig(settings.soundEnabled, settings.soundVolume);
  }, [settings.soundEnabled, settings.soundVolume]);

  // Keep tasks synced to localStorage
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Keep goals synced to localStorage
  useEffect(() => {
    saveGoals(goals);
  }, [goals]);

  // Keep settings synced to localStorage and apply theme class
  useEffect(() => {
    saveSettings(settings);
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Live timer tick every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Filter tasks for the currently selected date, sorted by startTime
  const selectedDateTasks = useMemo(() => {
    return tasks
      .filter((t) => t.date === selectedDate)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [tasks, selectedDate]);

  // Today's tasks specifically
  const todayDateStr = getTodayDateString();
  const todayTasks = useMemo(() => {
    return tasks
      .filter((t) => t.date === todayDateStr)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [tasks, todayDateStr]);

  // Current time in "HH:MM" 24h string
  const currentTimeString = useMemo(() => {
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }, [currentTime]);

  // Identify currently active task based on time (for today)
  const currentActiveTask = useMemo(() => {
    if (selectedDate !== todayDateStr) return null;
    return (
      todayTasks.find((task) => {
        return (
          currentTimeString >= task.startTime &&
          currentTimeString < task.endTime &&
          task.status !== 'completed' &&
          task.status !== 'skipped'
        );
      }) || null
    );
  }, [todayTasks, currentTimeString, selectedDate, todayDateStr]);

  // Next upcoming pending task
  const nextUpcomingTask = useMemo(() => {
    if (selectedDate !== todayDateStr) return null;
    return (
      todayTasks.find((task) => {
        return (
          currentTimeString < task.startTime &&
          task.status !== 'completed' &&
          task.status !== 'skipped'
        );
      }) || null
    );
  }, [todayTasks, currentTimeString, selectedDate, todayDateStr]);

  // Automated notification and audio chime checks
  useEffect(() => {
    if (!settings.notificationsEnabled && !settings.soundEnabled) return;

    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    todayTasks.forEach((task) => {
      if (task.status === 'completed' || task.status === 'skipped') return;

      const [sH, sM] = task.startTime.split(':').map(Number);
      const startMinutes = sH * 60 + sM;
      const diffMinutes = startMinutes - currentMinutes;

      // 1. Reminder lead time chime (e.g. 5 minutes before)
      const leadTime = task.reminderMinutesBefore ?? settings.reminderLeadTime;
      const reminderKey = `reminder-${task.id}-${todayDateStr}`;

      if (leadTime > 0 && diffMinutes === leadTime && !alertedTasksRef.current.has(reminderKey)) {
        alertedTasksRef.current.add(reminderKey);
        soundManager.playReminderSound();
        const msg = `अलर्ट: ${task.title} शुरू होने में ${leadTime} मिनट शेष हैं!`;
        setActiveAlert({ task, message: msg });
        sendBrowserNotification('⏰ आगामी कार्य रिमाइंडर', msg);
      }

      // 2. Start time chime
      const startKey = `start-${task.id}-${todayDateStr}`;
      if (diffMinutes === 0 && !alertedTasksRef.current.has(startKey)) {
        alertedTasksRef.current.add(startKey);
        soundManager.playReminderSound();
        const msg = `समय हो गया: ${task.title} का समय शुरू हो चुका है!`;
        setActiveAlert({ task, message: msg });
        sendBrowserNotification('🚀 कार्य प्रारंभ अलर्ट', msg);
      }
    });
  }, [todayTasks, currentTime, settings, todayDateStr]);

  // Day Performance metrics for selected date
  const performance: DayPerformance = useMemo(() => {
    const list = selectedDateTasks;
    const totalTasks = list.length;
    const completedTasks = list.filter((t) => t.status === 'completed').length;
    const skippedTasks = list.filter((t) => t.status === 'skipped').length;
    
    let totalPlannedMinutes = 0;
    let completedMinutes = 0;

    list.forEach((t) => {
      totalPlannedMinutes += t.durationMinutes || 30;
      if (t.status === 'completed') {
        completedMinutes += t.durationMinutes || 30;
      }
    });

    const scorePercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      date: selectedDate,
      totalTasks,
      completedTasks,
      skippedTasks,
      totalPlannedMinutes,
      completedMinutes,
      scorePercentage,
    };
  }, [selectedDateTasks, selectedDate]);

  // Helper for performance across past 7 days
  const weeklyHistory = useMemo(() => {
    const days: DayPerformance[] = [];
    const base = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(base.getDate() - i);
      const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;

      const dayTasks = tasks.filter((t) => t.date === dStr);
      const total = dayTasks.length;
      const completed = dayTasks.filter((t) => t.status === 'completed').length;
      const skipped = dayTasks.filter((t) => t.status === 'skipped').length;

      let plannedM = 0;
      let completedM = 0;
      dayTasks.forEach((t) => {
        plannedM += t.durationMinutes || 30;
        if (t.status === 'completed') completedM += t.durationMinutes || 30;
      });

      days.push({
        date: dStr,
        totalTasks: total,
        completedTasks: completed,
        skippedTasks: skipped,
        totalPlannedMinutes: plannedM,
        completedMinutes: completedM,
        scorePercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      });
    }

    return days;
  }, [tasks]);

  // Actions
  const addTask = useCallback((taskData: Omit<RoutineTask, 'id'>) => {
    const newTask: RoutineTask = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      durationMinutes: calculateDurationMinutes(taskData.startTime, taskData.endTime),
    };
    setTasks((prev) => [...prev, newTask]);
    soundManager.playTapSound();
  }, []);

  const updateTask = useCallback((updated: RoutineTask) => {
    const duration = calculateDurationMinutes(updated.startTime, updated.endTime);
    setTasks((prev) =>
      prev.map((t) => (t.id === updated.id ? { ...updated, durationMinutes: duration } : t))
    );
    soundManager.playTapSound();
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    soundManager.playTapSound();
  }, []);

  const toggleTaskStatus = useCallback((taskId: string, targetStatus?: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const newStatus: TaskStatus =
          targetStatus !== undefined
            ? targetStatus
            : t.status === 'completed'
            ? 'pending'
            : 'completed';

        if (newStatus === 'completed') {
          soundManager.playCompleteSound();
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#2563EB', '#60A5FA', '#10B981', '#F59E0B'],
            });
          } catch {
            // ignore
          }
        } else {
          soundManager.playTapSound();
        }

        return {
          ...t,
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
        };
      })
    );
  }, []);

  const copyRoutineToDate = useCallback((fromDate: string, targetDate: string) => {
    const sourceTasks = tasks.filter((t) => t.date === fromDate);
    if (sourceTasks.length === 0) return;

    const cloned: RoutineTask[] = sourceTasks.map((t) => ({
      ...t,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      date: targetDate,
      status: 'pending',
      completedAt: undefined,
    }));

    // Remove existing tasks on target date first to avoid overlap, or combine
    setTasks((prev) => [...prev.filter((t) => t.date !== targetDate), ...cloned]);
    soundManager.playTapSound();
  }, [tasks]);

  const loadDefaultRoutineForDate = useCallback((dateStr: string) => {
    const defaults = generateDefaultTasks(dateStr);
    setTasks((prev) => [...prev.filter((t) => t.date !== dateStr), ...defaults]);
    soundManager.playTapSound();
  }, []);

  // Goal handlers
  const addGoal = useCallback((goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: `goal-${Date.now()}`,
    };
    setGoals((prev) => [...prev, newGoal]);
    soundManager.playTapSound();
  }, []);

  const updateGoal = useCallback((updated: Goal) => {
    setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
    soundManager.playTapSound();
  }, []);

  const deleteGoal = useCallback((goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
    soundManager.playTapSound();
  }, []);

  const incrementGoalProgress = useCallback((goalId: string, delta: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const nextVal = Math.min(g.targetValue, Math.max(0, g.currentValue + delta));
        const completed = nextVal >= g.targetValue;
        if (completed && !g.completed) {
          soundManager.playCompleteSound();
          try {
            confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
          } catch {
            // ignore
          }
        }
        return {
          ...g,
          currentValue: Number(nextVal.toFixed(1)),
          completed,
          streakCount: completed ? g.streakCount + 1 : g.streakCount,
        };
      })
    );
  }, []);

  // Settings
  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  return {
    tasks,
    selectedDateTasks,
    todayTasks,
    goals,
    settings,
    selectedDate,
    setSelectedDate,
    currentTime,
    currentTimeString,
    currentActiveTask,
    nextUpcomingTask,
    activeAlert,
    setActiveAlert,
    performance,
    weeklyHistory,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    copyRoutineToDate,
    loadDefaultRoutineForDate,
    addGoal,
    updateGoal,
    deleteGoal,
    incrementGoalProgress,
    updateSettings,
    setTasks,
    setGoals,
  };
}
