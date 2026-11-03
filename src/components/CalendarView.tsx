import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  RotateCcw, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Circle,
  CalendarDays
} from 'lucide-react';
import { RoutineTask, CATEGORIES_CONFIG } from '../types/routine';
import { formatTime12h, getTodayDateString } from '../utils/storage';
import { soundManager } from '../utils/audio';

interface CalendarViewProps {
  tasks: RoutineTask[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onCopyRoutineToDate: (fromDate: string, targetDate: string) => void;
  onLoadDefaultScheduleForDate: (date: string) => void;
  onAddTask: () => void;
  onToggleTask: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  selectedDate,
  onSelectDate,
  onCopyRoutineToDate,
  onLoadDefaultScheduleForDate,
  onAddTask,
  onToggleTask,
}) => {
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date(selectedDate || new Date()));

  const todayStr = getTodayDateString();

  // Navigation helpers for month
  const prevMonth = () => {
    soundManager.playTapSound();
    setCurrentMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    soundManager.playTapSound();
    setCurrentMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Generate calendar grid
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNamesHi = [
    'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ];

  const daysOfWeekHi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

  // Tasks for the currently selected date
  const selectedDateTasks = tasks
    .filter((t) => t.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const completedCount = selectedDateTasks.filter((t) => t.status === 'completed').length;
  const isPast = selectedDate < todayStr;
  const isToday = selectedDate === todayStr;
  const isFuture = selectedDate > todayStr;

  return (
    <div className="space-y-4 pb-24">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-3xl p-5 shadow-lg shadow-blue-900/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-amber-300" />
              <h2 className="text-xl font-bold">कैलेंडर एवं तारीख शेड्यूल (Calendar)</h2>
            </div>
            <p className="text-xs text-blue-100/90 mt-0.5">
              पुराने दिनों का रिकॉर्ड देखें व आने वाले दिनों की योजना बनाएं
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playTapSound();
              onSelectDate(todayStr);
              setCurrentMonthDate(new Date());
            }}
            className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition active:scale-95 cursor-pointer"
          >
            आज (Today)
          </button>
        </div>
      </div>

      {/* Interactive Calendar Picker Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Month Header Navigation */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            {monthNamesHi[month]} {year}
          </h3>

          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Day Name Headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {daysOfWeekHi.map((day, i) => (
            <div key={i} className="text-[11px] font-bold text-slate-400 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells before first day */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10" />
          ))}

          {/* Day Numbers */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isSelected = dateStr === selectedDate;
            const isDayToday = dateStr === todayStr;

            // Check how many tasks exist on this date
            const dateTasks = tasks.filter((t) => t.date === dateStr);
            const doneTasks = dateTasks.filter((t) => t.status === 'completed');
            const hasTasks = dateTasks.length > 0;
            const isAllDone = hasTasks && doneTasks.length === dateTasks.length;

            return (
              <button
                key={dateStr}
                onClick={() => {
                  soundManager.playTapSound();
                  onSelectDate(dateStr);
                }}
                className={`h-11 rounded-xl flex flex-col items-center justify-center relative transition cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25'
                    : isDayToday
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-300 dark:border-blue-700'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-xs leading-none">{dayNum}</span>

                {/* Dot status indicator */}
                {hasTasks && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-1 ${
                      isSelected
                        ? 'bg-white'
                        : isAllDone
                        ? 'bg-emerald-500'
                        : doneTasks.length > 0
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Routine Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full">
                {isToday ? 'आज का दिन (Today)' : isPast ? 'बीता हुआ दिन (Past Date)' : 'आगामी दिन (Upcoming)'}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {selectedDate}
              </span>
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-1">
              निर्धारित कार्य ({selectedDateTasks.length}) • {completedCount} पूर्ण
            </h3>
          </div>

          {/* Quick Date Actions */}
          <div className="flex items-center gap-2">
            {!isToday && (
              <button
                onClick={() => {
                  soundManager.playTapSound();
                  onCopyRoutineToDate(todayStr, selectedDate);
                }}
                className="px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                title="आज का पूरा रूटीन इस तारीख पर कॉपी करें"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>आज का रूटीन कॉपी करें</span>
              </button>
            )}

            <button
              onClick={() => {
                soundManager.playTapSound();
                onLoadDefaultScheduleForDate(selectedDate);
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>डिफ़ॉल्ट शेड्यूल</span>
            </button>
          </div>
        </div>

        {/* Selected Date Tasks List */}
        {selectedDateTasks.length === 0 ? (
          <div className="text-center py-8">
            <CalendarIcon className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              इस तारीख के लिए कोई कार्य शेड्यूल नहीं है
            </p>
            <p className="text-xs text-slate-400 mt-1">
              आप आज के रूटीन को यहाँ कॉपी कर सकते हैं या नया काम जोड़ सकते हैं।
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <button
                onClick={onAddTask}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
              >
                + इस दिन काम जोड़ें
              </button>
              <button
                onClick={() => onCopyRoutineToDate(todayStr, selectedDate)}
                className="px-4 py-2 rounded-xl border border-blue-200 text-blue-600 text-xs font-semibold hover:bg-blue-50"
              >
                आज का रूटीन कॉपी करें
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-2.5">
            {selectedDateTasks.map((task) => {
              const isDone = task.status === 'completed';
              const catConf = CATEGORIES_CONFIG[task.category] || CATEGORIES_CONFIG.other;

              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                    isDone
                      ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-70'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="p-1 text-slate-400 hover:text-blue-600 transition cursor-pointer shrink-0"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600 hover:text-blue-500" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <h4
                        className={`text-sm font-bold truncate ${
                          isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
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

                  <span className="text-xs font-semibold text-slate-400 shrink-0">
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
