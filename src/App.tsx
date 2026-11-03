import React, { useState } from 'react';
import { 
  Wifi, 
  Battery, 
  Signal, 
  Plus, 
  Smartphone, 
  Check, 
  Bell 
} from 'lucide-react';
import { useRoutineState } from './hooks/useRoutineState';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { RoutineView } from './components/RoutineView';
import { GoalsView } from './components/GoalsView';
import { TrackerView } from './components/TrackerView';
import { CalendarView } from './components/CalendarView';
import { SettingsView } from './components/SettingsView';
import { TaskModal } from './components/TaskModal';
import { ActiveTaskBanner } from './components/ActiveTaskBanner';
import { ApkGuideModal } from './components/ApkGuideModal';
import { RoutineTask } from './types/routine';
import { soundManager } from './utils/audio';

export default function App() {
  const {
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
  } = useRoutineState();

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<RoutineTask | null>(null);
  const [isApkGuideOpen, setIsApkGuideOpen] = useState(false);

  // Pending count for badge on routine tab
  const pendingCount = todayTasks.filter((t) => t.status === 'pending').length;

  const handleOpenAddTask = () => {
    soundManager.playTapSound();
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task: RoutineTask) => {
    soundManager.playTapSound();
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: Omit<RoutineTask, 'id'> | RoutineTask) => {
    if ('id' in taskData) {
      updateTask(taskData);
    } else {
      addTask(taskData);
    }
    setIsTaskModalOpen(false);
  };

  const handleResetAllData = () => {
    loadDefaultRoutineForDate(selectedDate);
    soundManager.playCompleteSound();
  };

  // Main view content based on activeTab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            tasks={todayTasks}
            performance={performance}
            settings={settings}
            currentTimeString={currentTimeString}
            onAddTask={handleOpenAddTask}
            onToggleTask={toggleTaskStatus}
            onNavigateToRoutine={() => setActiveTab('routine')}
            onNavigateToGoals={() => setActiveTab('goals')}
            onOpenTaskDetails={handleOpenEditTask}
          />
        );
      case 'routine':
        return (
          <RoutineView
            tasks={selectedDateTasks}
            selectedDate={selectedDate}
            onAddTask={handleOpenAddTask}
            onEditTask={handleOpenEditTask}
            onDeleteTask={deleteTask}
            onToggleTask={toggleTaskStatus}
            onLoadDefaultSchedule={() => loadDefaultRoutineForDate(selectedDate)}
          />
        );
      case 'goals':
        return (
          <GoalsView
            goals={goals}
            onAddGoal={addGoal}
            onUpdateGoal={updateGoal}
            onDeleteGoal={deleteGoal}
            onIncrementGoal={incrementGoalProgress}
          />
        );
      case 'tracker':
        return (
          <TrackerView
            performance={performance}
            weeklyHistory={weeklyHistory}
            tasks={todayTasks}
          />
        );
      case 'calendar':
        return (
          <CalendarView
            tasks={tasks}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onCopyRoutineToDate={copyRoutineToDate}
            onLoadDefaultScheduleForDate={loadDefaultRoutineForDate}
            onAddTask={handleOpenAddTask}
            onToggleTask={toggleTaskStatus}
          />
        );
      case 'settings':
        return (
          <SettingsView
            settings={settings}
            onUpdateSettings={updateSettings}
            onOpenApkGuide={() => setIsApkGuideOpen(true)}
            onResetAllData={handleResetAllData}
          />
        );
      default:
        return null;
    }
  };

  // Device status bar time (Android style)
  const statusTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {settings.viewMode === 'mobile' ? (
        // Mobile Frame View Mode (Realistic Android Smartphone Preview)
        <div className="min-h-screen py-4 sm:py-8 px-2 flex flex-col items-center justify-center">
          {/* Top Quick Bar Info */}
          <div className="mb-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Android Phone Preview Mode</span>
            <span>•</span>
            <button
              onClick={() => updateSettings({ viewMode: 'full' })}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
            >
              फुल स्क्रीन करें
            </button>
          </div>

          {/* Android Smartphone Mockup */}
          <div className="w-full max-w-[430px] h-[880px] max-h-[92vh] bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700/80 ring-1 ring-black/40 flex flex-col relative overflow-hidden">
            {/* Screen Glass Frame */}
            <div className="w-full h-full bg-slate-50 dark:bg-slate-950 rounded-[38px] flex flex-col overflow-hidden relative border border-slate-200/50 dark:border-slate-800">
              {/* Android Notch / Punch Hole & Status Bar */}
              <div className="h-7 bg-blue-700 text-white px-5 flex items-center justify-between text-[11px] font-semibold shrink-0 select-none z-40">
                <span>{statusTime}</span>

                {/* Center Camera Punch-hole */}
                <div className="w-3.5 h-3.5 rounded-full bg-black/60 border border-white/20 mx-auto" />

                <div className="flex items-center gap-1.5 text-white/90">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Header inside phone */}
              <Header
                settings={settings}
                onUpdateSettings={updateSettings}
                onOpenApkGuide={() => setIsApkGuideOpen(true)}
                activeTab={activeTab}
              />

              {/* Active task or reminder banner */}
              <ActiveTaskBanner
                currentActiveTask={currentActiveTask}
                activeAlert={activeAlert}
                onDismissAlert={() => setActiveAlert(null)}
                onCompleteTask={(id) => toggleTaskStatus(id, 'completed')}
              />

              {/* Scrollable Main Content */}
              <main className="flex-1 overflow-y-auto px-3.5 pt-3">
                {renderTabContent()}
              </main>

              {/* Floating Action Button (FAB) inside phone */}
              {activeTab === 'routine' && (
                <button
                  onClick={handleOpenAddTask}
                  className="absolute bottom-20 right-4 w-12 h-12 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/40 flex items-center justify-center hover:bg-blue-700 transition active:scale-95 cursor-pointer z-20"
                  title="नया काम जोड़ें"
                >
                  <Plus className="w-6 h-6" />
                </button>
              )}

              {/* Bottom Navigation */}
              <BottomNav
                activeTab={activeTab}
                onTabChange={setActiveTab}
                pendingCount={pendingCount}
              />

              {/* Android Gesture Bar */}
              <div className="h-3 bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 z-40 pb-1">
                <div className="w-28 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Fullscreen Responsive Mode
        <div className="min-h-screen flex flex-col">
          <Header
            settings={settings}
            onUpdateSettings={updateSettings}
            onOpenApkGuide={() => setIsApkGuideOpen(true)}
            activeTab={activeTab}
          />

          <div className="max-w-4xl mx-auto w-full px-3 sm:px-6 pt-3 flex-1 flex flex-col">
            <ActiveTaskBanner
              currentActiveTask={currentActiveTask}
              activeAlert={activeAlert}
              onDismissAlert={() => setActiveAlert(null)}
              onCompleteTask={(id) => toggleTaskStatus(id, 'completed')}
            />

            <main className="flex-1 mt-3">
              {renderTabContent()}
            </main>
          </div>

          {/* Floating Action Button (FAB) for Routine Tab */}
          {activeTab === 'routine' && (
            <button
              onClick={handleOpenAddTask}
              className="fixed bottom-20 right-6 sm:bottom-24 sm:right-10 w-14 h-14 rounded-full bg-blue-600 text-white shadow-2xl shadow-blue-600/40 flex items-center justify-center hover:bg-blue-700 transition active:scale-95 cursor-pointer z-20"
              title="नया काम जोड़ें"
            >
              <Plus className="w-7 h-7" />
            </button>
          )}

          <BottomNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            pendingCount={pendingCount}
          />
        </div>
      )}

      {/* Task Modal (Add/Edit) */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
        defaultDate={selectedDate}
      />

      {/* Android APK Build Guide Modal */}
      <ApkGuideModal
        isOpen={isApkGuideOpen}
        onClose={() => setIsApkGuideOpen(false)}
      />
    </div>
  );
}
