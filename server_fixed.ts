
import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Hardcoded DB Connection for VPS Stability
const prisma = new PrismaClient({ datasources: { db: { url: 'postgresql://tic_user:tic_password@127.0.0.1:5432/tic_db?schema=public' } } });
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

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
            { expiresIn: '7d' }
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
            { expiresIn: '7d' }
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
    try {
        await prisma.user.delete({ where: { id: req.params.id } });
        res.json({ message: 'User berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghapus pengguna' });
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
            where: { id: req.params.id },
            data: { title, content, image, category, author }
        });
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: 'Gagal memperbarui artikel' });
    }
});

app.delete('/api/admin/articles/:id', authenticateToken, requireAdmin, async (req: any, res: Response) => {
    try {
        await prisma.article.delete({ where: { id: req.params.id } });
        res.json({ message: 'Artikel berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghapus artikel' });
    }
});

// --- REVIEWS ROUTES ---

app.get('/api/reviews/:destinationId', async (req: Request, res: Response) => {
    try {
        const reviews = await prisma.review.findMany({
            where: { destinationId: req.params.destinationId },
            include: { user: { select: { name: true, avatar: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil ulasan' });
        res.status(500).json({ error: 'Gagal mengambil ulasan' });
    }
});

app.get('/api/reviews/user/:userId', async (req: Request, res: Response) => {
    try {
        const reviews = await prisma.review.findMany({
            where: { userId: req.params.userId },
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
            where: { id: req.params.id }
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
            where: { articleId: req.params.id },
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
            where: { id: req.params.id },
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
            where: { userId: req.params.userId },
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
        // Delete items first due to foreign key constraints usually, but cascade delete might handle it.
        // However, explicit deletion is safer if cascade isn't set up.
        // Prisma handles relation deletes if configured, but let's delete items first to be sure or rely on cascade.
        // Let's check schema/prisma behavior. Default prisma doesn't cascade unless specified in schema.
        // To be safe, manual delete of items.
        await prisma.planItem.deleteMany({ where: { planId } });
        await prisma.plan.delete({ where: { id: planId } });
        res.json({ message: 'Rencana berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghapus rencana' });
    }
});

// --- SERVE FRONTEND (PRODUCTION) ---

// Serve uploads folder (already handled above, but explicit check good)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Already line 28

// Serve static files from 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

// 404 for API routes to prevent falling back to index.html
app.use('/api', (req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// SPA Fallback
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend TIC-PADANG berjalan di http://0.0.0.0:${PORT}`);
});
