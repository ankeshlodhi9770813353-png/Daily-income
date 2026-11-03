import React from 'react';
import { 
  Home, 
  CalendarCheck2, 
  Target, 
  BarChart3, 
  CalendarDays, 
  Settings 
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export type NavTab = 'dashboard' | 'routine' | 'goals' | 'tracker' | 'calendar' | 'settings';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  pendingCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  pendingCount,
}) => {
  const tabs = [
    {
      id: 'dashboard' as NavTab,
      labelHi: 'डैशबोर्ड',
      labelEn: 'Dashboard',
      icon: Home,
    },
    {
      id: 'routine' as NavTab,
      labelHi: 'रूटीन',
      labelEn: 'Routine',
      icon: CalendarCheck2,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      id: 'goals' as NavTab,
      labelHi: 'लक्ष्य',
      labelEn: 'Goals',
      icon: Target,
    },
    {
      id: 'tracker' as NavTab,
      labelHi: 'एनालिटिक्स',
      labelEn: 'Tracker',
      icon: BarChart3,
    },
    {
      id: 'calendar' as NavTab,
      labelHi: 'कैलेंडर',
      labelEn: 'Calendar',
      icon: CalendarDays,
    },
    {
      id: 'settings' as NavTab,
      labelHi: 'सेटिंग्स',
      labelEn: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-md md:max-w-xl mx-auto px-2 py-1.5 flex items-center justify-between">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playTapSound();
                onTabChange(tab.id);
              }}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {/* Active Tab Background Pill */}
              <div
                className={`relative px-3 py-1 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400'
                    : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />

                {/* Badge if any */}
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4.5 text-center shadow-sm">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-[64px]">
                {tab.labelHi}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
