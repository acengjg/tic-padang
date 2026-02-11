
import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT || 3001);
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/stories';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `story-${Date.now()}-${Math.round(Math.random() * 1000)}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

app.use(express.json() as any);

// Middleware CORS
app.use((req: any, res: any, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
  } else {
    next();
  }
});

app.use('/uploads', express.static('uploads'));

// Auth Middleware
const authenticateToken = (req: any, res: any, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token tidak ditemukan' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Token tidak valid' });
    req.user = user;
    next();
  });
};

// Admin Middleware
const requireAdmin = (req: any, res: any, next: NextFunction) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ error: 'Akses ditolak: Memerlukan hak akses Admin' });
  }
};

app.get('/api/version', (req, res) => {
  res.json({ version: '1.0.1', timestamp: new Date().toISOString() });
});

// --- AUTH ROUTES ---

app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'User tidak ditemukan' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Password salah' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' } // Use simple 1 day token
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Gagal melakukan login' });
  }
});

app.post('/api/auth/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email sudah terdaftar' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: 'USER', level: 1, points: 0 }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mendaftar pengguna' });
  }
});

// --- ADMIN CRUD: USERS ---

app.get('/api/admin/users', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil daftar pengguna' });
  }
});

app.post('/api/admin/users', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  const { name, email, password, role, level, points } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role, level: Number(level), points: Number(points) }
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Gagal membuat pengguna' });
  }
});

app.put('/api/admin/users/:id', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  const { id } = req.params;
  const { name, email, password, role, level, points } = req.body;
  try {
    const data: any = { name, email, role, level: Number(level), points: Number(points) };
    if (password) data.password = await bcrypt.hash(password, 10);
    const user = await prisma.user.update({ where: { id }, data });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui pengguna' });
  }
});

app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  const userId = req.params.id;
  try {
    // Prevent deleting self
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Tidak dapat menghapus akun sendiri saat login.' });
    }

    await prisma.$transaction(async (tx) => {
      // 1. Delete Comments
      await tx.comment.deleteMany({ where: { userId } });

      // 2. Delete Reviews
      await tx.review.deleteMany({ where: { userId } });

      // 3. Delete Plans and PlanItems
      const userPlans = await tx.plan.findMany({ where: { userId }, select: { id: true } });
      const planIds = userPlans.map((p: any) => p.id);

      if (planIds.length > 0) {
        await tx.planItem.deleteMany({ where: { planId: { in: planIds } } });
        await tx.plan.deleteMany({ where: { id: { in: planIds } } });
      }

      // 4. Delete User
      await tx.user.delete({ where: { id: userId } });
    });

    res.json({ message: 'User dan semua data terkait berhasil dihapus' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Gagal menghapus pengguna karena data terkait.' });
  }
});

// --- ADMIN CRUD: GUIDES ---

app.get('/api/admin/guides', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    const guides = await prisma.guide.findMany({
      include: { user: { select: { name: true, email: true, role: true } } },
      orderBy: { createdAt: 'desc' }
    });
    console.log(`Found ${guides.length} guide applications`);
    res.json(guides);
  } catch (error) {
    console.error('Fetch guides error:', error);
    res.status(500).json({ error: 'Gagal mengambil daftar pemandu' });
  }
});

app.post('/api/admin/guides/:id/verify', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    const { status, role } = req.body; // status: APPROVED/SUSPENDED, role: GUIDE (optional update)

    const guide = await prisma.guide.findUnique({ where: { id: req.params.id } });
    if (!guide) return res.status(404).json({ error: 'Pemandu tidak ditemukan' });

    await prisma.$transaction(async (tx) => {
      // 1. Update Guide Status
      await tx.guide.update({
        where: { id: req.params.id },
        data: { status }
      });

      // 2. If approved, upgrade user role to GUIDE
      if (status === 'APPROVED') {
        await tx.user.update({
          where: { id: guide.userId },
          data: { role: 'GUIDE' }
        });
      }
    });

    res.json({ message: `Pemandu berhasil di-${status.toLowerCase()}` });
  } catch (error) {
    res.status(500).json({ error: 'Gagal memproses verifikasi pemandu' });
  }
});

// --- ADMIN CRUD: DESTINATIONS ---

app.get('/api/admin/destinations', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    const dests = await prisma.destination.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(dests);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil destinasi' });
  }
});

app.post('/api/admin/destinations', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    const { name, category, rating, location, image, image360, description, price, lat, lng } = req.body;
    const dest = await prisma.destination.create({
      data: { name, category, rating: Number(rating), location, image, image360, description, price, lat: Number(lat), lng: Number(lng) }
    });
    res.status(201).json(dest);
  } catch (error) {
    res.status(500).json({ error: 'Gagal membuat destinasi' });
  }
});

app.put('/api/admin/destinations/:id', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    const { name, category, rating, location, image, image360, description, price, lat, lng } = req.body;
    const dest = await prisma.destination.update({
      where: { id: req.params.id },
      data: { name, category, rating: Number(rating), location, image, image360, description, price, lat: Number(lat), lng: Number(lng) }
    });
    res.json(dest);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui destinasi' });
  }
});

app.delete('/api/admin/destinations/:id', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    await prisma.destination.delete({ where: { id: req.params.id } });
    res.json({ message: 'Destinasi berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus destinasi' });
  }
});

// --- ADMIN CRUD: EVENTS ---

app.get('/api/admin/events', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    const events = await prisma.event.findMany({ orderBy: { date: 'asc' } });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil event' });
  }
});

app.post('/api/admin/events', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    const { name, date, location, image, description, price } = req.body;
    const event = await prisma.event.create({
      data: {
        name,
        date: new Date(date),
        location,
        image,
        description,
        price
      }
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Gagal membuat event' });
  }
});

app.put('/api/admin/events/:id', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    const { name, date, location, image, description, price } = req.body;
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: {
        name,
        date: new Date(date),
        location,
        image,
        description,
        price
      }
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui event' });
  }
});

app.delete('/api/admin/events/:id', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    await prisma.event.delete({ where: { id: req.params.id } });
    res.json({ message: 'Event berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus event' });
  }
});

// --- ADMIN CRUD: PROMOTIONS ---

app.get('/api/admin/promotions', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    const promos = await prisma.promotion.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(promos);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil promosi' });
  }
});

app.post('/api/admin/promotions', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    const { title, discount, image, videoUrl, provider } = req.body;
    const promo = await prisma.promotion.create({
      data: { title, discount, image, videoUrl, provider }
    });
    res.status(201).json(promo);
  } catch (error) {
    res.status(500).json({ error: 'Gagal membuat promosi' });
  }
});

app.put('/api/admin/promotions/:id', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    const { title, discount, image, videoUrl, provider } = req.body;
    const promo = await prisma.promotion.update({
      where: { id: req.params.id },
      data: { title, discount, image, videoUrl, provider }
    });
    res.json(promo);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui promosi' });
  }
});

app.delete('/api/admin/promotions/:id', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    await prisma.promotion.delete({ where: { id: req.params.id } });
    res.json({ message: 'Promosi berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus promosi' });
  }
});

// --- ADMIN CRUD: ARTICLES ---

app.get('/api/admin/articles', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    const articles = await prisma.article.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil artikel' });
  }
});

app.post('/api/admin/articles', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    const { title, content, image, category, author } = req.body;
    const article = await prisma.article.create({
      data: { title, content, image, category, author: author || 'Admin' }
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ error: 'Gagal membuat artikel' });
  }
});

app.put('/api/admin/articles/:id', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    const { title, content, image, category, author } = req.body;
    const article = await prisma.article.update({
      where: { id: String(req.params.id) },
      data: { title, content, image, category, author }
    });
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui artikel' });
  }
});

app.delete('/api/admin/articles/:id', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    await prisma.article.delete({ where: { id: String(req.params.id) } });
    res.json({ message: 'Artikel berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus artikel' });
  }
});

// --- REVIEWS ROUTES ---

app.get('/api/reviews/:destinationId', async (req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { destinationId: String(req.params.destinationId) },
      include: { user: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil ulasan' });
  }
});

app.get('/api/reviews/user/:userId', async (req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { userId: String(req.params.userId) },
      include: { destination: { select: { name: true, image: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil riwayat ulasan' });
  }
});

app.post('/api/reviews', authenticateToken, async (req: any, res: Response) => {
  try {
    const { destinationId, rating, comment } = req.body;
    const userId = req.user.id;

    const review = await prisma.review.create({
      data: {
        userId,
        destinationId,
        rating: Number(rating),
        comment
      },
      include: { user: { select: { name: true, avatar: true } } }
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengirim ulasan' });
  }
});

// --- PROXY ROUTE ---

app.get('/api/proxy-image', async (req: any, res: Response) => {
  const imageUrl = req.query.url as string;
  if (!imageUrl) return res.status(400).send('URL is required');

  // Fix potential double slashes in URL path (except protocol)
  const fixedUrl = imageUrl.replace(/([^:]\/)\/+/g, "$1");

  try {
    // Dynamic import to support fetch in environments where it might be tricky or use native if available
    // Assuming Node 18+ for native fetch
    const response = await fetch(fixedUrl);

    if (!response.ok) {
      // If fixed URL fails, try original just in case
      const retryResponse = await fetch(imageUrl);
      if (!retryResponse.ok) throw new Error(`Failed to fetch image`);

      const arrayBuffer = await retryResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      res.setHeader('Content-Type', retryResponse.headers.get('content-type') || 'image/jpeg');
      res.send(buffer);
      return;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
    res.send(buffer);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).send('Error fetching image');
  }
});

// --- PUBLIC ROUTES ---

app.get('/api/destinations', async (req: Request, res: Response) => {
  const destinations = await prisma.destination.findMany();
  res.json(destinations.map(d => ({ ...d, coordinates: { lat: d.lat, lng: d.lng } })));
});

app.get('/api/promotions', async (req: Request, res: Response) => {
  const promotions = await prisma.promotion.findMany();
  res.json(promotions);
});

app.get('/api/events', async (req: Request, res: Response) => {
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
    where: { date: { gte: new Date() } } // Only upcoming events by default
  });
  res.json(events);
});

app.get('/api/articles', async (req: Request, res: Response) => {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.json(articles);
});

app.get('/api/articles/:id', async (req: Request, res: Response) => {
  try {
    const article = await prisma.article.findUnique({
      where: { id: String(req.params.id) }
    });
    if (!article) return res.status(404).json({ error: 'Artikel tidak ditemukan' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil artikel' });
  }
});

app.get('/api/articles/:id/comments', async (req: Request, res: Response) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { articleId: String(req.params.id) },
      include: { user: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil komentar' });
  }
});

app.post('/api/articles/:id/comments', authenticateToken, async (req: any, res: Response) => {
  try {
    const { content } = req.body;
    const comment = await prisma.comment.create({
      data: {
        content,
        articleId: req.params.id,
        userId: req.user.id
      },
      include: { user: { select: { name: true, avatar: true } } }
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengirim komentar' });
  }
});

app.get('/api/profile/:id', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: String(req.params.id) },
      select: { id: true, name: true, email: true, level: true, points: true, avatar: true, role: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil profil' });
  }
});

app.put('/api/profile', authenticateToken, async (req: any, res: Response) => {
  const userId = req.user.id;
  const { name, email, password, avatar } = req.body;

  try {
    const data: any = { name, email, avatar };
    if (password && password.trim() !== '') {
      data.password = await bcrypt.hash(password, 10);
    }

    if (email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== userId) {
        return res.status(400).json({ error: 'Email sudah digunakan pengguna lain' });
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, name: true, email: true, level: true, points: true, avatar: true, role: true }
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal memperbarui profil' });
  }
});

app.get('/api/plans/:userId', async (req: Request, res: Response) => {
  try {
    const plans = await prisma.plan.findMany({
      where: { userId: String(req.params.userId) },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil rencana' });
  }
});

app.get('/api/plans', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const plans = await prisma.plan.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil rencana' });
  }
});

app.post('/api/plans', authenticateToken, async (req: any, res: Response) => {
  try {
    const { title, date, items } = req.body;
    const userId = req.user.id;

    const plan = await prisma.plan.create({
      data: {
        userId,
        title,
        date,
        items: {
          create: items.map((item: any) => ({
            time: item.time,
            place: item.place,
            activity: item.activity
          }))
        }
      },
      include: { items: true }
    });
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Gagal membuat rencana' });
  }
});

app.delete('/api/plans/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const planId = req.params.id;
    await prisma.planItem.deleteMany({ where: { planId } });
    await prisma.plan.delete({ where: { id: planId } });
    res.json({ message: 'Rencana berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus rencana' });
  }
});


// (Moved to the end of file)


// --- AI TRIP PLANNER ---

interface TripRequest {
  duration: number; // days
  budget: number; // total budget in Rupiah
  interests: string[]; // e.g., ['Alam', 'Kuliner']
}

app.post('/api/trip-planner/generate', async (req: Request, res: Response) => {
  try {
    const { duration, budget, interests }: TripRequest = req.body;

    // 1. Fetch potential destinations
    const allDestinations = await prisma.destination.findMany({
      where: interests.length > 0 ? {
        category: { in: interests }
      } : undefined
    });

    if (allDestinations.length === 0) {
      return res.json({ itinerary: [], totalCost: 0, message: 'Tidak ada destinasi yang sesuai kriteria.' });
    }

    // 2. Sort by Rating (Heuristic: visit best places first)
    // In a real AI model, we would use a score combining personalized weights
    const sortedDestinations = allDestinations.sort((a: any, b: any) => b.rating - a.rating);

    // 3. Generate Itinerary
    const itinerary: any[] = [];
    let currentCost = 0;
    const destinationsPerDay = 3;
    let day = 1;

    // Helper to parse price
    const getPrice = (priceStr: string | null) => {
      if (!priceStr || priceStr.toLowerCase() === 'gratis') return 0;
      return parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
    };

    // Distribute
    let visitedIds = new Set();

    for (let d = 0; d < duration; d++) {
      const dailyPlan: any = {
        day: d + 1,
        items: []
      };

      for (let i = 0; i < destinationsPerDay; i++) {
        // Find next best unvisited that fits budget
        const nextDest = sortedDestinations.find((dest: any) => !visitedIds.has(dest.id));

        if (nextDest) {
          const cost = getPrice(nextDest.price);

          // Soft budget check (allow if it's the only item or budget permits)
          if (currentCost + cost <= budget * 1.2) { // Allow 20% margin
            visitedIds.add(nextDest.id);
            currentCost += cost;

            dailyPlan.items.push({
              time: i === 0 ? '09:00' : i === 1 ? '13:00' : '16:00',
              destination: nextDest,
              activity: `Mengunjungi ${nextDest.name}`,
              cost: cost
            });
          }
        }
      }

      if (dailyPlan.items.length > 0) {
        itinerary.push(dailyPlan);
      }
    }

    res.json({
      itinerary,
      totalCost: currentCost,
      estimatedBudget: budget,
      note: 'Itinerary generated based on popularity and interests.'
    });

  } catch (error) {
    console.error('Trip Planner Error:', error);
    res.status(500).json({ error: 'Gagal membuat itinerary.' });
  }
});

// --- RECOMMENDATION SYSTEM ---

app.get('/api/recommendations', async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id']; // Optional: if we want to personalize later
  const category = req.query.category as string; // Optional filter

  try {
    // 1. "Smart" Logic:
    // - If morning (0-11): Recommend 'Alam' (Outdoor)
    // - If lunch (11-14): Recommend 'Kuliner'
    // - If afternoon (14-18): Recommend 'Budaya' or 'Belanja'
    // - If evening (18+): Recommend 'Kuliner' or 'Night Market' (if any)

    const hour = new Date().getHours() + 7; // Server time is usually UTC, adjust to WIB (+7) approximately or use local server time

    let smartCategory: string[] = [];
    let reason = "Rekomendasi hari ini";

    if (hour >= 6 && hour < 11) {
      smartCategory = ['Alam', 'Budaya']; // Pagi yang segar
      reason = "Nikmati udara segar pagi hari di lokasi ini";
    } else if (hour >= 11 && hour < 14) {
      smartCategory = ['Kuliner']; // Makan siang
      reason = "Waktunya makan siang! Coba kuliner legendaris ini";
    } else if (hour >= 14 && hour < 18) {
      smartCategory = ['Belanja', 'Budaya', 'Alam']; // Jalan-jalan sore
      reason = "Tempat asik untuk menghabiskan sore hari Anda";
    } else {
      smartCategory = ['Kuliner']; // Malam
      reason = "Kuliner malam yang wajib dicoba";
    }

    // Override if user specifically filtered
    if (category && category !== 'Semua') {
      smartCategory = [category];
      reason = `Rekomendasi terbaik kategori ${category}`;
    }

    const recommendations = await prisma.destination.findMany({
      where: {
        category: { in: smartCategory }
      },
      orderBy: { rating: 'desc' },
      take: 15 // Fetch top 15 to ensure we have variety
    });

    // Shuffle the results and take 5
    let finalRecs = recommendations.sort(() => Math.random() - 0.5).slice(0, 5);

    // Fallback if empty (e.g. no destinations in that smart category)
    if (finalRecs.length === 0) {
      const popularDests = await prisma.destination.findMany({
        take: 15,
        orderBy: { rating: 'desc' },
      });
      finalRecs = popularDests.sort(() => Math.random() - 0.5).slice(0, 5);
      reason = "Destinasi Terpopuler Saat Ini";
    }

    // Identify "Hidden Gems" (High rating but maybe less known - simplistic check here)
    const hiddenGemsCandidate = await prisma.destination.findMany({
      where: {
        rating: { gte: 4.8 },
      },
      take: 10,
      orderBy: { rating: 'desc' }
    });
    const hiddenGems = hiddenGemsCandidate.sort(() => Math.random() - 0.5).slice(0, 3);

    res.json({
      recommendations: finalRecs,
      hiddenGems,
      context: {
        timeBlock: hour,
        reason
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil rekomendasi' });
  }
});

// --- STORIES ROUTES ---

app.post('/api/stories', authenticateToken, upload.array('media', 5), async (req: any, res: Response) => {
  try {
    const { caption, location } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'Minimal satu foto/video diperlukan' });
    }

    const story = await prisma.story.create({
      data: {
        userId: req.user.id,
        caption,
        location,
        media: {
          create: files.map((file, index) => ({
            url: `/uploads/stories/${file.filename}`,
            type: file.mimetype.startsWith('video') ? 'VIDEO' : 'IMAGE',
            order: index
          }))
        }
      },
      include: { media: true, user: { select: { name: true, avatar: true } } }
    });

    res.status(201).json(story);
  } catch (error) {
    console.error('Create Story Error:', error);
    res.status(500).json({ error: 'Gagal membuat cerita' });
  }
});

app.get('/api/stories', async (req: any, res: Response) => {
  try {
    const stories = await prisma.story.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, avatar: true } },
        media: { orderBy: { order: 'asc' } },
        likes: true,
        comments: {
          include: { user: { select: { name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    res.json(stories);
  } catch (error) {
    console.error('Get Stories Error:', error);
    res.status(500).json({ error: 'Gagal mengambil cerita' });
  }
});

app.post('/api/stories/:id/like', authenticateToken, async (req: any, res: Response) => {
  try {
    const storyId = req.params.id;
    const userId = req.user.id;

    const existingLike = await prisma.storyLike.findFirst({
      where: { storyId, userId }
    });

    if (existingLike) {
      await prisma.storyLike.delete({ where: { id: existingLike.id } });
      res.json({ liked: false });
    } else {
      await prisma.storyLike.create({ data: { storyId, userId } });
      res.json({ liked: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Gagal like cerita' });
  }
});

app.post('/api/stories/:id/comments', authenticateToken, async (req: any, res: Response) => {
  try {
    const { content } = req.body;
    const comment = await prisma.storyComment.create({
      data: {
        storyId: req.params.id,
        userId: req.user.id,
        content
      },
      include: { user: { select: { name: true, avatar: true } } }
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Gagal komentar cerita' });
  }
});


// --- GUIDE MARKETPLACE ROUTES ---

app.get('/api/guides', async (req: Request, res: Response) => {
  try {
    const guides = await prisma.guide.findMany({
      where: { status: 'APPROVED' },
      include: { user: { select: { name: true, avatar: true } } }
    });
    res.json(guides);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data guide' });
  }
});

app.get('/api/guides/check', authenticateToken, async (req: any, res: Response) => {
  try {
    const guide = await prisma.guide.findUnique({
      where: { userId: req.user.id }
    });
    res.json(guide);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengecek status guide' });
  }
});

app.post('/api/guides/register', authenticateToken, async (req: any, res: Response) => {
  try {
    const { bio, languages, specializations, yearsExperience } = req.body;

    const guide = await prisma.guide.upsert({
      where: { userId: req.user.id },
      update: {
        bio,
        languages,
        specializations,
        yearsExperience: Number(yearsExperience),
        status: 'PENDING'
      },
      create: {
        userId: req.user.id,
        bio,
        languages,
        specializations,
        yearsExperience: Number(yearsExperience)
      }
    });

    res.status(201).json(guide);
  } catch (error) {
    console.error("Register Guide Error:", error);
    res.status(500).json({ error: 'Gagal mendaftar sebagai guide' });
  }
});

app.get('/api/guides/:id', async (req: Request, res: Response) => {
  try {
    const guide = await prisma.guide.findUnique({
      where: { id: String(req.params.id) },
      include: {
        user: { select: { name: true, avatar: true } },
        packages: { where: { status: 'ACTIVE' } },
        reviews: { include: { user: { select: { name: true, avatar: true } } } }
      }
    });
    if (!guide) return res.status(404).json({ error: 'Guide tidak ditemukan' });
    res.json(guide);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil detail guide' });
  }
});

app.get('/api/guide/packages', authenticateToken, async (req: any, res: Response) => {
  try {
    const guide = await prisma.guide.findUnique({ where: { userId: req.user.id } });
    if (!guide) return res.status(403).json({ error: 'Anda bukan guide' });

    const packages = await prisma.tourPackage.findMany({
      where: { guideId: guide.id }
    });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data paket' });
  }
});

app.post('/api/packages', authenticateToken, async (req: any, res: Response) => {
  try {
    const guide = await prisma.guide.findUnique({ where: { userId: req.user.id } });
    if (!guide || guide.status !== 'APPROVED') {
      return res.status(403).json({ error: 'Hanya guide yang disetujui yang dapat membuat paket' });
    }

    const {
      title, category, description, duration, durationType, maxParticipants,
      basePrice, meetingPoint, meetingPointLat, meetingPointLng,
      itinerary, inclusions, exclusions, requirements, photos
    } = req.body;

    const pkg = await prisma.tourPackage.create({
      data: {
        guideId: guide.id,
        title,
        category,
        description,
        duration: Number(duration),
        durationType,
        maxParticipants: Number(maxParticipants),
        basePrice: Number(basePrice),
        meetingPoint,
        meetingPointLat: meetingPointLat ? Number(meetingPointLat) : null,
        meetingPointLng: meetingPointLng ? Number(meetingPointLng) : null,
        itinerary: itinerary || [],
        inclusions: inclusions || [],
        exclusions: exclusions || [],
        requirements: requirements || {},
        photos: photos || []
      }
    });

    res.status(201).json(pkg);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal membuat paket tour' });
  }
});

app.get('/api/guide/bookings', authenticateToken, async (req: any, res: Response) => {
  try {
    const guide = await prisma.guide.findUnique({ where: { userId: req.user.id } });
    if (!guide) return res.status(403).json({ error: 'Anda bukan guide' });

    const bookings = await prisma.booking.findMany({
      where: { guideId: guide.id },
      include: {
        package: true,
        user: { select: { name: true, avatar: true, email: true, phone: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data pesanan' });
  }
});

app.post('/api/bookings/:id/status', authenticateToken, async (req: any, res: Response) => {
  try {
    const { status, cancelReason } = req.body; // CONFIRMED, CANCELLED
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { guide: true }
    });

    if (!booking) return res.status(404).json({ error: 'Pesanan tidak ditemukan' });

    // Check if the user is the guide of this booking
    const guide = await prisma.guide.findUnique({ where: { userId: req.user.id } });
    if (!guide || booking.guideId !== guide.id) {
      return res.status(403).json({ error: 'Anda tidak memiliki akses ke pesanan ini' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: req.params.id },
      data: {
        bookingStatus: status,
        cancelReason: status === 'CANCELLED' ? cancelReason : null,
        cancelledBy: status === 'CANCELLED' ? 'GUIDE' : null
      }
    });

    res.json(updatedBooking);
  } catch (error) {
    console.error("Update Booking Status Error:", error);
    res.status(500).json({ error: 'Gagal memperbarui status pesanan' });
  }
});

app.post('/api/bookings/:id/cancel', authenticateToken, async (req: any, res: Response) => {
  try {
    const { reason } = req.body;
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id }
    });

    if (!booking) return res.status(404).json({ error: 'Pesanan tidak ditemukan' });

    // Ensure the booking belongs to the user
    if (booking.userId !== req.user.id) {
      return res.status(403).json({ error: 'Anda tidak memiliki akses ke pesanan ini' });
    }

    // Only allow cancelling if status is PENDING or CONFIRMED
    if (booking.bookingStatus === 'CANCELLED' || booking.bookingStatus === 'COMPLETED') {
      return res.status(400).json({ error: 'Pesanan sudah dibatalkan atau selesai' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: req.params.id },
      data: {
        bookingStatus: 'CANCELLED',
        cancelReason: reason,
        cancelledBy: 'USER'
      }
    });

    res.json(updatedBooking);
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    res.status(500).json({ error: 'Gagal membatalkan pesanan' });
  }
});

app.put('/api/packages/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const guide = await prisma.guide.findUnique({ where: { userId: req.user.id } });
    if (!guide) return res.status(403).json({ error: 'Akses ditolak' });

    const pkg = await prisma.tourPackage.findUnique({ where: { id: req.params.id } });
    if (!pkg || pkg.guideId !== guide.id) {
      return res.status(403).json({ error: 'Anda tidak memiliki akses ke paket ini' });
    }

    const data = req.body;
    if (data.duration) data.duration = Number(data.duration);
    if (data.maxParticipants) data.maxParticipants = Number(data.maxParticipants);
    if (data.basePrice) data.basePrice = Number(data.basePrice);

    const updated = await prisma.tourPackage.update({
      where: { id: req.params.id },
      data
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengupdate paket' });
  }
});

app.delete('/api/packages/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const guide = await prisma.guide.findUnique({ where: { userId: req.user.id } });
    if (!guide) return res.status(403).json({ error: 'Akses ditolak' });

    const pkg = await prisma.tourPackage.findUnique({ where: { id: req.params.id } });
    if (!pkg || pkg.guideId !== guide.id) {
      return res.status(403).json({ error: 'Anda tidak memiliki akses ke paket ini' });
    }

    await prisma.tourPackage.delete({ where: { id: req.params.id } });
    res.json({ message: 'Paket berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus paket' });
  }
});

app.get('/api/packages', async (req: Request, res: Response) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    const where: any = { status: 'ACTIVE' };

    if (category && category !== 'Semua') where.category = String(category);
    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = Number(minPrice);
      if (maxPrice) where.basePrice.lte = Number(maxPrice);
    }

    const packages = await prisma.tourPackage.findMany({
      where,
      include: { guide: { include: { user: { select: { name: true, avatar: true } } } } }
    });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data paket tour' });
  }
});

app.get('/api/packages/:id', async (req: Request, res: Response) => {
  try {
    const pkg = await prisma.tourPackage.findUnique({
      where: { id: String(req.params.id) },
      include: { guide: { include: { user: { select: { name: true, avatar: true } } } } }
    });
    if (!pkg) return res.status(404).json({ error: 'Paket tidak ditemukan' });
    res.json(pkg);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil detail paket' });
  }
});

app.post('/api/bookings', authenticateToken, async (req: any, res: Response) => {
  try {
    const { packageId, tourDate, participants, specialRequests, travelerDetails } = req.body;
    const userId = req.user.id;

    const pkg = await prisma.tourPackage.findUnique({ where: { id: packageId } });
    if (!pkg) return res.status(404).json({ error: 'Paket tidak ditemukan' });

    const totalPrice = pkg.basePrice * participants;

    const booking = await prisma.booking.create({
      data: {
        packageId,
        guideId: pkg.guideId,
        userId,
        tourDate: new Date(tourDate),
        participants,
        totalPrice,
        specialRequests,
        travelerDetails
      }
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal membuat booking' });
  }
});

app.get('/api/bookings', authenticateToken, async (req: any, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        package: true,
        guide: { include: { user: { select: { name: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data booking' });
  }
});


// --- CHAT SYSTEM ROUTES ---

app.post('/api/conversations', authenticateToken, async (req: any, res: Response) => {
  try {
    const { guideId, subjectTitle, subjectDate } = req.body;
    const userId = req.user.id;

    // Check if conversation already exists between this user and guide
    let conversation = await prisma.conversation.findFirst({
      where: {
        guideId,
        members: { some: { userId } }
      },
      include: { members: true }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          guideId,
          subjectTitle,
          subjectDate,
          members: {
            create: { userId }
          }
        },
        include: { members: true }
      });
    } else if (subjectTitle || subjectDate) {
      // Update subject if it's an existing conversation and new subject info provided
      conversation = await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          subjectTitle,
          subjectDate,
          updatedAt: new Date()
        },
        include: { members: true }
      });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Gagal membuat percakapan' });
  }
});

app.get('/api/conversations', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { members: { some: { userId } } },
          { guide: { userId } }
        ]
      },
      include: {
        guide: { include: { user: { select: { name: true, avatar: true } } } },
        members: { include: { user: { select: { name: true, avatar: true } } } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil daftar percakapan' });
  }
});

app.get('/api/conversations/:id/messages', authenticateToken, async (req: Request, res: Response) => {
  try {
    const messages = await prisma.message.findMany({
      where: { conversationId: String(req.params.id) },
      include: { sender: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: 'asc' }
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil pesan' });
  }
});

app.post('/api/conversations/:id/messages', authenticateToken, async (req: any, res: Response) => {
  try {
    const { content } = req.body;
    const message = await prisma.message.create({
      data: {
        conversationId: req.params.id,
        senderId: req.user.id,
        content
      },
      include: { sender: { select: { name: true, avatar: true } } }
    });

    // Update conversation updatedAt
    await prisma.conversation.update({
      where: { id: req.params.id },
      data: { updatedAt: new Date() }
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengirim pesan' });
  }
});


// --- TRAVEL BUDDY API ---
app.get('/api/buddies', async (req: Request, res: Response) => {
  try {
    const { status, destinationId } = req.query;
    const where: any = {};
    if (status) where.status = String(status);
    if (destinationId) where.destinationId = String(destinationId);

    const buddies = await prisma.travelBuddyPost.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, avatar: true, level: true } },
        destination: { select: { name: true } },
        _count: { select: { applications: { where: { status: 'ACCEPTED' } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(buddies);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data Travel Buddy' });
  }
});

app.post('/api/buddies', authenticateToken, async (req: any, res: Response) => {
  try {
    const { title, description, destinationId, startDate, endDate, maxBuddies, budgetRange, requirements } = req.body;
    const post = await prisma.travelBuddyPost.create({
      data: {
        userId: req.user.id,
        title,
        description,
        destinationId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        maxBuddies: Number(maxBuddies),
        budgetRange,
        requirements
      }
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Gagal membuat postingan Travel Buddy' });
  }
});

app.get('/api/buddies/:id', async (req: Request, res: Response) => {
  try {
    const post = await prisma.travelBuddyPost.findUnique({
      where: { id: req.params.id as string },
      include: {
        user: { select: { id: true, name: true, avatar: true, level: true } },
        destination: true,
        applications: {
          include: { user: { select: { id: true, name: true, avatar: true } } }
        }
      }
    });
    if (!post) return res.status(404).json({ error: 'Postingan tidak ditemukan' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil detail Travel Buddy' });
  }
});

app.post('/api/buddies/:id/apply', authenticateToken, async (req: any, res: Response) => {
  try {
    const { message } = req.body;
    const application = await prisma.travelBuddyApplication.create({
      data: {
        postId: req.params.id,
        userId: req.user.id,
        message
      }
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: 'Gagal melamar sebagai Travel Buddy' });
  }
});

app.put('/api/buddies/applications/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const { status } = req.body; // ACCEPTED or REJECTED

    // Check if the requester is the owner of the post
    const application = await prisma.travelBuddyApplication.findUnique({
      where: { id: req.params.id },
      include: { post: true }
    });

    if (!application || application.post.userId !== req.user.id) {
      return res.status(403).json({ error: 'Tidak memiliki akses' });
    }

    const updated = await prisma.travelBuddyApplication.update({
      where: { id: req.params.id },
      data: { status }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengupdate status lamaran' });
  }
});


// --- SERVE FRONTEND (PRODUCTION) ---
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend TIC-PADANG berjalan di http://0.0.0.0:${PORT}`);
});
