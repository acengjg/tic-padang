import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const badges = [
        {
            name: 'Bronze Explorer',
            description: 'Kunjungi 5 destinasi wisata pertama Anda.',
            image: '/badges/bronze-explorer.png',
            category: 'EXPLORER',
            threshold: 5,
            tier: 'BRONZE' as const,
        },
        {
            name: 'Silver Wanderer',
            description: 'Kunjungi 15 destinasi wisata.',
            image: '/badges/silver-wanderer.png',
            category: 'EXPLORER',
            threshold: 15,
            tier: 'SILVER' as const,
        },
        {
            name: 'Gold Adventurer',
            description: 'Kunjungi 30 destinasi wisata.',
            image: '/badges/gold-adventurer.png',
            category: 'EXPLORER',
            threshold: 30,
            tier: 'GOLD' as const,
        },
        {
            name: 'Beach Hopper',
            description: 'Kunjungi 5 pantai indah di Padang.',
            image: '/badges/beach-hopper.png',
            category: 'NATURE',
            threshold: 5,
            tier: 'BRONZE' as const,
        },
        {
            name: 'Culinary Master',
            description: 'Cicipi kuliner di 10 tempat makan berbeda.',
            image: '/badges/culinary-master.png',
            category: 'CULINARY',
            threshold: 10,
            tier: 'SILVER' as const,
        },
        {
            name: 'Heritage Seeker',
            description: 'Kunjungi 5 lokasi bersejarah atau museum.',
            image: '/badges/heritage-seeker.png',
            category: 'CULTURAL',
            threshold: 5,
            tier: 'BRONZE' as const,
        },
    ];

    console.log('Seeding badges...');
    for (const b of badges) {
        await prisma.badge.upsert({
            where: { id: b.name.toLowerCase().replace(/\s+/g, '-') },
            update: b,
            create: {
                id: b.name.toLowerCase().replace(/\s+/g, '-'),
                ...b,
            },
        });
    }
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
