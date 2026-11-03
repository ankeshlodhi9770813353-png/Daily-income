import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  Calendar, 
  Tag, 
  AlertCircle, 
  FileText, 
  Check, 
  BellRing,
  Sparkles
} from 'lucide-react';
import { RoutineTask, TaskCategory, TaskPriority, CATEGORIES_CONFIG } from '../types/routine';
import { calculateDurationMinutes, formatTime12h } from '../utils/storage';
import { soundManager } from '../utils/audio';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<RoutineTask, 'id'> | RoutineTask) => void;
  initialTask?: RoutineTask | null;
  defaultDate: string;
}

const QUICK_PRESETS = [
  { title: 'प्राणायाम एवं ध्यान (Meditation)', category: 'spiritual' as TaskCategory, duration: 30, priority: 'medium' as TaskPriority },
  { title: 'व्यायाम एवं कार्डियो (Workout)', category: 'fitness' as TaskCategory, duration: 45, priority: 'high' as TaskPriority },
  { title: 'गहन अध्ययन व कोडिंग (Deep Work)', category: 'work' as TaskCategory, duration: 120, priority: 'high' as TaskPriority },
  { title: 'स्वाध्याय एवं किताब पढ़ना (Reading)', category: 'study' as TaskCategory, duration: 45, priority: 'medium' as TaskPriority },
  { title: 'शाम की सैर (Evening Walk)', category: 'personal' as TaskCategory, duration: 45, priority: 'low' as TaskPriority },
  { title: 'संतुलित भोजन (Healthy Meal)', category: 'meals' as TaskCategory, duration: 40, priority: 'medium' as TaskPriority },
];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
  defaultDate,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('work');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [date, setDate] = useState(defaultDate);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [reminderMinutesBefore, setReminderMinutesBefore] = useState<number>(5);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setCategory(initialTask.category);
      setStartTime(initialTask.startTime);
      setEndTime(initialTask.endTime);
      setDate(initialTask.date);
      setPriority(initialTask.priority);
      setReminderMinutesBefore(initialTask.reminderMinutesBefore ?? 5);
      setNotes(initialTask.notes || '');
    } else {
      // Set reasonable default start/end based on current hour
      const now = new Date();
      const nextHour = (now.getHours() + 1) % 24;
      const nextHour2 = (nextHour + 1) % 24;
      const sH = String(nextHour).padStart(2, '0') + ':00';
      const eH = String(nextHour2).padStart(2, '0') + ':00';
      setTitle('');
      setCategory('work');
      setStartTime(sH);
      setEndTime(eH);
      setDate(defaultDate);
      setPriority('medium');
      setReminderMinutesBefore(5);
      setNotes('');
    }
    setError(null);
  }, [initialTask, isOpen, defaultDate]);

  if (!isOpen) return null;

  const durationMin = calculateDurationMinutes(startTime, endTime);
  const hours = Math.floor(durationMin / 60);
  const mins = durationMin % 60;
  const durationText = hours > 0 ? `${hours} घंटा ${mins > 0 ? `${mins} मिनट` : ''}` : `${mins} मिनट`;

  const handleApplyPreset = (preset: typeof QUICK_PRESETS[0]) => {
    soundManager.playTapSound();
    setTitle(preset.title);
    setCategory(preset.category);
    setPriority(preset.priority);
    // adjust end time based on preset duration
    const [sH, sM] = startTime.split(':').map(Number);
    const endTotalMin = sH * 60 + sM + preset.duration;
    const finalH = Math.floor(endTotalMin / 60) % 24;
    const finalM = endTotalMin % 60;
    setEndTime(`${String(finalH).padStart(2, '0')}:${String(finalM).padStart(2, '0')}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('कृपया काम का नाम दर्ज करें');
      return;
    }

    if (initialTask) {
      onSave({
        ...initialTask,
        title: title.trim(),
        category,
        startTime,
        endTime,
        durationMinutes: durationMin,
        date,
        priority,
        reminderMinutesBefore,
        notes: notes.trim(),
      });
    } else {
      onSave({
        title: title.trim(),
        category,
        startTime,
        endTime,
        durationMinutes: durationMin,
        date,
        priority,
        status: 'pending',
        reminderMinutesBefore,
        notes: notes.trim(),
      });
    }

    soundManager.playTapSound();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
      <div className="w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">
              {initialTask ? 'काम संपादित करें (Edit Task)' : 'नया काम जोड़ें (Add Routine Task)'}
            </h2>
            <p className="text-xs text-blue-100">
              दिनचर्या शेड्यूल एवं समय प्रबंधन
            </p>
          </div>
          <button
            onClick={() => {
              soundManager.playTapSound();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Preset Buttons */}
          {!initialTask && (
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>त्वरित सुझाव (Quick Presets):</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                  >
                    {p.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Task Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              काम का नाम (Task Title) *
            </label>
            <input
              type="text"
              required
              placeholder="उदा. सुबह की सैर, कोडिंग प्रोजेक्ट, किताब पढ़ना..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              कैटेगरी (Category)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(CATEGORIES_CONFIG) as TaskCategory[]).map((catKey) => {
                const conf = CATEGORIES_CONFIG[catKey];
                const isSelected = category === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => {
                      soundManager.playTapSound();
                      setCategory(catKey);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium border text-left transition cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/30'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: conf.color }}
                    />
                    <span className="truncate">{conf.labelHi.split('/')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timing: Start Time, End Time & Computed Duration */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>शुरू समय (Start)</span>
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                {formatTime12h(startTime)}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>समाप्ति (End)</span>
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                {formatTime12h(endTime)}
              </span>
            </div>

            <div className="col-span-2 pt-1 border-t border-blue-200/60 dark:border-blue-900 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                कुल समय (Total Duration):
              </span>
              <span className="font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded-full">
                ⏱️ {durationText} ({durationMin} मिनट)
              </span>
            </div>
          </div>

          {/* Date & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>तारीख (Date)</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                प्राथमिकता (Priority)
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => {
                  const isSelected = priority === p;
                  const label = p === 'high' ? 'उच्च' : p === 'medium' ? 'मध्यम' : 'कम';
                  const color =
                    p === 'high'
                      ? 'border-rose-400 text-rose-600 bg-rose-50 dark:bg-rose-950/40'
                      : p === 'medium'
                      ? 'border-amber-400 text-amber-600 bg-amber-50 dark:bg-amber-950/40'
                      : 'border-slate-300 text-slate-600 bg-slate-50 dark:bg-slate-800';

                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        soundManager.playTapSound();
                        setPriority(p);
                      }}
                      className={`py-2 px-1 text-xs font-semibold rounded-lg border text-center transition cursor-pointer ${
                        isSelected ? `${color} ring-2 ring-blue-500/30 font-bold` : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reminder Offset */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <BellRing className="w-3.5 h-3.5 text-blue-600" />
              <span>रिमाइंडर अलर्ट (Reminder Alert)</span>
            </label>
            <select
              value={reminderMinutesBefore}
              onChange={(e) => setReminderMinutesBefore(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>काम शुरू होने के सटीक समय पर (Exact time)</option>
              <option value={5}>5 मिनट पहले (5 min before)</option>
              <option value={10}>10 मिनट पहले (10 min before)</option>
              <option value={15}>15 मिनट पहले (15 min before)</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>अतिरिक्त विवरण / नोट्स (Optional Notes)</span>
            </label>
            <textarea
              rows={2}
              placeholder="कोई खास निर्देश या चेकलिस्ट..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => {
                soundManager.playTapSound();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{initialTask ? 'बदलाव सहेजें' : 'काम जोड़ें'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
