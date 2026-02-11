# Roadmap Pengembangan Aplikasi TIC-PADANG

Dokumen ini berisi saran pengembangan strategis untuk aplikasi TIC-PADANG, mencakup perbaikan teknis, penambahan fitur, dan optimasi performa.

## 1. Jangka Pendek (Stabilitas & Kualitas Kode)
Fokus pada membersihkan hutang teknis dan membuat *developer experience* lebih baik.

### 🧹 Refactoring Teknologikal
- **Migrasi Tailwind CSS ke Build-Time**: Saat ini Tailwind diload via CDN di `index.html` yang lambat dan tidak optimal untuk produksi.
  - *Saran*: Install `tailwindcss`, `postcss`, dan `autoprefixer` sebagai `devDependencies` dan generate `tailwind.config.js` yang proper. Ini memungkinkan fitur *tree-shaking* (membuang style tak terpakai).
- **Standarisasi Dependensi**: Saat ini ada campuran import dari `node_modules` dan CDN/ESM di `index.html`.
  - *Saran*: Gunakan `npm` sepenuhnya untuk semua library (Leaflet, Pannellum, dll) agar versi terkontrol dan bundle lebih optimal.
- **Konfigurasi Linting & Formatting**:
  - *Saran*: Tambahkan **ESLint** dan **Prettier**. Ini krusial agar gaya kode konsisten (terutama karena Anda menggunakan TypeScript) dan mencegah bug sepele.

### 🛠 Tooling & Scripts
- **Unified Development Command**:
  - *Saran*: Gunakan library `concurrently` atau `npm-run-all` untuk menjalankan Backend dan Frontend dalam satu terminal dengan satu perintah (`npm run dev:all`).
- **Validasi Environment Variables**:
  - *Saran*: Gunakan library seperti `zod` atau `dotenv-safe` untuk memastikan aplikasi tidak jalan (crash-fast) jika variabel `.env` penting hilang saat startup.

---

## 2. Jangka Menengah (Peningkatan Fitur)
Fokus pada nilai tambah bagi pengguna wisatawan dan admin.

### 🔐 Autentikasi & Pengguna
- **Social Login**:
  - *Saran*: Integrasikan "Login with Google" (via Firebase Auth atau Passport.js). Ini sangat memudahkan wisatawan yang malas mengisi form registrasi.
- **Refresh Token Mechanism**:
  - *Saran*: Implementasikan *Silent Refresh Token* (biasanya via httpOnly cookie) agar user tidak ter-logout tiba-tiba saat token JWT kadaluarsa.
- **User Dashboard/Profile**:
  - *Saran*: Tambahkan halaman "Saved/Favorites" agar user bisa menyimpan destinasi impian.

### 📍 Fitur Peta & Lokasi (Core Features)
- **Geolocation & Routing**:
  - *Saran*: Fitur "Rute dari Lokasi Saya" di halaman detail destinasi yang langsung membuka Google Maps atau menampilkan polyline rute di peta aplikasi.
- **Nearby Search (Cari Sekitar)**:
  - *Saran*: Fitur "Wisata Terdekat" menggunakan query geospasial (PostGIS atau haversine formula) untuk menampilkan destinasi dalam radius X km dari user.

### 🔔 Notifikasi & Interaksi
- **Push Notifications**:
  - *Saran*: Gunakan Firebase Cloud Messaging (FCM) untuk memberitahu user tentang Event baru atau Promo diskon hotel/kuliner.
- **Sistem Rating Lebih Detail**:
  - *Saran*: Pecah rating menjadi beberapa aspek (misal: Kebersihan, Fasilitas, Pelayanan) agar ulasan lebih informatif.

---

## 3. Jangka Panjang (Skalabilitas & Performa)
Persiapan agar aplikasi siap menangani ribuan pengguna (Production Ready).

### 🚀 Optimasi Performa
- **Image Optimization**:
  - *Saran*: Saat ini gambar upload user mungkin berukuran besar. Gunakan layanan seperti **Cloudinary** / **ImageKit** atau middleware `sharp` untuk auto-resize dan convert ke WebP saat upload.
- **Caching Strategy**:
  - *Saran*: Implementasikan Redis untuk cache query database yang berat (seperti list destinasi atau artikel populer).

### 📱 Progressive Web App (PWA)
- **Offline Mode**:
  - *Saran*: Konfigurasi PWA (Service Workers) agar aplikasi bisa dibuka saat sinyal hilang (umum di lokasi wisata alam), minimal menampilkan data yang terakhir di-load.
- **Installable**: Agar user bisa "menginstal" website ke home screen HP mereka tanpa lewat App Store/Play Store.

### 🧪 Testing & CI/CD
- **Automated Testing**:
  - *Saran*: Mulai tulis Unit Test (Vitest/Jest) untuk logika backend krusial (seperti hitungan poin atau auth) dan E2E Test (Playwright/Cypress) untuk alur user utama.
- **CI/CD Pipeline**:
  - *Saran*: Setup GitHub Actions untuk otomatis jalan test dan deploy ke VPS saat push ke branch `main`.
