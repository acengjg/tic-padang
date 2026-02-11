
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Clearing existing data...');
    await prisma.review.deleteMany();
    await prisma.planItem.deleteMany();
    await prisma.plan.deleteMany();
    await prisma.promotion.deleteMany();
    await prisma.destination.deleteMany();
    await prisma.user.deleteMany();

    console.log('Seeding destinations...');
    await prisma.destination.createMany({
        data: [
            {
                name: 'Sate Padang Mak Syukur',
                category: 'Kuliner',
                rating: 4.8,
                location: 'Padang Panjang',
                image: 'https://images.unsplash.com/photo-1626200419199-391ae487d14a?q=80&w=600&auto=format&fit=crop',
                description: 'Sate legendaris dengan bumbu rempah kuning yang kental dan daging sapi yang empuk. Wajib dicoba saat berkunjung ke Sumatera Barat.',
                price: 'Rp 35.000',
                lat: -0.465,
                lng: 100.395
            },
            {
                name: 'Pantai Padang (Taplau)',
                category: 'Alam',
                rating: 4.5,
                location: 'Kota Padang',
                image: 'https://images.unsplash.com/photo-1571406604292-690a6f874288?q=80&w=600&auto=format&fit=crop',
                image360: 'https://images.unsplash.com/photo-1557939403-1760a0e47505?q=80&w=2000&auto=format&fit=crop',
                description: 'Tempat berkumpul warga untuk menikmati matahari terbenam sembari menyantap pisang bakar dan kelapa muda.',
                price: 'Gratis',
                lat: -0.950,
                lng: 100.354
            },
            {
                name: 'Istano Basa Pagaruyung',
                category: 'Budaya',
                rating: 4.9,
                location: 'Batusangkar',
                image: 'https://images.unsplash.com/photo-1605634543162-87063d82d41a?q=80&w=600&auto=format&fit=crop',
                image360: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2000&auto=format&fit=crop',
                description: 'Replika istana kebesaran Kerajaan Pagaruyung yang megah dengan arsitektur rumah gadang yang ikonik.',
                price: 'Rp 15.000',
                lat: -0.472,
                lng: 100.641
            },
            {
                name: 'Lembah Anai',
                category: 'Alam',
                rating: 4.7,
                location: 'Tanah Datar',
                image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?q=80&w=600&auto=format&fit=crop',
                image360: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2000&auto=format&fit=crop',
                description: 'Air terjun yang terletak persis di pinggir jalan raya utama rute Padang - Bukittinggi.',
                price: 'Rp 5.000',
                lat: -0.485,
                lng: 100.339
            },
            {
                name: 'Nasi Kapau Uni Zaidar',
                category: 'Kuliner',
                rating: 4.8,
                location: 'Bukittinggi',
                image: 'https://images.unsplash.com/photo-1605291771960-a2924151a666?q=80&w=600&auto=format&fit=crop',
                description: 'Nasi Kapau otentik dari Bukittinggi dengan gulai tambusu yang sangat gurih.',
                price: 'Rp 45.000',
                lat: -0.305,
                lng: 100.369
            }
        ]
    });

    console.log('Seeding promotions...');
    await prisma.promotion.createMany({
        data: [
            {
                title: 'Padang Car FreeNight',
                discount: 'Special Event',
                image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=800&auto=format&fit=crop',
                provider: 'Dinas Pariwisata'
            },
            {
                title: 'Diskon Hotel Santika',
                discount: '25% OFF',
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop',
                provider: 'Santika Premiere'
            }
        ]
    });

    console.log('Seeding Admin and User...');
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const hashedUserPassword = await bcrypt.hash('password123', 10);

    await prisma.user.create({
        data: {
            email: 'admin@tic.com',
            password: hashedAdminPassword,
            name: 'Super Admin TIC',
            role: 'ADMIN',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
        }
    });

    await prisma.user.create({
        data: {
            email: 'user@example.com',
            password: hashedUserPassword,
            name: 'Andi Pratama',
            role: 'USER',
            level: 5,
            points: 450,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
        }
    });

    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
