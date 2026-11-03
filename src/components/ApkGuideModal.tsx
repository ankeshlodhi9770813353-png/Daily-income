import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  Copy, 
  Check, 
  Terminal, 
  Package, 
  ExternalLink, 
  CheckCircle2,
  FileCode,
  Layers,
  Sparkles
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ApkGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkGuideModal: React.FC<ApkGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'capacitor' | 'pwa' | 'twa'>('capacitor');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    soundManager.playTapSound();
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const capacitorCommands = [
    {
      title: 'चरण 1: प्रोजेक्ट डायरेक्टरी में Capacitor डिपेंडेंसीज इंस्टॉल करें',
      cmd: `npm install @capacitor/core @capacitor/android\nnpm install -D @capacitor/cli`,
    },
    {
      title: 'चरण 2: Capacitor को कॉन्फ़िगर करें (App Name व ID सेट करें)',
      cmd: `npx cap init "ANKESH DAILY ROUTINE" "com.ankesh.dailyroutine" --web-dir="dist"`,
    },
    {
      title: 'चरण 3: React वेब ऐप को प्रोडक्शन के लिए बिल्ड करें',
      cmd: `npm run build`,
    },
    {
      title: 'चरण 4: Android नेटिव प्रोजेक्ट जोड़ें और कोड सिंक करें',
      cmd: `npx cap add android\nnpx cap sync`,
    },
    {
      title: 'चरण 5: Android Studio में खोलें और APK जनरेट करें',
      cmd: `npx cap open android`,
    },
  ];

  const handleDownloadCapacitorConfig = () => {
    soundManager.playTapSound();
    const config = {
      appId: 'com.ankesh.dailyroutine',
      appName: 'ANKESH DAILY ROUTINE',
      webDir: 'dist',
      bundledWebRuntime: false,
      server: {
        androidScheme: 'https',
      },
      plugins: {
        SplashScreen: {
          launchShowDuration: 1500,
          backgroundColor: '#1E40AF',
        },
      },
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'capacitor.config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadBuildDoc = () => {
    soundManager.playTapSound();
    const markdown = `# ANKESH DAILY ROUTINE - Android APK Build Guide
===================================================

नमस्ते Ankesh! इस ऐप को Android APK में बनाने के लिए निम्नलिखित सरल चरणों का पालन करें:

## तरीका 1: Capacitor के जरिए Android Studio से APK बनाना (अनुशंसित)
1. अपने कंप्यूटर पर टर्मिनल / CMD खोलें और प्रोजेक्ट फोल्डर में जाएं:
   npm install @capacitor/core @capacitor/android
   npm install -D @capacitor/cli

2. Capacitor कॉन्फिगरेशन इनिशियलाइज़ करें:
   npx cap init "ANKESH DAILY ROUTINE" "com.ankesh.dailyroutine" --web-dir="dist"

3. ऐप बिल्ड करें:
   npm run build

4. एंड्रॉइड प्लेटफॉर्म जोड़ें:
   npx cap add android
   npx cap sync

5. Android Studio में खोलें:
   npx cap open android

6. Android Studio के टॉप मेनू में जाएं:
   Build > Build Bundle(s) / APK(s) > Build APK(s)
   
बधाई! आपका APK 'android/app/build/outputs/apk/debug/app-debug.apk' में तैयार हो जाएगा।

## तरीका 2: फोन पर डायरेक्ट इनस्टॉल (Instant PWA Install)
- ऐप को मोबाइल ब्राउज़र (Chrome) में खोलें
- ब्राउज़र मेनू (⋮) पर टैप करें और "Add to Home Screen" या "Install App" चुनें।
- यह बिना किसी कोडिंग के सीधे आपके फोन पर एक नेटिव ऐप की तरह इनस्टॉल हो जाता है!
`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'BUILD_ANDROID_APK.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                ANKESH DAILY ROUTINE — Android APK बिल्ड गाइड
              </h2>
              <p className="text-xs text-blue-100">
                ऐप को Android APK में बदलने के सम्पूर्ण निर्देश एवं फाइल्स
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playTapSound();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              soundManager.playTapSound();
              setActiveTab('capacitor');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === 'capacitor'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            1. Capacitor (Android Studio APK)
          </button>
          <button
            onClick={() => {
              soundManager.playTapSound();
              setActiveTab('pwa');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === 'pwa'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            2. डायरेक्ट फोन इनस्टॉल (PWA)
          </button>
          <button
            onClick={() => {
              soundManager.playTapSound();
              setActiveTab('twa');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === 'twa'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            3. Google Play Store (TWA)
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {activeTab === 'capacitor' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200">
                <p className="font-bold flex items-center gap-1.5 text-blue-700 dark:text-blue-300">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>ऑफिशियल Capacitor विधि (Android Studio):</span>
                </p>
                <p className="mt-1">
                  यह विधि आपके इस रिएक्ट कोड को वास्तविक <strong>.apk</strong> फाइल में बदलती है जिसे आप किसी भी एंड्रॉयड फोन में इनस्टॉल कर सकते हैं।
                </p>
              </div>

              {/* Step by step code commands */}
              <div className="space-y-3">
                {capacitorCommands.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {step.title}
                      </span>

                      <button
                        onClick={() => copyToClipboard(step.cmd, idx)}
                        className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>कॉपी हुआ!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>कॉपी करें</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
                      {step.cmd}
                    </pre>
                  </div>
                ))}
              </div>

              {/* APK Generation Step in Android Studio */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                <h4 className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Android Studio में APK कैसे निकालें:</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1 mt-1.5 text-emerald-900 dark:text-emerald-200 font-medium">
                  <li>Android Studio खुलने के बाद Gradle Sync पूरा होने दें।</li>
                  <li>टॉप मेनू बार में <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong> पर क्लिक करें।</li>
                  <li>बिल्ड पूरा होने पर दाईं तरफ नीचे <strong>"locate"</strong> पर क्लिक करें।</li>
                  <li>आपको <strong>app-debug.apk</strong> मिल जाएगी! इसे सीधे अपने फोन में भेजकर इंस्टॉल कर लें।</li>
                </ol>
              </div>

              {/* Downloadable config files */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={handleDownloadCapacitorConfig}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                >
                  <FileCode className="w-4 h-4" />
                  <span>capacitor.config.json डाउनलोड करें</span>
                </button>

                <button
                  onClick={handleDownloadBuildDoc}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>BUILD_GUIDE.md डाउनलोड करें</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'pwa' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                <h4 className="font-bold text-sm text-amber-800 dark:text-amber-300 mb-1">
                  💡 सबसे आसान तरीका: बिना Android Studio के सीधे फोन में इनस्टॉल करें
                </h4>
                <p>
                  इस ऐप में <strong>Progressive Web App (PWA)</strong> पहले से सक्रिय है। इसका मतलब है कि कोई भी व्यक्ति बिना कंप्यूटर या Android Studio के इसे 1-क्लिक में अपने फोन की होम स्क्रीन पर एक नेटिव ऐप की तरह इनस्टॉल कर सकता है!
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                    Android फोन पर इनस्टॉल करने के स्टेप्स:
                  </h5>
                  <ol className="list-decimal list-inside space-y-1.5 mt-2 text-xs text-slate-700 dark:text-slate-300">
                    <li>अपने फोन के Google Chrome में यह ऐप लिंक खोलें।</li>
                    <li>ऊपर दाहिनी ओर <strong>तीन बिंदुओं (⋮)</strong> पर टैप करें।</li>
                    <li><strong>"Install App"</strong> या <strong>"Add to Home Screen"</strong> पर टैप करें।</li>
                    <li>ऐप का आइकन आपके फोन की होम स्क्रीन पर आ जाएगा और यह फुल-स्क्रीन ऐप की तरह काम करेगा!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'twa' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200">
                <h4 className="font-bold text-sm text-indigo-800 dark:text-indigo-300 mb-1">
                  Google Play Store पैकेजिंग (Bubblewrap / PWABuilder)
                </h4>
                <p>
                  यदि आप इस ऐप को Google Play Store पर प्रकाशित करना चाहते हैं, तो Google का आधिकारिक <strong>Bubblewrap CLI</strong> या <strong>PWABuilder.com</strong> का उपयोग करें।
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 space-y-2">
                <p className="font-bold text-slate-900 dark:text-white">
                  PWABuilder के साथ 1-क्लिक में APK / AAB बनाएं:
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  1. <a href="https://www.pwabuilder.com" target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline inline-flex items-center gap-1">PWABuilder.com <ExternalLink className="w-3 h-3" /></a> पर जाएं।
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  2. अपनी ऐप का URL डालें और <strong>"Package For Stores &gt; Android"</strong> पर क्लिक करें।
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  3. आपको तुरंत हस्ताक्षरित (Signed) <strong>.apk</strong> और <strong>.aab</strong> (Play Store bundle) फ़ाइल डाउनलोड के लिए मिल जाएगी!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            ANKESH DAILY ROUTINE v1.0.0
          </span>
          <button
            onClick={() => {
              soundManager.playTapSound();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
          >
            समझ गया (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
