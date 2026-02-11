# Dokumentasi Sistem TIC-PADANG

## 1. Ikhtisar Proyek (Project Overview)
**TIC-PADANG** adalah aplikasi Tourism Information Center untuk Kota Padang. Aplikasi ini bertujuan (berdasarkan fitur yang ada) untuk membantu wisatawan menemukan destinasi menarik, melihat acara mendatang, membaca artikel/berita, serta menyusun rencana perjalanan (itinerary).

Aplikasi terdiri dari dua bagian utama:
1.  **Frontend (Client)**: Aplikasi web berbasis React untuk pengguna umum.
2.  **Backend (API)**: Server REST API berbasis Express & Node.js untuk melayani data dan menangani logika bisnis.
3.  **Admin Panel**: Terintegrasi di dalam aplikasi frontend (berdasarkan role user) untuk mengelola konten.

---

## 2. Teknologi (Tech Stack)

### Frontend
*   **Framework**: [React 19](https://react.dev/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Bahasa**: TypeScript (`.tsx`)
*   **Styling**: Tailwind CSS (diinferred dari penggunaan class utility)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Routing**: Custom State-based Router (di `App.tsx`)

### Backend
*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Framework**: [Express.js](https://expressjs.com/)
*   **Bahasa**: TypeScript (`tsx` untuk eksekusi langsung)
*   **Database ORM**: [Prisma](https://www.prisma.io/)
*   **Authentication**: JSON Web Token (JWT) + bcryptjs
*   **File Uploads**: `express.static` untuk folder `uploads`

### Database
*   **Engine**: PostgreSQL (berdasarkan `deploy_vps.sh` dan `schema.prisma`)
*   **Schema**: Dikelola via Prisma Schema

### DevOps / Deployment
*   **Server**: VPS (Ubuntu)
*   **Process Manager**: PM2
*   **Scripting**: Bash scripts untuk automasi (deploy, sync, debug)

---

## 3. Arsitektur Sistem

Aplikasi menggunakan arsitektur **Client-Server** standar:

1.  **Client** berjalan di browser pengguna, melakukan request HTTP (`fetch`) ke API Backend.
2.  **Server** (Express) menerima request, memproses logika (Auth, CRUD), dan berinteraksi dengan Database via Prisma Client.
3.  **Database** menyimpan seluruh data persisten (User, Destination, Article, dll).
4.  **Backend** juga menyediakan endpoint proxy (`/api/proxy-image`) untuk mengatasi masalah CORS pada gambar eksternal/360.

---

## 4. Basis Data (Database Schema)

Model data utama yang didefinisikan dalam `prisma/schema.prisma`:

*   **User**: Pengguna aplikasi. Memiliki `role` (USER/ADMIN), `level`, `points`, dan profil dasar.
*   **Destination**: Objek wisata. Menyimpan lokasi (`lat`, `lng`), rating, harga, gambar, dan link gambar 360.
*   **Event**: Acara/kalender event wisata.
*   **Promotion**: Promo aktif (diskon hotel, event, dll).
*   **Article**: Berita atau blog post seputar wisata.
*   **Comment**: Komentar user pada artikel.
*   **Review**: Rating dan ulasan user pada destinasi.
*   **Plan / PlanItem**: Fitur rencana perjalanan pribadi user (Itinerary).
*   **Story / StoryMedia / StoryLike / StoryComment**: Sistem berbagi cerita perjalanan mirip media sosial.
*   **TravelBuddyPost / TravelBuddyApplication**: Sistem pencarian teman perjalanan.
*   **Guide / TourPackage**: Sistem pemandu wisata lokal dan paket turnya.
*   **Conversation / Message / ConversationMember**: Sistem chat real-time antar pengguna dan pemandu.
*   **Booking**: Sistem pemesanan paket wisata dari pemandu lokal.

---

## 5. Fitur Utama

### Pengguna Umum (Public/User)
*   **Explorasi**: Melihat daftar destinasi wisata, filter kategori, dan pencarian.
*   **Detail Destinasi**: Foto, deskripsi, lokasi peta, harga, dan ulasan.
*   **Event & Promo**: Daftar acara mendatang dan promosi yang sedang berlaku.
*   **Artikel**: Membaca berita wisata dan memberikan komentar.
*   **Itinerary (Rencana)**: Membuat rencana perjalanan pribadi, menambahkan item kegiatan berdasarkan waktu/tempat.
*   **Travel Stories**: Membuat dan berbagi cerita perjalanan (foto/video), memberikan like, dan komentar.
*   **Travel Buddy**: Membuat postingan pencarian teman perjalanan dan mendaftar ke postingan orang lain.
*   **Guide Marketplace**: Mencari pemandu lokal, melihat paket wisata, dan melakukan pemesanan (booking).
*   **Chat System**: Berkomunikasi langsung dengan pemandu atau sesama traveler dengan konteks subjek (paket tour & tanggal).
*   **Multi-Language**: Dukungan Bahasa Indonesia, Inggris, dan Arab (dengan tata letak RTL otomatis).
*   **Profil**: Mengelola data diri, melihat level/poin, serta memantau status pesanan dan verifikasi pemandu.

### Administrator
*   **Dashboard Admin**: Akses khusus user dengan `role: ADMIN`.
*   **Manajemen User**: Melihat, menambah, mengedit, dan menghapus pengguna.
*   **Manajemen Konten**: CRUD untuk Destinasi, Event, Promosi, dan Artikel.
*   **Verifikasi Guide**: Menyetujui atau menangguhkan status pendaftaran pemandu lokal.

### Pemandu Lokal (Guide)
*   **Guide Dashboard**: Mengelola profil pemandu, keahlian, dan bahasa.
*   **Manajemen Paket**: Membuat dan mengedit paket wisata.
*   **Monitoring Booking**: Menerima notifikasi pesanan masuk dan melihat daftar tamu.

---

## 6. Referensi API (API Endpoints)

Base URL: `/api`

### Auth
*   `POST /api/auth/login`: Masuk aplikasi.
*   `POST /api/auth/register`: Daftar akun baru.

### Public Data
*   `GET /api/destinations`: Mengambil semua destinasi.
*   `GET /api/events`: Mengambil event mendatang.
*   `GET /api/promotions`: Mengambil promo aktif.
*   `GET /api/articles`: Mengambil artikel.
*   `GET /api/reviews/:destinationId`: Melihat ulasan destinasi.

### User Actions (Butuh Token)
*   `PUT /api/profile`: Update profil sendiri.
*   `GET /api/plans/:userId`: Mengambil rencana perjalanan user.
*   `POST /api/plans`: Membuat rencana baru.
*   `POST /api/reviews`: Kirim ulasan destinasi.
*   `POST /api/articles/:id/comments`: Kirim komentar artikel.
*   `GET /api/stories`: Mengambil daftar cerita perjalanan.
*   `POST /api/stories`: Mengunggah cerita baru (Multipart/form-data).
*   `POST /api/travel-buddy`: Membuat postingan pencari teman.
*   `POST /api/conversations`: Memulai percakapan baru dengan konteks subjek.
*   `GET /api/messages/:convId`: Mengambil riwayat pesan.
*   `POST /api/bookings`: Melakukan pemesanan paket wisata.

### Guide & Marketplace
*   `GET /api/guides/status`: Mengecek status verifikasi pemandu.
*   `POST /api/guides/register`: Mendaftar sebagai pemandu lokal.
*   `POST /api/packages`: Membuat paket wisata baru.
*   `GET /api/bookings/my-tours`: Melihat pesanan yang diterima oleh pemandu.

### Admin (Butuh Token + Role Admin)
*   `GET/POST/PUT/DELETE /api/admin/users`: Kelola user.
*   `GET/POST/PUT/DELETE /api/admin/destinations`: Kelola destinasi.
*   `GET/POST/PUT/DELETE /api/admin/events`: Kelola event.
*   `GET/POST/PUT/DELETE /api/admin/promotions`: Kelola promo.
*   `GET/POST/PUT/DELETE /api/admin/articles`: Kelola artikel.
*   `PUT /api/admin/guides/:id/status`: Menyetujui/blokir pemandu.

---

## 7. Instalasi & Menjalankan (Local Development)

### Prasyarat
*   Node.js (v18+ direkomendasikan)
*   PostgreSQL (Local atau Remote URL)

### Langkah-langkah
1.  **Clone Repository** (jika ada) atau masuk ke direktori project.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Setup Environment Variable**:
    Buat file `.env` di root folder dengan isi:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
    JWT_SECRET="rahasia_anda_di_sini"
    PORT=3001
    ```
4.  **Setup Database**:
    Jalankan migrasi Prisma untuk membuat tabel:
    ```bash
    npx prisma migrate dev --name init
    # Opsional: Seeding data jika ada script seed
    # npx prisma db seed 
    ```
5.  **Jalankan Aplikasi**:
    ```bash
    npm run dev
    ```
    Perintah ini akan menjalankan frontend (Vite) dan backend (via `tsx server.ts`) secara bersamaan atau sesuai konfigurasi script `dev`.
    *Catatan: Cek `package.json`, script "dev" hanya menjalankan "vite". Anda mungkin perlu menjalankan server backend secara terpisah dengan:*
    ```bash
    npm start
    ```
    *(Pastikan melihat `package.json`: `dev`=vite, `start`=`tsx server.ts`. Jadi butuh 2 terminal).*

---

## 8. Deployment (Produksi / VPS)

Project ini menyertakan script automasi deployment di folder root (misalnya `deploy_vps.sh`).

### Alur Deployment (berdasarkan script):
1.  **Sync**: Menggunakan `rsync` untuk mengirim file codingan lokal ke VPS.
2.  **Remote Exec**: Masuk ke VPS via SSH.
3.  **Setup**: Membuat file `.env` produksi secara otomatis.
4.  **Install & Build**: Menjalankan `npm install` dan `npm run build` (build frontend React ke folder `dist`).
5.  **DB Migrate**: Menjalankan `npx prisma migrate deploy` untuk update schema production.
6.  **Restart**: Restart service via PM2.

### Struktur Folder Penting
*   `/src`: Source code Frontend (React).
    *   `/screens`: Halaman-halaman aplikasi.
    *   `/components`: Komponen UI reusable.
*   `/prisma`: Schema database dan migrasi.
*   `/uploads`: Folder penyimpanan file upload (jika ada).
*   `server.ts`: Entry point Backend.
*   `App.tsx`: Entry point Frontend & Routing utama.
