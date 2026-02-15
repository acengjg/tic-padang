# Panduan Instalasi APK TIC Padang

File APK Anda sudah berhasil dibuat! Berikut adalah langkah-langkah untuk menjalankannya di HP Android Anda.

## 📍 Lokasi File
File APK berada di folder project Anda:
`android/app/build/outputs/apk/debug/app-debug.apk`

## 📲 Cara Install ke HP

### Cara 1: Transfer Kabel USB (Paling Umum)
1. Hubungkan HP Android ke Laptop/PC dengan kabel USB.
2. Di HP, pilih mode **"File Transfer"** atau **"MTP"**.
3. Copy file `app-debug.apk` dari PC ke folder `Downloads` (atau folder manapun) di HP.
4. Buka **File Manager** di HP.
5. Cari dan tap file `app-debug.apk`.
6. Jika muncul peringatan, izinkan **"Install from Unknown Sources"** (Instal dari sumber tidak dikenal).
7. Klik **Install**.

### Cara 2: Kirim via WhatsApp / Email
1. Buka WhatsApp Web atau Email di PC.
2. Kirim file `app-debug.apk` ke diri sendiri atau orang lain.
3. Buka WhatsApp/Email di HP.
4. Download dan tap file tersebut untuk install.

### Cara 3: Menggunakan ADB (Untuk Developer)
Jika Anda punya `adb` tools terinstall:
```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🚀 Menjalankan Aplikasi
1. Setelah terinstall, cari icon **TIC Padang** di menu aplikasi.
2. Buka aplikasi.
3. Aplikasi akan langsung memuat halaman web dari VPS (`http://103.141.74.87:3001`).

## ⚠️ Troubleshooting
- **Warna Putih (White Screen):** Pastikan HP terkoneksi internet, karena aplikasi me-load data langsung dari server VPS.
- **Tidak Bisa Install:** Cek apakah "Unknown Sources" sudah diaktifkan di Settings > Security.
- **Aplikasi Lambat:** Performa tergantung kecepatan internet karena ini adalah aplikasi web-wrapper.

**Selamat Mencoba!**
