import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Calendar, 
  PieChart, 
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { RoutineTask, DayPerformance, CATEGORIES_CONFIG, TaskCategory } from '../types/routine';

interface TrackerViewProps {
  performance: DayPerformance;
  weeklyHistory: DayPerformance[];
  tasks: RoutineTask[];
}

export const TrackerView: React.FC<TrackerViewProps> = ({
  performance,
  weeklyHistory,
  tasks,
}) => {
  // Compute category breakdown from today's tasks
  const categoryStats = React.useMemo(() => {
    const map: Partial<Record<TaskCategory, { plannedMin: number; completedMin: number; count: number }>> = {};

    tasks.forEach((t) => {
      if (!map[t.category]) {
        map[t.category] = { plannedMin: 0, completedMin: 0, count: 0 };
      }
      map[t.category]!.plannedMin += t.durationMinutes || 30;
      map[t.category]!.count += 1;
      if (t.status === 'completed') {
        map[t.category]!.completedMin += t.durationMinutes || 30;
      }
    });

    return Object.entries(map).map(([catKey, data]) => ({
      category: catKey as TaskCategory,
      ...data,
      hours: (data.plannedMin / 60).toFixed(1),
    })).sort((a, b) => b.plannedMin - a.plannedMin);
  }, [tasks]);

  // Overall weekly average score
  const weeklyAvgScore = React.useMemo(() => {
    if (weeklyHistory.length === 0) return 0;
    const sum = weeklyHistory.reduce((acc, curr) => acc + curr.scorePercentage, 0);
    return Math.round(sum / weeklyHistory.length);
  }, [weeklyHistory]);

  // Grade calculation
  let grade = 'B (अच्छा)';
  let gradeColor = 'text-blue-600 bg-blue-50 border-blue-200';
  if (performance.scorePercentage >= 90) {
    grade = 'A+ (उत्कृष्ट ⭐)';
    gradeColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  } else if (performance.scorePercentage >= 75) {
    grade = 'A (शानदार 👍)';
    gradeColor = 'text-teal-600 bg-teal-50 border-teal-200';
  } else if (performance.scorePercentage < 50) {
    grade = 'C (सुधार आवश्यक 🎯)';
    gradeColor = 'text-amber-600 bg-amber-50 border-amber-200';
  }

  const plannedHours = (performance.totalPlannedMinutes / 60).toFixed(1);
  const completedHours = (performance.completedMinutes / 60).toFixed(1);

  return (
    <div className="space-y-4 pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white rounded-3xl p-5 shadow-lg shadow-blue-900/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-300" />
              <h2 className="text-xl font-bold">परफॉर्मेंस ट्रैकर (Analytics)</h2>
            </div>
            <p className="text-xs text-blue-100/90 mt-0.5">
              दैनिक, साप्ताहिक कार्य क्षमता एवं समय विश्लेषण
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-blue-200 block">आज का स्कोर</span>
            <span className="text-2xl font-black text-white">
              {performance.scorePercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Grade & Score Highlight Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
              <Award className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                दैनिक उत्पादकता ग्रेड (Productivity Grade)
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                {grade}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                कुल {performance.totalTasks} में से {performance.completedTasks} कार्य पूरे किए
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">कार्य समय</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {completedHours}h / {plannedHours}h
              </span>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">साप्ताहिक औसत</span>
              <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                {weeklyAvgScore}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Performance Bar Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>पिछले 7 दिनों की रिपोर्ट (7-Day Report)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              दैनिक रूटीन पूर्णता दर
            </p>
          </div>

          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-full">
            औसत {weeklyAvgScore}%
          </span>
        </div>

        {/* Bar Chart Container */}
        <div className="h-48 pt-6 pb-2 flex items-end justify-between gap-2 sm:gap-4 border-b border-slate-100 dark:border-slate-800">
          {weeklyHistory.map((day, idx) => {
            const dateObj = new Date(day.date);
            const dayName = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'][dateObj.getDay()];
            const dayNum = dateObj.getDate();
            const barHeight = Math.max(8, day.scorePercentage);
            const isToday = idx === weeklyHistory.length - 1;

            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {day.scorePercentage}%
                </span>

                <div className="w-full max-w-[36px] bg-slate-100 dark:bg-slate-800 rounded-t-xl h-full flex items-end overflow-hidden">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-500 ${
                      isToday
                        ? 'bg-gradient-to-t from-blue-700 to-blue-500 shadow-md shadow-blue-500/30'
                        : day.scorePercentage >= 75
                        ? 'bg-gradient-to-t from-emerald-600 to-teal-400'
                        : day.scorePercentage >= 50
                        ? 'bg-gradient-to-t from-blue-500 to-sky-400'
                        : 'bg-gradient-to-t from-slate-400 to-slate-300 dark:from-slate-700 dark:to-slate-600'
                    }`}
                    style={{ height: `${barHeight}%` }}
                  />
                </div>

                <div className="text-center">
                  <span className={`text-[11px] font-bold block ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {dayName}
                  </span>
                  <span className="text-[9px] text-slate-400">
                    {dayNum}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category-wise Time Distribution */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 mb-3">
          <PieChart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>श्रेणी अनुसार समय विभाजन (Category Time Breakdown)</span>
        </h3>

        {categoryStats.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">कोई डेटा उपलब्ध नहीं है</p>
        ) : (
          <div className="space-y-3">
            {categoryStats.map((item) => {
              const catConf = CATEGORIES_CONFIG[item.category] || CATEGORIES_CONFIG.other;
              const totalPlanned = performance.totalPlannedMinutes || 1;
              const sharePercent = Math.round((item.plannedMin / totalPlanned) * 100);

              return (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: catConf.color }}
                      />
                      <span>{catConf.labelHi}</span>
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {item.hours} घंटे ({sharePercent}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${sharePercent}%`,
                        backgroundColor: catConf.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
