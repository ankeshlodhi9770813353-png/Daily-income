import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Sun, 
  Moon, 
  Volume2, 
  Bell, 
  Smartphone, 
  Download, 
  Upload, 
  RotateCcw, 
  ShieldCheck, 
  Package, 
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { UserSettings } from '../types/routine';
import { soundManager, requestNotificationPermission } from '../utils/audio';
import { exportBackupData, importBackupData } from '../utils/storage';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (s: Partial<UserSettings>) => void;
  onOpenApkGuide: () => void;
  onResetAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onOpenApkGuide,
  onResetAllData,
}) => {
  const [userName, setUserName] = useState(settings.userName);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({ userName: userName.trim() });
    soundManager.playTapSound();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleTestChime = () => {
    soundManager.playReminderSound();
  };

  const handleTestFanfare = () => {
    soundManager.playCompleteSound();
  };

  const handleRequestNotification = async () => {
    soundManager.playTapSound();
    const granted = await requestNotificationPermission();
    if (granted) {
      onUpdateSettings({ notificationsEnabled: true });
      alert('नोटिफिकेशन की अनुमति सक्रिय हो गई है!');
    } else {
      alert('ब्राउज़र द्वारा नोटिफिकेशन की अनुमति अस्वीकार की गई या उपलब्ध नहीं है।');
    }
  };

  const handleExportBackup = () => {
    soundManager.playTapSound();
    const jsonStr = exportBackupData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ankesh-routine-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importBackupData(content);
      if (success) {
        soundManager.playCompleteSound();
        setImportStatus('डेटा सफलतापूर्वक रीस्टोर हो गया! ऐप रीलोड हो रहा है...');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setImportStatus('अमान्य बैकअप फ़ाइल। कृपया सही JSON फ़ाइल चुनें।');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-3xl p-5 shadow-lg shadow-blue-900/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-amber-300" />
              <h2 className="text-xl font-bold">सेटिंग्स एवं प्रोफाइल (Settings)</h2>
            </div>
            <p className="text-xs text-blue-100/90 mt-0.5">
              अपनी पसंद, नोटिफिकेशन और डेटा बैकअप कस्टमाइज़ करें
            </p>
          </div>
        </div>
      </div>

      {/* APK Builder Banner Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-700/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base">Android APK कैसे बनाएं?</h3>
              <span className="text-[10px] font-bold bg-white text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                गाइड
              </span>
            </div>
            <p className="text-xs text-emerald-100 mt-0.5">
              इस ऐप को Android APK में बदलने के सम्पूर्ण निर्देश, Capacitor फाइलें व कोड
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playTapSound();
            onOpenApkGuide();
          }}
          className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 font-extrabold text-xs shadow-md hover:bg-emerald-50 transition active:scale-95 shrink-0 cursor-pointer text-center"
        >
          APK निर्देश व फाइलें देखें →
        </button>
      </div>

      {/* Profile & Name Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 mb-3">
          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>यूजर प्रोफाइल (Profile)</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              आपका नाम (User Name)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="उदा. Ankesh Lodhi"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
              >
                सहेजें
              </button>
            </div>
          </div>

          {saveSuccess && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>नाम सफलतापूर्वक अपडेट हो गया!</span>
            </p>
          )}
        </form>
      </div>

      {/* Theme & Display Mode */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 mb-3">
          <Sun className="w-4 h-4 text-amber-500" />
          <span>थीम एवं लेआउट (Theme & Display)</span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={() => {
              soundManager.playTapSound();
              onUpdateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
            }}
            className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              {settings.theme === 'dark' ? (
                <Moon className="w-4 h-4 text-blue-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span>{settings.theme === 'dark' ? 'डार्क मोड' : 'लाइट मोड'}</span>
            </div>
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              बदलें
            </span>
          </button>

          {/* Mobile Phone Mockup vs Fullscreen */}
          <button
            onClick={() => {
              soundManager.playTapSound();
              onUpdateSettings({ viewMode: settings.viewMode === 'mobile' ? 'full' : 'mobile' });
            }}
            className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{settings.viewMode === 'mobile' ? 'मोबाइल फ्रेम' : 'फुल स्क्रीन'}</span>
            </div>
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              बदलें
            </span>
          </button>
        </div>
      </div>

      {/* Sound & Notification Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>ध्वनि एवं नोटिफिकेशन अलर्ट (Sounds & Notifications)</span>
        </h3>

        {/* Sound toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              ऑडियो चाइम एवं अलर्ट (Audio Chime)
            </span>
            <span className="text-[11px] text-slate-500">
              टास्क शुरू होने और पूरा होने पर ध्वनि बजाएं
            </span>
          </div>

          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
            className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
          />
        </div>

        {/* Test Chimes */}
        {settings.soundEnabled && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleTestChime}
              className="px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 transition cursor-pointer flex items-center gap-1.5"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>रिमाइंडर ध्वनि टेस्ट करें</span>
            </button>

            <button
              onClick={handleTestFanfare}
              className="px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>टास्क कम्पलीट ध्वनि टेस्ट करें</span>
            </button>
          </div>
        )}

        {/* Browser Notification Button */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              ब्राउज़र पुश नोटिफिकेशन (Push Alerts)
            </span>
            <span className="text-[11px] text-slate-500">
              फोन/ब्राउज़र पर सिस्टम नोटिफिकेशन प्राप्त करें
            </span>
          </div>

          <button
            onClick={handleRequestNotification}
            className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
          >
            अनुमति दें
          </button>
        </div>
      </div>

      {/* Data Backup & Restore */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>डेटा बैकअप एवं सुरक्षा (Data Safety)</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          आपका डेटा सुरक्षित रूप से आपके डिवाइस में सेव रहता है। आप कभी भी बैकअप एक्सपोर्ट कर सकते हैं।
        </p>

        {importStatus && (
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300 font-semibold">
            {importStatus}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={handleExportBackup}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>बैकअप डाउनलोड (Export JSON)</span>
          </button>

          <label className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>बैकअप रीस्टोर (Import JSON)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              if (window.confirm('क्या आप सभी टास्क और डेटा रीसेट करके डिफ़ॉल्ट रूटीन पर लौटना चाहते हैं?')) {
                onResetAllData();
              }
            }}
            className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>डेटा रीसेट करें और डिफ़ॉल्ट रूटीन लोड करें</span>
          </button>
        </div>
      </div>
    </div>
  );
};
