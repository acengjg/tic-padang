import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding souvenirs...');

    // Find some users to be vendors
    const users = await prisma.user.findMany({ take: 3 });
    if (users.length < 2) {
        console.log('Not enough users to seed vendors. Please seed users first.');
        return;
    }

    // Update user roles to VENDOR for testing
    await prisma.user.update({
        where: { id: users[0].id },
        data: { role: 'VENDOR' }
    });
    await prisma.user.update({
        where: { id: users[1].id },
        data: { role: 'VENDOR' }
    });

    // Create Vendors
    const vendor1 = await prisma.souvenirVendor.create({
        data: {
            userId: users[0].id,
            name: 'Keripik Balado Christine Hakim',
            description: 'Pusat oleh-oleh khas Padang yang paling legendaris. Terkenal dengan keripik balado yang renyah dan bumbu yang melimpah.',
            image: 'https://images.unsplash.com/photo-1599481238640-4c1288750d7a?q=80&w=400',
            location: 'Jl. Nipah No.38, Padang Barat',
            contact: '62811661166',
            rating: 4.8,
            status: 'APPROVED'
        }
    });

    const vendor2 = await prisma.souvenirVendor.create({
        data: {
            userId: users[1].id,
            name: 'Rendang Gadih',
            description: 'Penyedia rendang kemasan berkualitas tinggi dengan resep turun temurun. Praktis dan tahan lama untuk dibawa pulang.',
            image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=400',
            location: 'Jl. Jend. Sudirman No.12, Padang',
            contact: '6281267891234',
            rating: 4.9,
            status: 'APPROVED'
        }
    });

    // Create Products
    await prisma.souvenirProduct.createMany({
        data: [
            {
                vendorId: vendor1.id,
                name: 'Keripik Balado Merah (250g)',
                description: 'Keripik singkong renyah dengan balutan bumbu balado cabe merah yang pedas manis.',
                price: 35000,
                images: ['https://images.unsplash.com/photo-1599481238640-4c1288750d7a?q=80&w=400'],
                category: 'Makanan',
                stock: 50,
                rating: 4.8
            },
            {
                vendorId: vendor1.id,
                name: 'Sanjai Tawar',
                description: 'Keripik singkong asli Bukittinggi yang diolah secara tradisional tanpa bumbu pedas.',
                price: 25000,
                images: ['https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=400'],
                category: 'Makanan',
                stock: 100,
                rating: 4.5
            },
            {
                vendorId: vendor2.id,
                name: 'Rendang Daging Sapi (500g)',
                description: 'Rendang daging sapi pilihan dengan bumbu rempah otentik Minangkabau. Kemasan kedap udara.',
                price: 150000,
                images: ['https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=400'],
                category: 'Makanan',
                stock: 20,
                rating: 4.9
            },
            {
                vendorId: vendor2.id,
                name: 'Miniatur Rumah Gadang',
                description: 'Souvenir pajangan berbentuk rumah tradisional Minangkabau (Rumah Gadang) dari bahan kayu berkualitas.',
                price: 125000,
                images: ['https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?q=80&w=400'],
                category: 'Kerajinan',
                stock: 10,
                rating: 4.7
            }
        ]
    });

    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
