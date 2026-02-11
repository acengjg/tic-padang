
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const guides = await prisma.guide.findMany({
        include: { user: true }
    });
    console.log(JSON.stringify(guides, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
