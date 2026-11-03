import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Edit3, 
  Filter, 
  Sun, 
  Sunrise, 
  Sunset, 
  Moon, 
  Sparkles,
  Calendar,
  RotateCcw,
  Check
} from 'lucide-react';
import { 
  RoutineTask, 
  TaskCategory, 
  TaskStatus, 
  CATEGORIES_CONFIG 
} from '../types/routine';
import { formatTime12h } from '../utils/storage';
import { soundManager } from '../utils/audio';

interface RoutineViewProps {
  tasks: RoutineTask[];
  selectedDate: string;
  onAddTask: () => void;
  onEditTask: (task: RoutineTask) => void;
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string) => void;
  onLoadDefaultSchedule: () => void;
}

type PeriodId = 'morning' | 'afternoon' | 'evening' | 'night';

interface TimePeriod {
  id: PeriodId;
  labelHi: string;
  labelEn: string;
  timeRange: string;
  icon: React.ElementType;
  color: string;
  filter: (t: RoutineTask) => boolean;
}

const TIME_PERIODS: TimePeriod[] = [
  {
    id: 'morning',
    labelHi: 'प्रातःकाल (Morning)',
    labelEn: '05:00 AM - 12:00 PM',
    timeRange: '05:00 - 12:00',
    icon: Sunrise,
    color: 'text-amber-500',
    filter: (t) => t.startTime < '12:00',
  },
  {
    id: 'afternoon',
    labelHi: 'दोपहर (Afternoon)',
    labelEn: '12:00 PM - 05:00 PM',
    timeRange: '12:00 - 17:00',
    icon: Sun,
    color: 'text-orange-500',
    filter: (t) => t.startTime >= '12:00' && t.startTime < '17:00',
  },
  {
    id: 'evening',
    labelHi: 'सायंकाल (Evening)',
    labelEn: '05:00 PM - 08:00 PM',
    timeRange: '17:00 - 20:00',
    icon: Sunset,
    color: 'text-purple-500',
    filter: (t) => t.startTime >= '17:00' && t.startTime < '20:00',
  },
  {
    id: 'night',
    labelHi: 'रात्रि (Night)',
    labelEn: '08:00 PM - 12:00 AM',
    timeRange: '20:00 - 23:59',
    icon: Moon,
    color: 'text-indigo-500',
    filter: (t) => t.startTime >= '20:00',
  },
];

export const RoutineView: React.FC<RoutineViewProps> = ({
  tasks,
  selectedDate,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTask,
  onLoadDefaultSchedule,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
      if (statusFilter === 'pending' && t.status === 'completed') return false;
      if (statusFilter === 'completed' && t.status !== 'completed') return false;
      return true;
    });
  }, [tasks, selectedCategory, statusFilter]);

  return (
    <div className="space-y-4 pb-24">
      {/* Top Controls Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>दैनिक रूटीन (Daily Routine)</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {tasks.length} काम निर्धारित
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              सुबह से रात तक का संपूर्ण क्रमबद्ध टाइमटेबल
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundManager.playTapSound();
                onLoadDefaultSchedule();
              }}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
              title="पूर्वनिर्धारित आदर्श रूटीन लोड करें"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>डिफ़ॉल्ट रूटीन</span>
            </button>

            <button
              onClick={() => {
                soundManager.playTapSound();
                onAddTask();
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>काम जोड़ें</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 mr-1 shrink-0">स्थिति:</span>
            {[
              { id: 'all', label: 'सभी (All)' },
              { id: 'pending', label: 'लंबित (Pending)' },
              { id: 'completed', label: 'पूर्ण (Done)' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  soundManager.playTapSound();
                  setStatusFilter(st.id as 'all' | 'pending' | 'completed');
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  statusFilter === st.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Category Filter Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => {
                soundManager.playTapSound();
                setSelectedCategory('all');
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              सभी श्रेणियां
            </button>
            {(Object.keys(CATEGORIES_CONFIG) as TaskCategory[]).map((catKey) => {
              const conf = CATEGORIES_CONFIG[catKey];
              const isSelected = selectedCategory === catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => {
                    soundManager.playTapSound();
                    setSelectedCategory(catKey);
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: conf.color }}
                  />
                  <span>{conf.labelHi.split('/')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Routine Timeline by Periods */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center">
          <Clock className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-bold text-base text-slate-800 dark:text-white">
            कोई कार्य नहीं मिला
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            आपके चुने हुए फ़िल्टर के अनुसार कोई टास्क नहीं है। नया काम जोड़ें या डिफ़ॉल्ट रूटीन लोड करें।
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={onAddTask}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
            >
              + नया काम जोड़ें
            </button>
            <button
              onClick={onLoadDefaultSchedule}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50"
            >
              डिफ़ॉल्ट लोड करें
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {TIME_PERIODS.map((period) => {
            const periodTasks = filteredTasks.filter(period.filter);
            if (periodTasks.length === 0) return null;

            const Icon = period.icon;

            return (
              <div
                key={period.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                {/* Period Section Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-800 ${period.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                        {period.labelHi}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium leading-tight">
                        {period.labelEn}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {periodTasks.filter((t) => t.status === 'completed').length}/{periodTasks.length} पूर्ण
                  </span>
                </div>

                {/* Period Tasks List */}
                <div className="space-y-2.5">
                  {periodTasks.map((task) => {
                    const isDone = task.status === 'completed';
                    const catConf = CATEGORIES_CONFIG[task.category] || CATEGORIES_CONFIG.other;

                    return (
                      <div
                        key={task.id}
                        className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-start justify-between gap-3 ${
                          isDone
                            ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800/80 opacity-70'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-800 shadow-xs'
                        }`}
                      >
                        {/* Checkbox & Details */}
                        <div className="flex items-start gap-3 min-w-0">
                          <button
                            onClick={() => onToggleTask(task.id)}
                            className="mt-0.5 p-0.5 text-slate-400 hover:text-blue-600 transition cursor-pointer shrink-0"
                            title={isDone ? 'अपूर्ण चिह्नित करें' : 'पूर्ण चिह्नित करें'}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                            ) : (
                              <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600 hover:text-blue-500" />
                            )}
                          </button>

                          <div className="min-w-0">
                            <h4
                              className={`text-sm font-bold leading-tight ${
                                isDone
                                  ? 'line-through text-slate-400 dark:text-slate-500'
                                  : 'text-slate-900 dark:text-slate-100'
                              }`}
                            >
                              {task.title}
                            </h4>

                            {/* Time & Category badges */}
                            <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-xs">
                              <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime12h(task.startTime)} - {formatTime12h(task.endTime)}
                              </span>

                              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-md">
                                {task.durationMinutes} मिनट
                              </span>

                              <span
                                className="px-2 py-0.5 rounded-md text-[11px] font-bold"
                                style={{
                                  backgroundColor: `${catConf.color}15`,
                                  color: catConf.color,
                                }}
                              >
                                {catConf.labelHi.split('/')[0]}
                              </span>

                              {task.priority === 'high' && (
                                <span className="bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                  उच्च
                                </span>
                              )}
                            </div>

                            {/* Optional Notes */}
                            {task.notes && (
                              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg border border-slate-100 dark:border-slate-700/50">
                                {task.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions: Edit & Delete */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              soundManager.playTapSound();
                              onEditTask(task);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                            title="संपादित करें"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm('क्या आप इस काम को डिलीट करना चाहते हैं?')) {
                                onDeleteTask(task.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                            title="डिलीट करें"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
