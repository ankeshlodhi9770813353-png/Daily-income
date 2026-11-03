import React, { useState } from 'react';
import { 
  Plus, 
  Target, 
  Flame, 
  CheckCircle2, 
  Calendar, 
  TrendingUp, 
  Trash2, 
  X,
  Award
} from 'lucide-react';
import { Goal, GoalPeriod, TaskCategory, CATEGORIES_CONFIG } from '../types/routine';
import { soundManager } from '../utils/audio';

interface GoalsViewProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
  onUpdateGoal: (goal: Goal) => void;
  onDeleteGoal: (goalId: string) => void;
  onIncrementGoal: (goalId: string, delta: number) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  goals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
  onIncrementGoal,
}) => {
  const [activeTab, setActiveTab] = useState<GoalPeriod>('daily');
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState<GoalPeriod>('daily');
  const [targetValue, setTargetValue] = useState<number>(5);
  const [unit, setUnit] = useState('घंटे');
  const [category, setCategory] = useState<TaskCategory>('work');

  const filteredGoals = goals.filter((g) => g.period === activeTab);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddGoal({
      title: title.trim(),
      period,
      targetValue: Number(targetValue) || 1,
      currentValue: 0,
      unit,
      completed: false,
      category,
      streakCount: 0,
    });

    setTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Top Goals Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-3xl p-5 shadow-lg shadow-blue-900/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-300" />
              <h2 className="text-xl font-bold">लक्ष्य निर्धारण (Goal Setting)</h2>
            </div>
            <p className="text-xs text-blue-100/90 mt-0.5">
              अपने दैनिक, साप्ताहिक और मासिक लक्ष्यों की प्रगति ट्रैक करें
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playTapSound();
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white text-blue-800 font-bold text-xs shadow-md hover:bg-blue-50 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-blue-700" />
            <span>नया लक्ष्य</span>
          </button>
        </div>

        {/* Period Selector Tabs */}
        <div className="mt-4 flex rounded-xl bg-white/10 p-1 backdrop-blur-sm border border-white/10">
          {[
            { id: 'daily' as GoalPeriod, label: 'दैनिक (Daily Goals)' },
            { id: 'weekly' as GoalPeriod, label: 'साप्ताहिक (Weekly)' },
            { id: 'monthly' as GoalPeriod, label: 'मासिक (Monthly)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playTapSound();
                setActiveTab(tab.id);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-blue-800 shadow-sm'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Goal Cards List */}
      {filteredGoals.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center">
          <Target className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-bold text-base text-slate-800 dark:text-white">
            कोई लक्ष्य नहीं जोड़ा गया
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            अपने लिए एक लक्ष्य निर्धारित करें और प्रतिदिन उसकी प्रगति दर्ज करें।
          </p>
          <button
            onClick={() => {
              soundManager.playTapSound();
              setShowAddModal(true);
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
          >
            + पहला लक्ष्य बनाएं
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredGoals.map((goal) => {
            const percentage = Math.min(
              100,
              Math.round((goal.currentValue / goal.targetValue) * 100)
            );
            const isCompleted = goal.completed || percentage >= 100;
            const catConf = CATEGORIES_CONFIG[goal.category] || CATEGORIES_CONFIG.work;

            return (
              <div
                key={goal.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold"
                        style={{
                          backgroundColor: `${catConf.color}15`,
                          color: catConf.color,
                        }}
                      >
                        {catConf.labelHi.split('/')[0]}
                      </span>

                      {goal.streakCount > 0 && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                          <Flame className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{goal.streakCount} दिन स्ट्रीक</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1.5 leading-snug">
                      {goal.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm('क्या आप इस लक्ष्य को हटाना चाहते हैं?')) {
                        onDeleteGoal(goal.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Bar and Values */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-600 dark:text-slate-400">
                      प्रगति: <strong className="text-blue-600 dark:text-blue-400">{goal.currentValue}</strong> / {goal.targetValue} {goal.unit}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {percentage}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {/* Quick Increment Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    त्वरित प्रगति जोड़ें:
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onIncrementGoal(goal.id, -1)}
                      disabled={goal.currentValue <= 0}
                      className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => onIncrementGoal(goal.id, 0.5)}
                      className="px-2.5 h-8 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 transition cursor-pointer"
                    >
                      +0.5
                    </button>
                    <button
                      onClick={() => onIncrementGoal(goal.id, 1)}
                      className="px-3 h-8 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm transition active:scale-95 cursor-pointer"
                    >
                      +1 {goal.unit}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-5 py-4 bg-blue-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">नया लक्ष्य बनाएं (New Goal)</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  लक्ष्य का नाम (Goal Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. 7 घंटे पढ़ाई, 5 किमी दौड़, 2L पानी..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    अवधि (Period)
                  </label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as GoalPeriod)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  >
                    <option value="daily">दैनिक (Daily)</option>
                    <option value="weekly">साप्ताहिक (Weekly)</option>
                    <option value="monthly">मासिक (Monthly)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    कैटेगरी (Category)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  >
                    {(Object.keys(CATEGORIES_CONFIG) as TaskCategory[]).map((k) => (
                      <option key={k} value={k}>
                        {CATEGORIES_CONFIG[k].labelHi.split('/')[0]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    लक्ष्य संख्या (Target Value)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    required
                    value={targetValue}
                    onChange={(e) => setTargetValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    इकाई (Unit)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="घंटे, दिन, कि.मी., %..."
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                >
                  सहेजें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
