# Panduan Pembuatan APK (TIC Padang)

Panduan ini akan membantu Anda membuat file APK yang terhubung langsung ke VPS.

## 1. Persiapan Environment Android
Karena build APK membutuhkan Android SDK, Anda perlu menginstall Android Studio.
Jika Anda berada di **Windows** atau **macOS**, ini langkah termudahnya:

1. Download & Install Android Studio: https://developer.android.com/studio
2. Buka project `android` yang ada di dalam folder `tic` menggunakan Android Studio.

## 2. Generate APK (Debug Version)
Cara cepat untuk testing di HP sendiri:

### Windows / macOS / Linux (via Terminal)
```bash
cd android
./gradlew assembleDebug
```
*Note: Jika ada error permission, jalankan `chmod +x gradlew` dulu.*

APK akan tersedia di:
`android/app/build/outputs/apk/debug/app-debug.apk`

Copy file ini ke HP Anda dan install.

---

## 3. Generate Signed APK (Production Version)
Untuk didistribusikan ke publik atau Play Store.

1. Buka **Android Studio**.
2. Masuk ke menu `Build` > `Generate Signed Bundle / APK`.
3. Pilih `APK`.
4. Buat Keystore baru (simpan passwordnya!).
5. Pilih `Release`.
6. Tunggu proses selesai.

APK siap didistribusikan!

## 4. Troubleshooting

### Halaman Web Tidak Muncul (White Screen)
Pastikan di `capacitor.config.ts`, bagian `server` sudah mengarah ke URL yang benar:
```typescript
server: {
  url: 'http://103.141.74.87:3001',
  cleartext: true
}
```
Dan pastikan jangan lupa jalankan:
```bash
npx cap sync android
```

### Isu HTTP (Cleartext Traffic)
Karena kita menggunakan `http` (bukan https), pastikan `AndroidManifest.xml` (di `android/app/src/main/AndroidManifest.xml`) memiliki atribut ini di tag `<application>`:
`android:usesCleartextTraffic="true"`

(Secara default Capacitor sudah mengaturnya jika `cleartext: true` di config).

---
**Happy Building!** 🚀
