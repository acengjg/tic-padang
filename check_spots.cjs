
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const spots = await prisma.culinarySpot.findMany();
    console.log(`Total spots: ${spots.length}`);
    spots.forEach(s => {
        console.log(`ID: ${s.id}, Name: ${s.name}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
