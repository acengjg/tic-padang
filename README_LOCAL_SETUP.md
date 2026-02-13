# Local Setup & Credentials

## 🔐 Credentials (Restored from VPS Backup)

### 👨‍💼 Administrator
- **Email:** `admin@tic.com`
- **Password:** `12345678`

### 👤 Standard User
- No default user found in backup. Please register a new account.

## 🚀 Running the Application

To start both the Frontend (Vite) and Backend (Express) concurrently:

```bash
npm run dev:all
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend:** [http://localhost:3001](http://localhost:3001)

## 🗄️ Database
- **Database Name:** `tic_padang`
- **ORM:** Prisma
- **Studio (GUI):** `npx prisma studio`

## 🛠️ Configuration
- **Tailwind CSS:** Configured to use CommonJS modules for compatibility.
- **Image Compression:** Implemented using Sharp (Max 1080p, JPEG 80%).
- **Environment:** Database restored to match VPS data.
