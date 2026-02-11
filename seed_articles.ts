
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const articles = [
        {
            title: "Festival Siti Nurbaya 2026: Kemeriahan Budaya di Tepi Pantai",
            content: "Festival Siti Nurbaya kembali hadir di tahun 2026 dengan rangkaian acara yang lebih megah. Mulai dari lomba selaju sampan hingga pawai budaya Minangkabau.",
            category: "Budaya",
            author: "Admin",
            image: "https://images.unsplash.com/photo-1596422846543-75c6fc18a5ce?q=80&w=400&fit=crop"
        },
        {
            title: "5 Spot Sunset Terbaik di Padang yang Wajib Dikunjungi",
            content: "Padang terkenal dengan sunsetnya yang memukau. Berikut adalah 5 spot terbaik mulai dari Pantai Air Manis hingga Gunung Padang.",
            category: "Tips",
            author: "Admin",
            image: "https://images.unsplash.com/photo-1623945231649-65103c812d8a?q=80&w=400&fit=crop"
        },
        {
            title: "Wisata Kuliner: Menjelajahi Kelezatan Sate Padang di Malam Hari",
            content: "Sate Padang adalah primadona kuliner malam hari. Temukan rekomendasi sate padang paling legendaris di pusat kota Padang.",
            category: "Kuliner",
            author: "Admin",
            image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800"
        }
    ];

    for (const article of articles) {
        await prisma.article.create({
            data: article
        });
    }

    console.log("Mock articles created!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
