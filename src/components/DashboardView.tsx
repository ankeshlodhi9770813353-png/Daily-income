import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  TrendingUp, 
  Flame, 
  Calendar, 
  CheckSquare, 
  AlertCircle,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { RoutineTask, DayPerformance, UserSettings, CATEGORIES_CONFIG } from '../types/routine';
import { formatTime12h } from '../utils/storage';
import { soundManager } from '../utils/audio';

interface DashboardViewProps {
  tasks: RoutineTask[];
  performance: DayPerformance;
  settings: UserSettings;
  currentTimeString: string;
  onAddTask: () => void;
  onToggleTask: (id: string) => void;
  onNavigateToRoutine: () => void;
  onNavigateToGoals: () => void;
  onOpenTaskDetails: (task: RoutineTask) => void;
}

const MOTIVATIONAL_QUOTES = [
  'अनुशासन ही आपके लक्ष्यों और उपलब्धियों के बीच का सबसे मजबूत सेतु है।',
  'आज का एक घंटा कल के पछतावे से कहीं अधिक मूल्यवान है।',
  'सफल लोग वही करते हैं जो आवश्यक है, चाहे उनका मूड हो या न हो।',
  'हर सुबह एक नया अवसर है अपने रूटीन को बेहतर बनाने का।',
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  performance,
  settings,
  currentTimeString,
  onAddTask,
  onToggleTask,
  onNavigateToRoutine,
  onNavigateToGoals,
  onOpenTaskDetails,
}) => {
  // Determine greeting based on current hour
  const currentHour = parseInt(currentTimeString.split(':')[0], 10);
  let greeting = 'शुभ प्रभात';
  if (currentHour >= 12 && currentHour < 16) greeting = 'शुभ दोपहर';
  else if (currentHour >= 16 && currentHour < 20) greeting = 'शुभ संध्या';
  else if (currentHour >= 20 || currentHour < 5) greeting = 'शुभ रात्रि';

  // Format today's Hindi date
  const today = new Date();
  const dayNamesHi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
  const monthNamesHi = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
  const formattedDate = `${dayNamesHi[today.getDay()]}, ${today.getDate()} ${monthNamesHi[today.getMonth()]}`;

  // Random quote of the day based on day of month
  const quote = MOTIVATIONAL_QUOTES[today.getDate() % MOTIVATIONAL_QUOTES.length];

  // Hours calculation
  const plannedHours = (performance.totalPlannedMinutes / 60).toFixed(1);
  const completedHours = (performance.completedMinutes / 60).toFixed(1);

  // Top 5 tasks for today's summary
  const summaryTasks = tasks.slice(0, 6);

  return (
    <div className="space-y-4 pb-20">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white rounded-3xl p-5 shadow-xl shadow-blue-900/20 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-blue-400/10 blur-lg pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              <h2 className="text-xl sm:text-2xl font-black mt-0.5 tracking-tight">
                {greeting}, {settings.userName || 'Ankesh'}! 👋
              </h2>
            </div>
            
            <button
              onClick={() => {
                soundManager.playTapSound();
                onAddTask();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white text-blue-800 font-bold text-xs shadow-md hover:bg-blue-50 transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-blue-700" />
              <span>नया काम</span>
            </button>
          </div>

          {/* Daily Progress Gauge Card */}
          <div className="mt-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-blue-200 font-medium">आज की प्रगति (Daily Score)</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">
                    {performance.scorePercentage}%
                  </span>
                  <span className="text-xs text-blue-200 font-semibold">
                    ({performance.completedTasks}/{performance.totalTasks} काम पूरे)
                  </span>
                </div>
              </div>

              {/* Circular Gauge / Badge */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="currentColor"
                    strokeWidth="5"
                    className="text-white/20"
                    fill="transparent"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeDasharray={163.3}
                    strokeDashoffset={163.3 - (163.3 * performance.scorePercentage) / 100}
                    strokeLinecap="round"
                    className="text-emerald-400 transition-all duration-700 ease-out"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Linear Progress Bar */}
            <div className="mt-3 w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, performance.scorePercentage))}%` }}
              />
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[11px] text-blue-100/90 font-medium">
              <span>कार्य समय: {completedHours} / {plannedHours} घंटे</span>
              <span>
                {performance.scorePercentage >= 80 ? '🌟 उत्कृष्ट प्रदर्शन!' : performance.scorePercentage >= 50 ? '👍 अच्छा चल रहा है' : '🎯 लक्ष्य की ओर बढ़ें'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Total Tasks */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-tight">
              कुल काम (Total)
            </p>
            <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">
              {performance.totalTasks}
            </p>
          </div>
        </div>

        {/* Completed */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-tight">
              पूर्ण (Done)
            </p>
            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 leading-tight">
              {performance.completedTasks}
            </p>
          </div>
        </div>

        {/* Pending */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-tight">
              लंबित (Pending)
            </p>
            <p className="text-lg font-black text-amber-600 dark:text-amber-400 leading-tight">
              {performance.totalTasks - performance.completedTasks}
            </p>
          </div>
        </div>

        {/* Total Hours */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-tight">
              कार्य घंटे (Hours)
            </p>
            <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 leading-tight">
              {completedHours}h
            </p>
          </div>
        </div>
      </div>

      {/* Motivational Thought of Day */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/50 border border-blue-100 dark:border-blue-900/60 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium italic leading-relaxed">
          "{quote}"
        </p>
      </div>

      {/* Today's Schedule Quick Overview */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              आज का शेड्यूल (Today's Routine)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              समय पर काम पूरा करें और चेक करें
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playTapSound();
              onNavigateToRoutine();
            }}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>पूरा देखें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {summaryTasks.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              आज के लिए कोई काम शेड्यूल नहीं है
            </p>
            <button
              onClick={() => {
                soundManager.playTapSound();
                onAddTask();
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
            >
              + पहला काम जोड़ें
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {summaryTasks.map((task) => {
              const isDone = task.status === 'completed';
              const catConf = CATEGORIES_CONFIG[task.category] || CATEGORIES_CONFIG.other;

              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isDone
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-75'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Completion Checkbox */}
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="p-1 rounded-full text-slate-400 hover:text-blue-600 transition cursor-pointer shrink-0"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600 hover:text-blue-500" />
                      )}
                    </button>

                    <div className="min-w-0 cursor-pointer" onClick={() => onOpenTaskDetails(task)}>
                      <h4
                        className={`text-sm font-semibold truncate ${
                          isDone
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-100'
                        }`}
                      >
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {formatTime12h(task.startTime)} - {formatTime12h(task.endTime)}
                        </span>
                        <span>•</span>
                        <span
                          className="px-2 py-0.2 rounded-md text-[10px] font-semibold"
                          style={{
                            backgroundColor: `${catConf.color}15`,
                            color: catConf.color,
                          }}
                        >
                          {catConf.labelHi.split('/')[0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-medium text-slate-400 shrink-0">
                    {task.durationMinutes}m
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
