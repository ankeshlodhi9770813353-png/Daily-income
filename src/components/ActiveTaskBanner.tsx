import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle, 
  Play, 
  Clock, 
  X, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { RoutineTask, CATEGORIES_CONFIG } from '../types/routine';
import { formatTime12h } from '../utils/storage';
import { soundManager } from '../utils/audio';

interface ActiveTaskBannerProps {
  currentActiveTask: RoutineTask | null;
  activeAlert: { task: RoutineTask; message: string } | null;
  onDismissAlert: () => void;
  onCompleteTask: (taskId: string) => void;
  onOpenTaskDetails?: (task: RoutineTask) => void;
}

export const ActiveTaskBanner: React.FC<ActiveTaskBannerProps> = ({
  currentActiveTask,
  activeAlert,
  onDismissAlert,
  onCompleteTask,
  onOpenTaskDetails,
}) => {
  const [minutesRemaining, setMinutesRemaining] = useState<number | null>(null);

  // Calculate live countdown for active task
  useEffect(() => {
    if (!currentActiveTask) {
      setMinutesRemaining(null);
      return;
    }

    const calc = () => {
      const now = new Date();
      const currentMin = now.getHours() * 60 + now.getMinutes();
      const [eH, eM] = currentActiveTask.endTime.split(':').map(Number);
      const endMin = eH * 60 + eM;
      const left = Math.max(0, endMin - currentMin);
      setMinutesRemaining(left);
    };

    calc();
    const interval = setInterval(calc, 15000);
    return () => clearInterval(interval);
  }, [currentActiveTask]);

  // If there is an active urgent alert notification
  if (activeAlert) {
    return (
      <div className="mx-4 mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20 border border-amber-400/40 flex items-center justify-between animate-bounce-short">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 animate-wiggle" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
                समय अलर्ट
              </span>
              <span className="text-xs font-semibold opacity-95">
                {formatTime12h(activeAlert.task.startTime)} - {formatTime12h(activeAlert.task.endTime)}
              </span>
            </div>
            <p className="text-sm font-bold leading-tight mt-0.5">
              {activeAlert.message}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playTapSound();
            onDismissAlert();
          }}
          className="p-1.5 rounded-full hover:bg-white/20 transition cursor-pointer shrink-0 ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // If there is a current task happening right now
  if (currentActiveTask) {
    const catConf = CATEGORIES_CONFIG[currentActiveTask.category] || CATEGORIES_CONFIG.work;

    return (
      <div className="mx-4 mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              अभी सक्रिय कार्य (In Progress)
            </span>
          </div>

          {minutesRemaining !== null && (
            <span className="text-xs font-bold bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20 flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-200" />
              <span>{minutesRemaining} मिनट शेष</span>
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-bold text-sm sm:text-base leading-tight truncate">
              {currentActiveTask.title}
            </h3>
            <p className="text-xs text-blue-100/90 mt-0.5 flex items-center gap-1.5">
              <span>{formatTime12h(currentActiveTask.startTime)} - {formatTime12h(currentActiveTask.endTime)}</span>
              <span>•</span>
              <span className="font-medium">{catConf.labelHi.split('/')[0]}</span>
            </p>
          </div>

          <button
            onClick={() => {
              onCompleteTask(currentActiveTask.id);
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition active:scale-95 flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>पूर्ण करें</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
};
