import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Guide Marketplace...');

    // 1. Find or Create User for Guide
    const guideUser = await prisma.user.findFirst({
        where: { email: 'guide@example.com' }
    }) || await prisma.user.create({
        data: {
            name: 'Rahmat Hidayat',
            email: 'guide@example.com',
            password: 'hashed_password', // In real app, this would be hashed
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahmat',
            role: 'USER'
        }
    });

    // 2. Create Guide Profile
    const guide = await prisma.guide.upsert({
        where: { userId: guideUser.id },
        update: { status: 'APPROVED' },
        create: {
            userId: guideUser.id,
            status: 'APPROVED',
            verificationLevel: 'VERIFIED',
            bio: 'Pemandu lokal asli Padang dengan pengalaman lebih dari 5 tahun mengenalkan kuliner dan sejarah Minangkabau.',
            languages: ['Bahasa', 'Minang', 'English'],
            specializations: ['Kuliner', 'Sejarah', 'Budaya'],
            yearsExperience: 6,
            averageRating: 4.8,
            totalTours: 124
        }
    });

    // 3. Create Tour Packages
    const packages = [
        {
            guideId: guide.id,
            title: 'Jelajah Kuliner Malam Pasar Raya',
            category: 'Kuliner',
            tags: ['Street Food', 'Malam hari'],
            description: 'Menelusuri cita rasa autentik Padang di malam hari. Mulai dari Sate Padang legendaris hingga Martabak Mesir.',
            duration: 3,
            durationType: 'HALF_DAY',
            maxParticipants: 6,
            basePrice: 150000,
            meetingPoint: 'Depan Masjid Raya Ganting',
            itinerary: [
                { time: '19:00', place: 'Meeting Point', activity: 'Briefing dan perkenalan' },
                { time: '19:30', place: 'Sate Padang Ajo', activity: 'Mencicipi sate padang khas Pariaman' },
                { time: '20:30', place: 'Los Lambuang', activity: 'Nasi Kapau dan Teh Talua' }
            ],
            inclusions: ['Pemandu', 'Sample makanan ringan', 'Air mineral'],
            exclusions: ['Makan besar', 'Transportasi ke lokasi'],
            requirements: { fitnessLevel: 'Easy', minAge: 5 },
            photos: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800'],
            status: 'ACTIVE'
        },
        {
            guideId: guide.id,
            title: 'Wisata Sejarah Kota Tua Padang',
            category: 'Budaya',
            tags: ['Sejarah', 'Arsitektur', 'Fotografi'],
            description: 'Mengenal sejarah perdagangan di Pantai Barat Sumatera melalui bangunan tua peninggalan Belanda.',
            duration: 4,
            durationType: 'HALF_DAY',
            maxParticipants: 10,
            basePrice: 100000,
            meetingPoint: 'Jembatan Siti Nurbaya',
            itinerary: [
                { time: '08:00', place: 'Jembatan Siti Nurbaya', activity: 'Fotografi dan sejarah jembatan' },
                { time: '09:00', place: 'Muaro Padang', activity: 'Melihat kapal nelayan dan gudang tua' },
                { time: '10:30', place: 'Kelenteng See Hin Kiong', activity: 'Mengenal akulturasi budaya di Padang' }
            ],
            inclusions: ['Pemandu', 'Tiket masuk museum'],
            exclusions: ['Makan siang', 'Transportasi'],
            requirements: { fitnessLevel: 'Moderate', minAge: 10 },
            photos: ['https://images.unsplash.com/photo-1596422846543-75c6fc18a593?q=80&w=800'],
            status: 'ACTIVE'
        }
    ];

    for (const pkg of packages) {
        await prisma.tourPackage.create({ data: pkg as any });
    }

    console.log('Seed Guide Marketplace completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
