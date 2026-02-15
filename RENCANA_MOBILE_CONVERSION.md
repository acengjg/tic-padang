# Rencana Konversi ke Aplikasi Mobile Android & iOS
## TIC Padang Tourism Application

> **Dokumen Versi:** 1.0  
> **Tanggal:** 14 Februari 2026  
> **Status:** Draft untuk Review

---

## 📱 Ringkasan Eksekutif

Dokumen ini menguraikan strategi konversi aplikasi web TIC Padang yang ada menjadi aplikasi mobile native untuk platform Android dan iOS. Aplikasi saat ini dibangun dengan React, TypeScript, dan Vite, dengan backend Express dan Prisma ORM.

**Rekomendasi Utama:** Menggunakan **React Native dengan Expo** sebagai solusi utama untuk konversi mobile.

---

## 🎯 Objektif Konversi

### Tujuan Bisnis
- Meningkatkan aksesibilitas dengan aplikasi native di App Store dan Play Store
- Memberikan pengalaman pengguna yang lebih baik dengan performa native
- Memanfaatkan fitur mobile seperti GPS, kamera, notifikasi push, dan offline mode
- Memperluas jangkauan pengguna dengan distribusi melalui app stores

### Tujuan Teknis
- Mempertahankan sebagian besar kode UI yang sudah ada (React components)
- Minimalisir duplikasi kode dengan code sharing maksimal
- Memastikan performa optimal di kedua platform
- Mempermudah maintenance dengan single codebase

---

## 🔍 Analisis Aplikasi Saat Ini

### Stack Teknologi
```
Frontend: React 19, TypeScript, Tailwind CSS
Build Tool: Vite
Backend: Express.js, Prisma ORM
Database: PostgreSQL
UI Components: Lucide React, Leaflet Maps
Media: Pannellum (360° tours), React Player
```

### Fitur Utama yang Perlu Dikonversi
1. **Authentication & User Management**
   - Login/Register dengan JWT
   - Profile management dengan avatar upload
   - Role-based access (User, Guide, Admin)

2. **Core Features**
   - Explore destinations (dengan map Leaflet)
   - Kuliner spots (dengan map dan reviews)
   - Event listing dan detail
   - Guide marketplace & booking
   - Travel buddy matching
   - AI Trip Planner
   - 360° Virtual Tours

3. **Social Features**
   - Stories (seperti Instagram)
   - Reviews & ratings
   - In-app messaging
   - Public profiles

4. **Location-Based Features**
   - Interactive maps
   - Geolocation tracking
   - Navigation routing

5. **Media Features**
   - Image uploads (untuk kuliner, stories, dll)
   - Video playback
   - 360° panoramic viewer

---

## � Opsi Tercepat: WebView Wrapper (Implementasi Langsung)

### 💡 Konsep
Cara paling mudah dan cepat untuk membuat aplikasi mobile adalah dengan **membungkus aplikasi web VPS yang sudah ada** menggunakan WebView. Dengan pendekatan ini, aplikasi mobile hanya berperan sebagai "browser khusus" yang menampilkan website dari VPS.

### ✨ Keunggulan Pendekatan Ini
✅ **Auto-Sync Data** - Perubahan data di VPS langsung terlihat di apps tanpa update app  
✅ **Auto-Update UI** - Perubahan tampilan/fitur di VPS langsung aktif di apps  
✅ **Zero Code Duplication** - Tidak perlu menulis ulang fitur apapun  
✅ **Quick Implementation** - Bisa selesai dalam 1-2 minggu  
✅ **Minimal Maintenance** - Cukup maintain 1 codebase (web app)  
✅ **Low Cost** - Budget ~Rp 10-20 juta saja  

### ⚡ Implementasi Cepat dengan Capacitor

### 📦 Prerequisites & Setup Lengkap

Sebelum memulai, pastikan system Anda memenuhi requirements berikut:

#### System Requirements

**Untuk Android Development:**
- OS: Windows 10/11, macOS, atau Linux (Ubuntu 20.04+)
- RAM: Minimum 8GB (Recommended 16GB)
- Storage: 10GB free space
- Processor: Intel i5 atau setara

**Untuk iOS Development:**
- OS: macOS 12.0 (Monterey) atau lebih baru
- RAM: Minimum 8GB (Recommended 16GB)
- Storage: 20GB free space
- Processor: Intel atau Apple Silicon

---

### 🔧 Instalasi Tools (Step-by-Step)

#### 1️⃣ Node.js & npm (Required)

**Check instalasi existing:**
```bash
node --version  # Should be v18+ or v20+
npm --version   # Should be v9+ or v10+
```

**Jika belum terinstall atau versi lama:**

**Linux (Ubuntu/Debian):**
```bash
# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

**macOS:**
```bash
# Install Homebrew dulu jika belum ada
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node@20

# Verify
node --version
npm --version
```

**Windows:**
```
1. Download installer dari: https://nodejs.org/en/download/
2. Pilih "20.x.x LTS" version
3. Install dengan default settings
4. Restart terminal/PowerShell
5. Verify: node --version
```

---

#### 2️⃣ Java Development Kit (JDK) - Required untuk Android

**Check instalasi existing:**
```bash
java --version  # Should be Java 17 or 21
```

**Jika belum terinstall:**

**Linux (Ubuntu/Debian):**
```bash
# Install OpenJDK 17
sudo apt update
sudo apt install openjdk-17-jdk

# Set JAVA_HOME
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Verify
java --version
echo $JAVA_HOME
```

**macOS:**
```bash
# Install via Homebrew
brew install openjdk@17

# Link Java
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk

# Set JAVA_HOME
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v17)' >> ~/.zshrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.zshrc
source ~/.zshrc

# Verify
java --version
```

**Windows:**
```
1. Download dari: https://adoptium.net/temurin/releases/
2. Pilih version 17 (LTS), Windows x64, JDK
3. Install dengan default settings
4. Set Environment Variables:
   - System Properties → Advanced → Environment Variables
   - New System Variable: JAVA_HOME = C:\Program Files\Eclipse Adoptium\jdk-17.x.x
   - Edit PATH, tambahkan: %JAVA_HOME%\bin
5. Restart terminal
6. Verify: java --version
```

---

#### 3️⃣ Android Studio (Required untuk Android)

**Download & Install:**

**Semua Platform:**
```
1. Download dari: https://developer.android.com/studio
2. Install dengan default settings
3. Tunggu initial setup selesai (download SDK components)
```

**Setup Android SDK:**

**Linux/macOS:**
```bash
# Set Android SDK path
# Di Linux biasanya: ~/Android/Sdk
# Di macOS biasanya: ~/Library/Android/sdk

echo 'export ANDROID_HOME=~/Android/Sdk' >> ~/.bashrc  # Linux
# atau
echo 'export ANDROID_HOME=~/Library/Android/sdk' >> ~/.zshrc  # macOS

echo 'export PATH=$ANDROID_HOME/platform-tools:$PATH' >> ~/.bashrc
echo 'export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$PATH' >> ~/.bashrc
echo 'export PATH=$ANDROID_HOME/emulator:$PATH' >> ~/.bashrc

source ~/.bashrc  # atau source ~/.zshrc untuk macOS

# Verify
adb --version
```

**Windows:**
```
1. Set Environment Variables:
   - ANDROID_HOME = C:\Users\YourName\AppData\Local\Android\Sdk
   - Edit PATH, tambahkan:
     * %ANDROID_HOME%\platform-tools
     * %ANDROID_HOME%\cmdline-tools\latest\bin
     * %ANDROID_HOME%\emulator
2. Restart terminal
3. Verify: adb --version
```

**Install Required SDK Components:**
```bash
# Buka Android Studio
# Tools → SDK Manager

# Install (check boxes):
✅ Android SDK Platform 34 (Android 14)
✅ Android SDK Platform 33 (Android 13)
✅ Android SDK Build-Tools 34.0.0
✅ Android Emulator
✅ Android SDK Platform-Tools
✅ Intel/AMD x86 Emulator Accelerator (HAXM/WHPX)

# Click "Apply" untuk download & install
```

**Create Android Virtual Device (AVD):**
```
1. Di Android Studio: Tools → Device Manager
2. Click "Create Device"
3. Pilih Phone → Pixel 6 → Next
4. Download system image: Android 13 (API 33) → Next
5. Finish
6. Test dengan click Play ▶️ button
```

---

#### 4️⃣ Xcode (Required untuk iOS - macOS only)

**Install dari App Store:**
```
1. Buka App Store di macOS
2. Search "Xcode"
3. Click "Get" (free, tapi download ~12GB)
4. Tunggu download & install selesai (~30-60 menit)
```

**Setup Command Line Tools:**
```bash
# Install Xcode Command Line Tools
sudo xcode-select --install

# Accept license
sudo xcodebuild -license accept

# Install CocoaPods (untuk iOS dependencies)
sudo gem install cocoapods

# Verify
xcodebuild -version
pod --version
```

**Create iOS Simulator:**
```
1. Buka Xcode
2. Window → Devices and Simulators
3. Click "+" untuk add simulator
4. Pilih: iPhone 15 Pro, iOS 17.x
5. Click Create
```

---

#### 5️⃣ Git (Required)

**Check instalasi:**
```bash
git --version
```

**Jika belum ada:**

**Linux:**
```bash
sudo apt install git
```

**macOS:**
```bash
brew install git
# atau sudah include di Xcode Command Line Tools
```

**Windows:**
```
Download dari: https://git-scm.com/download/win
Install dengan default settings
```

---

### ⚡ Instalasi Capacitor di Project

Setelah semua tools terinstall, setup Capacitor:

#### Step 1: Install Capacitor (5 menit)
```bash
cd /home/t480s/Documents/Aplikasi/tic

# Install Capacitor
npm install @capacitor/core @capacitor/cli

# Initialize Capacitor
npx cap init "TIC Padang" "com.ticpadang.app"

# Add platforms
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
```

**Output yang diharapkan:**
```
✔ Creating capacitor.config.ts in /home/t480s/Documents/Aplikasi/tic
✔ Creating android project
✔ Creating ios project
✔ Syncing plugins to android
✔ Syncing plugins to ios
✔ Copying web assets from dist to android/app/src/main/assets/public
✔ Copying web assets from dist to ios/App/App/public
```

**Troubleshooting:**
- Jika error "dist not found": Run `npm run build` dulu
- Jika error permissions: Run dengan `sudo` (Linux/macOS)
- Jika iOS add gagal (bukan macOS): Skip iOS, fokus Android dulu

#### Step 2: Configure untuk VPS URL (10 menit)
Edit `capacitor.config.ts`:
```typescript
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.ticpadang.app',
  appName: 'TIC Padang',
  webDir: 'dist',
  server: {
    // URL VPS production
    url: 'http://103.141.74.87:3001',
    cleartext: true // allow HTTP
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#006400", // padang-green
      showSpinner: false
    }
  }
};

export default config;
```

#### Step 3: Install Native Plugins (15 menit)
```bash
# Core plugins untuk fitur native
npm install @capacitor/camera
npm install @capacitor/geolocation
npm install @capacitor/push-notifications
npm install @capacitor/filesystem
npm install @capacitor/network
npm install @capacitor/splash-screen

# Sync ke native projects
npx cap sync
```

#### Step 4: Tambahkan Native Features di Web (30 menit)
Update `client.ts` untuk detect dan gunakan native capabilities:
```typescript
import { Camera } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { PushNotifications } from '@capacitor/push-notifications';

// Check if running in native app
const isNativeApp = () => {
  return (window as any).Capacitor !== undefined;
};

// Upload gambar dengan native camera
export const uploadImageNative = async () => {
  if (!isNativeApp()) {
    // Fallback ke web file input
    return uploadImageWeb();
  }
  
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: 'base64'
  });
  
  // Upload ke server
  return uploadBase64Image(image.base64String);
};

// Get location dengan native GPS
export const getCurrentLocationNative = async () => {
  if (!isNativeApp()) {
    return navigator.geolocation.getCurrentPosition();
  }
  
  const position = await Geolocation.getCurrentPosition();
  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
};

// Setup push notifications
export const initPushNotifications = async () => {
  if (!isNativeApp()) return;
  
  await PushNotifications.requestPermissions();
  await PushNotifications.register();
  
  PushNotifications.addListener('registration', (token) => {
    console.log('Push token:', token.value);
    // Send ke server untuk save
    apiService.savePushToken(token.value);
  });
  
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push received:', notification);
  });
};
```

#### Step 5: Build & Test (1 jam)

**Android:**
```bash
# Build web app
npm run build

# Copy ke native project
npx cap sync android

# Open di Android Studio
npx cap open android

# Di Android Studio:
# 1. Connect device atau emulator
# 2. Click Run ▶️
```

**iOS:**
```bash
# Build web app
npm run build

# Copy ke native project
npx cap sync ios

# Open di Xcode
npx cap open ios

# Di Xcode:
# 1. Select device atau simulator
# 2. Click Run ▶️
```

### 🔄 Workflow Update Aplikasi

#### Skenario 1: Update Data (0 menit - Auto)
```
Developer update data di VPS (tambah destinasi, kuliner, dll)
           ↓
Data tersimpan di PostgreSQL
           ↓
User buka app → Load dari VPS → Data baru muncul ✅
```
**Tidak perlu update app sama sekali!**

#### Skenario 2: Update UI/Fitur (0 menit - Auto)
```
Developer update tampilan/fitur di web (edit screens/*.tsx)
           ↓
Deploy ke VPS (npm run build + rsync)
           ↓
User refresh app → UI baru muncul ✅
```
**Tidak perlu submit ke App Store/Play Store!**

#### Skenario 3: Update Native Features (perlu update app)
```
Tambah plugin native baru (misal: fingerprint auth)
           ↓
npm install plugin → npx cap sync
           ↓
Build baru → Submit ke stores
           ↓
User update app dari store
```
**Hanya untuk native features, jarang terjadi**

### 📱 App Icon & Splash Screen

#### Generate Icons (gunakan tool online)
```bash
# Download icon generator: https://icon.kitchen
# Upload logo TIC Padang (1024x1024)
# Download Android & iOS icons

# Extract ke:
android/app/src/main/res/  # Android icons
ios/App/App/Assets.xcassets/AppIcon.appiconset/  # iOS icons
```

#### Splash Screen
Buat file `resources/splash.png` (2732x2732px):
```bash
npm install @capacitor/assets --save-dev
npx capacitor-assets generate
```

### 🚀 Deploy ke Stores

#### Google Play Store (Android)
```bash
# 1. Generate signed APK di Android Studio:
#    Build → Generate Signed Bundle/APK → APK
#    Create new keystore, fill details, build

# 2. Upload ke Google Play Console:
#    - Create app listing
#    - Upload APK (app-release.apk)
#    - Fill metadata (description, screenshots)
#    - Submit for review
```

**Biaya:** $25 sekali seumur hidup  
**Review time:** 1-3 hari

#### Apple App Store (iOS)
```bash
# 1. Archive di Xcode:
#    Product → Archive
#    Distribute App → App Store Connect

# 2. Upload ke App Store Connect:
#    - Fill app information
#    - Upload screenshots
#    - Submit for review
```

**Biaya:** $99/tahun  
**Review time:** 1-3 hari

### 💰 Total Biaya WebView Approach

| Item | Biaya |
|------|-------|
| **Development (1 developer, 2 minggu)** | Rp 5.000.000 - Rp 10.000.000 |
| **Apple Developer Account** | Rp 1.500.000/tahun |
| **Google Play Account** | Rp 400.000 (sekali) |
| **App Icons & Graphics** | Rp 1.000.000 - Rp 2.000.000 |
| **Testing Devices** | Rp 5.000.000 (opsional) |
| **Total** | **Rp 7.900.000 - Rp 13.900.000** |

### ⚖️ Perbandingan: WebView vs React Native

| Aspek | WebView (Capacitor) | React Native |
|-------|---------------------|--------------|
| **Timeline** | 1-2 minggu | 4-5 bulan |
| **Budget** | Rp 10-15 juta | Rp 130-200 juta |
| **Performa** | Good (90%) | Excellent (100%) |
| **UX Native** | ⚠️ Web-like | ✅ Native feel |
| **Auto-sync Data** | ✅ Ya | ✅ Ya |
| **Auto-update UI** | ✅ Ya | ❌ Perlu app update |
| **Offline Mode** | ⚠️ Limited | ✅ Full support |
| **Native Features** | ⚠️ Via plugins | ✅ Full access |
| **Maintenance** | ✅ Sangat mudah | ⚠️ Medium |

### 🎯 Rekomendasi Langkah

#### Opsi A: Quick Start (WebView) → Upgrade Later
1. **Week 1-2:** Implement WebView wrapper dengan Capacitor
2. **Week 3:** Submit ke App Store & Play Store
3. **Month 2-3:** Gather user feedback
4. **Month 4+:** Jika perlu performa lebih baik, migrate ke React Native

**Keuntungan:** 
- Quick validation & presence di app stores
- Low risk investment
- Bisa upgrade nanti jika diperlukan

#### Opsi B: All-In React Native
1. Langsung develop dengan React Native
2. Timeline 4-5 bulan
3. Best UX dari awal

**Keuntungan:**
- Native experience dari awal
- Scalable untuk jangka panjang
- Better offline & performance

### 📋 Checklist Implementasi WebView

- [ ] Install Capacitor di project existing
- [ ] Configure untuk point ke VPS URL
- [ ] Install native plugins (Camera, Geolocation, Push)
- [ ] Update web code untuk detect native capabilities
- [ ] Generate app icons & splash screen
- [ ] Test di Android device/emulator
- [ ] Test di iOS device/simulator
- [ ] Build signed APK untuk Android
- [ ] Archive untuk iOS
- [ ] Create Google Play listing
- [ ] Create App Store listing
- [ ] Submit untuk review
- [ ] Monitor reviews & analytics

### ⚠️ Catatan Penting

1. **CORS:** Pastikan VPS server allow requests dari app
   ```typescript
   // Di server.ts
   app.use(cors({
     origin: ['capacitor://localhost', 'http://localhost'],
     credentials: true
   }));
   ```

2. **HTTPS:** Untuk production, gunakan HTTPS di VPS
   ```bash
   # Install SSL certificate dengan Let's Encrypt
   sudo certbot --nginx -d ticpadang.com
   ```

3. **Performance:** Web di WebView ~90% performa native
   - Masih sangat acceptable untuk most users
   - Jika butuh scrolling super smooth → upgrade ke RN later

---

## �🛠️ Opsi Teknologi Konversi

### Opsi 1: React Native dengan Expo (⭐ REKOMENDASI)

#### Keunggulan
✅ **Reuse Code Maksimal** - 70-80% kode React dapat digunakan kembali  
✅ **Ekosistem Kuat** - Library lengkap dan komunitas besar  
✅ **Expo Managed Workflow** - Simplifikasi build, deployment, dan OTA updates  
✅ **Developer Experience** - Hot reload, debugging tools excellent  
✅ **Native Performance** - Kompilasi ke native code  
✅ **Single Codebase** - Platform-agnostic dengan conditional code minimal  

#### Kekurangan
❌ **File Size** - APK/IPA lebih besar dibanding native murni  
❌ **Custom Native Modules** - Butuh eject untuk fitur native khusus  

#### Estimasi Effort
- **Timeline:** 3-4 bulan (dengan 2 developer full-time)
- **Code Reuse:** 70-80%
- **Kompleksitas:** Medium

---

### Opsi 2: Capacitor (Ionic)

#### Keunggulan
✅ **Web-First Approach** - Wrapper WebView dengan plugin native  
✅ **Minimal Code Changes** - Hampir 90% kode dapat dipertahankan  
✅ **Quick to Market** - Fastest time to production  

#### Kekurangan
❌ **Performance** - WebView lebih lambat dari native rendering  
❌ **UI/UX** - Tidak terasa "native" seperti RN  
❌ **Animation** - Smoothness terbatas  

#### Estimasi Effort
- **Timeline:** 1-2 bulan
- **Code Reuse:** 90%
- **Kompleksitas:** Low

---

### Opsi 3: Flutter

#### Keunggulan
✅ **Performance** - Excellent rendering dengan Skia engine  
✅ **Beautiful UI** - Material Design dan Cupertino widgets  
✅ **Single Codebase** - Dart language untuk semua platform  

#### Kekurangan
❌ **Complete Rewrite** - Perlu menulis ulang semua UI dalam Dart/Flutter  
❌ **Learning Curve** - Team perlu belajar Dart dan Flutter  
❌ **Backend Integration** - Perlu adaptasi client API  

#### Estimasi Effort
- **Timeline:** 5-6 bulan
- **Code Reuse:** 0% (rewrite)
- **Kompleksitas:** High

---

## ⚡ Strategi Rekomendasi: React Native + Expo

### Arsitektur Sistem

```
┌─────────────────────────────────────────────────┐
│           Mobile Apps (React Native)            │
│  ┌──────────────────┐  ┌──────────────────┐    │
│  │   iOS App        │  │   Android App    │    │
│  │  (App Store)     │  │  (Play Store)    │    │
│  └──────────────────┘  └──────────────────┘    │
│              │                  │               │
│              └──────────────────┘               │
│                      │                          │
└──────────────────────┼──────────────────────────┘
                       │
                       │ REST API (HTTPS)
                       │
┌──────────────────────▼──────────────────────────┐
│          Backend Server (Existing)              │
│  Express.js + Prisma + PostgreSQL               │
│  (Tetap di VPS, minimal changes)                │
└─────────────────────────────────────────────────┘
```

### Komponen yang Dapat Digunakan Kembali

#### ✅ Dapat Langsung Digunakan
- Business logic (API client, state management)
- Type definitions (types.ts)
- Utility functions
- Constants dan konfigurasi
- Context providers (LanguageContext)

#### 🔄 Perlu Adaptasi
- UI Components (ganti implementasi dengan React Native components)
- Styling (Tailwind → React Native StyleSheet / NativeWind)
- Navigation (dari state management → React Navigation)
- Maps (Leaflet → React Native Maps)
- 360 Viewer (Pannellum → React Native VR/360 library)

#### ❌ Tidak Dapat Digunakan
- HTML/CSS spesifik
- Vite build configuration
- DOM manipulation
- Browser-specific APIs

---

## 📋 Rencana Implementasi

### **Phase 1: Persiapan dan Setup (2-3 minggu)**

#### Setup Development Environment
```bash
# Install Expo CLI
npm install -g expo-cli

# Create new Expo project
npx create-expo-app tic-padang-mobile --template blank-typescript

# Install dependencies
npx expo install react-native-maps
npx expo install expo-location
npx expo install @react-navigation/native
npx expo install react-native-gesture-handler
npx expo install expo-image-picker
npx expo install expo-notifications
```

#### Struktur Folder
```
tic-padang-mobile/
├── src/
│   ├── screens/          # Screen components
│   ├── components/       # Reusable components
│   ├── navigation/       # React Navigation config
│   ├── services/         # API client (reuse from web)
│   ├── contexts/         # Context providers (reuse)
│   ├── types/            # TypeScript types (reuse)
│   ├── utils/            # Utilities (reuse)
│   ├── constants/        # Constants (reuse)
│   └── assets/           # Images, fonts, etc.
├── app.json
├── package.json
└── tsconfig.json
```

#### Tasks
- [ ] Setup Expo project dengan TypeScript
- [ ] Configure React Navigation 6
- [ ] Setup API client (reuse from web app)
- [ ] Configure environment variables
- [ ] Setup NativeWind (Tailwind for RN) atau StyleSheet
- [ ] Configure build settings (app.json)

---

### **Phase 2: Core UI & Navigation (3-4 minggu)**

#### Implementasi Navigation Structure
```typescript
// App Navigator
- Tab Navigator (Bottom Tabs)
  - Home Screen
  - Explore Screen
  - Culinary Screen
  - Plan Screen
  - Profile Screen

- Stack Navigators
  - Auth Stack (Login, Register)
  - Detail Stack (Destination Detail, Culinary Detail)
  - Booking Stack
  - Chat Stack
  - Admin Stack
```

#### UI Component Migration
- [ ] Konversi komponen dasar (Button, Card, Input, dll)
- [ ] Implementasi Bottom Tab Navigation
- [ ] Buat Layout components (Header, SafeArea)
- [ ] Setup theming system (colors, fonts)
- [ ] Implementasi responsive design utilities

---

### **Phase 3: Authentication & User Management (2 minggu)**

#### Features
- [ ] Login & Register screens
- [ ] JWT token management dengan AsyncStorage
- [ ] Secure storage untuk credentials
- [ ] Profile screen dan edit profile
- [ ] Avatar upload dengan expo-image-picker
- [ ] Logout functionality
- [ ] Role-based navigation guards

#### Native Features Integration
- [ ] Biometric authentication (fingerprint/face)
- [ ] Secure credential storage (expo-secure-store)

---

### **Phase 4: Main Features Implementation (6-8 minggu)**

#### Home Screen (1 minggu)
- [ ] Stories carousel (dengan video support)
- [ ] Promotions slider
- [ ] Quick access menu
- [ ] Events list
- [ ] Weather widget

#### Explore & Culinary Screens (2 minggu)
- [ ] **React Native Maps** integration
  ```bash
  npx expo install react-native-maps
  ```
- [ ] Custom map markers
- [ ] Location permissions
- [ ] GPS tracking
- [ ] Search functionality
- [ ] Filter dan category chips
- [ ] List/Map view toggle
- [ ] Detail screens dengan image galleries

#### Plan Screen (1 minggu)
- [ ] Plan creation dan editing
- [ ] Date picker (native calendar)
- [ ] Reminder notifications dengan expo-notifications
- [ ] AI recommendations integration

#### Guide Marketplace & Booking (2 minggu)
- [ ] Package listing dan detail
- [ ] Booking flow dengan payment
- [ ] Guide dashboard (untuk guide users)
- [ ] Booking management
- [ ] In-app messaging

#### Other Features (2 minggu)
- [ ] Events screen
- [ ] Travel Buddy
- [ ] AI Trip Planner
- [ ] Settings screen
- [ ] Multi-language support

---

### **Phase 5: Advanced Features (3-4 minggu)**

#### 360° Virtual Tours
```bash
npx expo install react-native-webview
# Atau gunakan library seperti:
# - react-native-panorama-viewer
# - react-viro (untuk VR/AR)
```
- [ ] Panoramic image viewer
- [ ] Hotspot interactions
- [ ] Audio narration playback

#### Stories Feature
- [ ] Camera integration dengan expo-camera
- [ ] Video recording
- [ ] Image filters (optional)
- [ ] Story upload
- [ ] Story viewer dengan progress

#### Notifications
- [ ] Setup Expo push notifications
- [ ] Local notifications untuk reminders
- [ ] In-app notification center
- [ ] Deep linking dari notifications

#### Maps & Navigation
- [ ] Direction routing
- [ ] Turn-by-turn navigation (Google Maps integration)
- [ ] Distance calculation
- [ ] Nearby places

---

### **Phase 6: Offline Support & Performance (2 minggu)**

#### Offline Capabilities
```bash
npx expo install @react-native-async-storage/async-storage
npx expo install expo-sqlite
```
- [ ] Cache API responses
- [ ] Offline mode indicator
- [ ] Queue sync untuk actions
- [ ] Local SQLite database untuk critical data
- [ ] Image caching

#### Performance Optimization
- [ ] Image lazy loading
- [ ] List virtualization (FlatList)
- [ ] Memoization (useMemo, React.memo)
- [ ] Code splitting
- [ ] Bundle size optimization

---

### **Phase 7: Testing & QA (3 minggu)**

#### Unit Testing
```bash
npm install --save-dev jest @testing-library/react-native
```
- [ ] Setup Jest untuk RN
- [ ] Test utilities dan helpers
- [ ] Test API client
- [ ] Test Redux/Context logic

#### Integration Testing
- [ ] Test navigation flows
- [ ] Test authentication flow
- [ ] Test booking flow
- [ ] Test payment integration

#### Manual Testing
- [ ] Test di berbagai devices (iOS & Android)
- [ ] Test di berbagai screen sizes
- [ ] Test offline scenarios
- [ ] Test edge cases
- [ ] Test dengan user sebenarnya (beta testing)

#### Performance Testing
- [ ] Load time measurement
- [ ] Memory profiling
- [ ] Network efficiency
- [ ] Battery consumption

---

### **Phase 8: Deployment (2-3 minggu)**

#### App Store Preparation
- [ ] Create Apple Developer account ($99/year)
- [ ] Setup App Store Connect
- [ ] Prepare screenshots (berbagai device sizes)
- [ ] Write app description (ID, EN, AR)
- [ ] Create app icons (1024x1024)
- [ ] Privacy policy URL
- [ ] Terms of service

#### Google Play Preparation
- [ ] Create Google Play Console account ($25 one-time)
- [ ] Setup Google Play listing
- [ ] Prepare screenshots dan feature graphics
- [ ] Write app description (ID, EN, AR)
- [ ] Create app icons dan promotional graphics
- [ ] Privacy policy
- [ ] Content rating questionnaire

#### Build & Submit
```bash
# iOS Build
eas build --platform ios

# Android Build
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

#### Post-Launch
- [ ] Monitor crash reports (Sentry/Crashlytics)
- [ ] Monitor analytics (Firebase Analytics)
- [ ] Monitor reviews
- [ ] OTA updates untuk bug fixes
- [ ] Version planning

---

## 💰 Estimasi Biaya

### Development Costs
| Item | Estimasi Biaya |
|------|----------------|
| **Developer (2 orang × 4 bulan)** | Rp 80.000.000 - Rp 120.000.000 |
| **UI/UX Designer (part-time)** | Rp 15.000.000 - Rp 25.000.000 |
| **QA Tester (1 bulan)** | Rp 7.500.000 - Rp 10.000.000 |
| **Project Manager (part-time)** | Rp 10.000.000 - Rp 15.000.000 |
| **Total Development** | **Rp 112.500.000 - Rp 170.000.000** |

### Infrastructure & Tools
| Item | Biaya/Tahun |
|------|-------------|
| **Apple Developer Account** | $99 (~Rp 1.500.000) |
| **Google Play Developer** | $25 one-time (~Rp 400.000) |
| **Expo EAS Build & Submit** | $29/month (~Rp 5.500.000/tahun) |
| **Firebase (Analytics, Crashlytics)** | Free - $25/month |
| **Push Notification Service** | Free (Expo) |
| **Testing Devices** | Rp 10.000.000 - Rp 20.000.000 |
| **Total Infrastructure (Year 1)** | **Rp 17.400.000 - Rp 27.400.000** |

### Maintenance (per tahun setelah launch)
- Bug fixes & updates: Rp 30.000.000 - Rp 50.000.000/tahun
- Server costs (jika scale): +Rp 15.000.000 - Rp 30.000.000/tahun

---

## 📅 Timeline Keseluruhan

```
Bulan 1:  ████████░░  Phase 1 & 2 (Setup + Core UI)
Bulan 2:  ░░████████  Phase 3 & 4.1 (Auth + Home)
Bulan 3:  ░░░░██████  Phase 4.2-4.4 (Main Features)
Bulan 4:  ░░░░░░████  Phase 5 & 6 (Advanced + Offline)
Bulan 5:  ░░░░░░░░██  Phase 7 & 8 (Testing + Deploy)

Total: 4-5 bulan dengan 2 developers
```

### Milestones
- **Week 4:** Demo internal (Auth + Navigation)
- **Week 8:** Alpha release (Core features working)
- **Week 12:** Beta release (All features, internal testing)
- **Week 16:** Release Candidate (QA complete)
- **Week 18-20:** Production launch di stores

---

## 🎯 Kriteria Sukses

### Metrics Launch
- [ ] App tersedia di iOS App Store dan Google Play Store
- [ ] Support minimal iOS 13+ dan Android 8+
- [ ] Crash rate < 1%
- [ ] App loading time < 3 detik
- [ ] Rating ≥ 4.0 stars setelah 1 bulan

### User Engagement
- [ ] 1,000+ downloads dalam bulan pertama
- [ ] Daily Active Users (DAU) ≥ 20%
- [ ] Average session duration ≥ 5 menit
- [ ] Feature adoption: 60%+ users menggunakan maps & explore

---

## ⚠️ Risiko & Mitigasi

### Risiko Teknis
| Risiko | Impact | Mitigasi |
|--------|--------|----------|
| **Performa maps di RN** | Medium | Gunakan react-native-maps native module, optimasi marker rendering |
| **360° viewer compatibility** | High | Evaluasi library early, fallback ke WebView jika perlu |
| **Offline sync complexity** | Medium | Start simple, iterate based on usage patterns |
| **Push notification reliability** | Medium | Use Expo push service + FCM fallback |

### Risiko Bisnis
| Risiko | Impact | Mitigasi |
|--------|--------|----------|
| **App store rejection** | High | Follow guidelines strictly, prepare documentation |
| **Low adoption** | High | Marketing campaign, incentives untuk early adopters |
| **High server costs** | Medium | Optimize API calls, implement caching, monitor usage |

---

## 🔄 Alternatif: Pendekatan Hybrid (Capacitor)

Jika timeline ketat atau budget terbatas, **Capacitor** bisa jadi alternatif:

### Pros
- **Faster to market:** 1-2 bulan vs 4-5 bulan
- **Lower cost:** ~50% lebih murah
- **Minimal code changes:** Wrap existing web app

### Cons
- **Performance:** Tidak sebaik React Native
- **UX:** Terasa kurang "native"
- **Limitations:** Beberapa fitur native terbatas

### Kapan Memilih Capacitor?
- Timeline sangat ketat (perlu launch < 2 bulan)
- Budget terbatas
- MVP/proof of concept
- User base tidak terlalu demand performa tinggi

---

## 📚 Resources & Learning

### Documentation
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)

### Tools
- **Expo Go:** Testing app di device real-time
- **EAS Build:** Cloud build service
- **Flipper:** Debugging tool
- **Reactotron:** State inspection

### Community
- React Native Directory: Library discovery
- Expo Forums: Support community
- Stack Overflow: Troubleshooting

---

## ✅ Rekomendasi Akhir

### Phase 1 (Recommended): React Native + Expo
**Timeline:** 4-5 bulan  
**Budget:** Rp 130M - Rp 200M (development + infrastructure)  
**ROI:** High - Native experience, scalable, maintainable

**Next Steps:**
1. Approve budget dan timeline
2. Recruit/assign 2 React Native developers
3. Setup development environment (Week 1)
4. Kickoff development (Week 2)
5. Weekly demos dan reviews

### Alternative: Phased Approach
**Phase A:** Capacitor MVP (2 bulan, Rp 60M)
- Quick validation di app stores
- Gather user feedback

**Phase B:** React Native Migration (3 bulan, Rp 100M)
- Replace Capacitor dengan RN
- Better UX berdasarkan feedback

---

## 📞 Kontak & Dukungan

Untuk pertanyaan atau diskusi lebih lanjut tentang rencana ini, silakan hubungi tim development.

**Prepared by:** AI Assistant  
**Review Required:** Project Manager, Tech Lead, Stakeholders  
**Last Updated:** 14 Februari 2026
