# Perencanaan Implementasi Keamanan Server VPS

Dokumen ini merinci langkah-langkah yang diperlukan untuk mengamankan server VPS (Linux/Ubuntu) untuk aplikasi TIC Padang.

## 1. Manajemen Pengguna & Pengerasan SSH (SSH Hardening)
*   **Gunakan Pengguna Sudo**: Jangan menggunakan akun `root` secara langsung untuk aktivitas harian.
*   **Otentikasi Kunci SSH (SSH Key)**: Wajibkan penggunaan kunci SSH dan nonaktifkan login dengan kata sandi.
*   **Nonaktifkan Login Root**: Ubah pengaturan `PermitRootLogin` menjadi `no` di `/etc/ssh/sshd_config`.
*   **Ubah Port SSH Default**: Gunakan port non-standar (misalnya 2222) untuk mengurangi serangan otomatis (brute force).
*   **Nonaktifkan PasswordAuthentication**: Pastikan hanya kunci SSH yang diizinkan.

## 2. Firewall (UFW - Uncomplicated Firewall)
*   **Batasi Port yang Terbuka**: Hanya izinkan port yang benar-benar diperlukan:
    *   `PORT_SSH/tcp` (Port SSH kustom Anda)
    *   `80/tcp` (HTTP)
    *   `443/tcp` (HTTPS)
*   **Tolak semua koneksi lain secara default**.

## 3. Fail2Ban
*   **Instalasi Fail2Ban**: Pasang tool ini untuk memblokir IP yang melakukan percobaan login berkali-kali secara mencurigakan.
*   **Konfigurasi Jail**: Siapkan proteksi untuk SSH dan Nginx.

## 4. Pembaruan Otomatis (Automatic Updates)
*   **Unattended-Upgrades**: Konfigurasikan sistem untuk menginstal pembaruan keamanan secara otomatis agar server selalu terlindungi dari kerentanan terbaru.

## 5. Keamanan Web Server (Nginx) & SSL
*   **SSL/TLS (Certbot/Let's Encrypt)**: Pasang sertifikat SSL untuk mengenkripsi lalu lintas data.
*   **Redirect HTTP ke HTTPS**: Paksa semua lalu lintas menggunakan koneksi aman.
*   **Nginx Hardening**: Sembunyikan versi Nginx (`server_tokens off`) dan tambahkan header keamanan (HSTS, X-Frame-Options, dll).

## 6. Keamanan Database
*   **Akses Lokal Saja**: Pastikan database (PostgreSQL/MySQL) hanya mendengarkan pada `127.0.0.1` (localhost).
*   **Kata Sandi Kuat**: Gunakan kredensial yang kompleks untuk pengguna database.
*   **Backup Rutin**: Otomatiskan cadangan data ke lokasi di luar server (offsite).

## 7. Keamanan Level Aplikasi
*   **Variabel Lingkungan (.env)**: Jangan pernah menyimpan rahasia (API key, DB password) di dalam kode sumber.
*   **Rate Limiting**: Terapkan pembatasan jumlah permintaan pada API sensitif (Login/Register).
*   **Audit Log**: Simpan log aktivitas penting dalam aplikasi.

## 8. Pemantauan (Monitoring)
*   **Audit Login**: Periksa berkas log secara berkala (`/var/log/auth.log`).
*   **Uptime Monitoring**: Gunakan layanan pemantauan untuk mengetahui jika server down.

---
**Penyusun:** Antigravity AI
**Tanggal:** 15 Februari 2026
