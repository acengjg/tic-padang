
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany();
        console.log(`Found ${users.length} users:`);
        for (const user of users) {
            const destReviews = await prisma.review.count({ where: { userId: user.id } });
            const culReviews = await prisma.culinaryReview.count({ where: { userId: user.id } });
            console.log(`- ${user.name} (${user.email}): ${destReviews} dest reviews, ${culReviews} culinary reviews`);
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
