# ANKESH DAILY ROUTINE (अंकेश दैनिक दिनचर्या) - Android APK Build Guide

इस एप्लिकेशन को Android APK में बदलने के दो प्रमुख और आसान तरीके हैं:

---

## 🚀 तरीका 1: Capacitor के माध्यम से Android Studio से APK बनाना (Official Native App)

यदि आप वास्तविक **.apk** या Google Play Store के लिए **.aab** फ़ाइल बनाना चाहते हैं, तो यह तरीका सबसे उपयुक्त है।

### आवश्यकताएं:
1. कंप्यूटर पर **Node.js** (v18+)
2. **Android Studio** (नवीनतम संस्करण Android SDK के साथ)

### स्टेप-बाय-स्टेप निर्देश:

#### 1. प्रोजेक्ट डायरेक्टरी में जाएं और आवश्यक पैकेजेस इंस्टॉल करें:
```bash
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli
```

#### 2. Capacitor प्रोजेक्ट कॉन्फ़िगर करें:
(`capacitor.config.json` पहले से ही प्रोजेक्ट में मौजूद है):
```bash
npx cap init "ANKESH DAILY ROUTINE" "com.ankesh.dailyroutine" --web-dir="dist"
```

#### 3. React ऐप को प्रोडक्शन के लिए बिल्ड करें:
```bash
npm run build
```

#### 4. Android नेटिव प्लेटफॉर्म जोड़ें:
```bash
npx cap add android
npx cap sync
```

#### 5. Android Studio में प्रोजेक्ट खोलें:
```bash
npx cap open android
```

#### 6. APK फाइल जनरेट करें:
1. Android Studio में Gradle सिंक होने का इंतज़ार करें।
2. टॉप मेनू बार में जाएँ: **Build > Build Bundle(s) / APK(s) > Build APK(s)**
3. प्रोसेस पूरा होने पर नीचे दाईं ओर **"locate"** लिंक पर क्लिक करें।
4. आपको **app-debug.apk** फाइल मिल जाएगी। इसे अपने फोन में ट्रांसफर करें और इंस्टॉल करें!

---

## 📱 तरीका 2: फोन पर डायरेक्ट इनस्टॉल (Progressive Web App - 100% Offline)

इस ऐप में पहले से ही पूर्ण PWA समर्थन (Service Worker + Web App Manifest) शामिल है। 

### कैसे इस्तेमाल करें:
1. अपने Android फोन में **Google Chrome** ब्राउज़र में यह ऐप खोलें।
2. ऊपर दाईं ओर **⋮ (3 डॉट्स)** मेनू पर टैप करें।
3. **"Install App"** या **"Add to Home screen" (होम स्क्रीन में जोड़ें)** पर टैप करें।
4. ऐप का सुंदर Blue Icon आपके फोन की होम स्क्रीन पर आ जाएगा और यह बिना किसी एड्रेस बार के एक बिल्कुल असली Android App की तरह खुलेगा!

---

## 🌐 तरीका 3: PWABuilder के साथ Google Play Store APK बनाना

1. [PWABuilder.com](https://www.pwabuilder.com/) वेबसाइट खोलें।
2. अपनी ऐप का लाइव URL डालें और **Start** दबाएं।
3. **Package for Stores > Android** चुनें।
4. डाउनलोड बटन पर क्लिक करके साइन्ड APK और Google Play Store AAB पैकेज प्राप्त करें!
