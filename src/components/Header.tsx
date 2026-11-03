import React from 'react';
import { 
  Bell, 
  Smartphone, 
  Monitor, 
  Sun, 
  Moon, 
  Download, 
  Sparkles,
  CheckCircle2,
  Package
} from 'lucide-react';
import { UserSettings } from '../types/routine';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  settings: UserSettings;
  onUpdateSettings: (s: Partial<UserSettings>) => void;
  onOpenApkGuide: () => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenApkGuide,
}) => {
  const { isInstallable, install, isInstalled } = usePWAInstall();

  const toggleTheme = () => {
    soundManager.playTapSound();
    onUpdateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  const toggleViewMode = () => {
    soundManager.playTapSound();
    onUpdateSettings({ viewMode: settings.viewMode === 'mobile' ? 'full' : 'mobile' });
  };

  return (
    <header className="sticky top-0 z-30 bg-blue-700 text-white shadow-md border-b border-blue-800">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
            <span className="font-extrabold text-xl tracking-tight text-white">A</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base md:text-lg tracking-tight leading-none text-white">
                ANKESH DAILY ROUTINE
              </h1>
              <span className="bg-blue-500/50 text-blue-100 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-blue-400/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-blue-100/90 font-medium leading-tight">
              स्मार्ट दिनचर्या एवं कार्य प्लानर
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* APK Build Guide Button */}
          <button
            onClick={() => {
              soundManager.playTapSound();
              onOpenApkGuide();
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer"
            title="Android APK बनाने के निर्देश व फाइलें"
          >
            <Package className="w-3.5 h-3.5" />
            <span>APK गाइड</span>
          </button>

          {/* PWA Install Button if available */}
          {isInstallable && !isInstalled && (
            <button
              onClick={() => {
                soundManager.playTapSound();
                install();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-sm animate-pulse transition active:scale-95 cursor-pointer"
              title="ऐप को फोन पर इनस्टॉल करें"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">ऐप इनस्टॉल</span>
            </button>
          )}

          {/* Android Mobile Frame vs Full Width Toggle */}
          <button
            onClick={toggleViewMode}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition active:scale-95 cursor-pointer"
            title={settings.viewMode === 'mobile' ? 'फुल स्क्रीन व्यू' : 'एंड्रॉइड मोबाइल फ्रेम व्यू'}
          >
            {settings.viewMode === 'mobile' ? (
              <Monitor className="w-4 h-4" />
            ) : (
              <Smartphone className="w-4 h-4" />
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition active:scale-95 cursor-pointer"
            title={settings.theme === 'dark' ? 'लाइट मोड' : 'डार्क मोड'}
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-blue-100" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
