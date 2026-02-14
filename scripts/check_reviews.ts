
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        // 1. Get the first user
        const user = await prisma.user.findFirst();
        if (!user) {
            console.log("No user found");
            return;
        }
        console.log(`Checking reviews for user: ${user.name} (${user.id})`);

        // 2. Check existing culinary reviews
        const culinaryReviews = await prisma.culinaryReview.findMany({
            where: { userId: user.id },
            include: { spot: true }
        });
        console.log(`Found ${culinaryReviews.length} culinary reviews directly from DB.`);

        if (culinaryReviews.length === 0) {
            console.log("Creating a dummy culinary review...");
            const spot = await prisma.culinarySpot.findFirst();
            if (!spot) {
                console.log("No culinary spot found to review.");

                // Create a dummy spot
                const newSpot = await prisma.culinarySpot.create({
                    data: {
                        name: "Test Warung",
                        category: "Warung",
                        description: "Test Description",
                        priceRange: "$",
                        address: "Test Address",
                        lat: 0,
                        lng: 0,
                        image: "https://via.placeholder.com/150",
                        facilities: ["Wifi"],
                    }
                });
                console.log("Created dummy spot:", newSpot.id);

                // Create review
                await prisma.culinaryReview.create({
                    data: {
                        userId: user.id,
                        spotId: newSpot.id,
                        rating: 5,
                        comment: "Test Culinary Review",
                    }
                });
                console.log("Created dummy review.");
            } else {
                // Create review
                await prisma.culinaryReview.create({
                    data: {
                        userId: user.id,
                        spotId: spot.id,
                        rating: 5,
                        comment: "Test Culinary Review",
                    }
                });
                console.log("Created dummy review.");
            }
        }

        // 3. Simulate the API logic
        const [destReviews, culReviews] = await Promise.all([
            prisma.review.findMany({
                where: { userId: user.id },
                include: { destination: { select: { name: true, image: true } } },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.culinaryReview.findMany({
                where: { userId: user.id },
                include: { spot: { select: { name: true, image: true } } },
                orderBy: { createdAt: 'desc' }
            })
        ]);

        console.log(`API Logic found: ${destReviews.length} destination reviews and ${culReviews.length} culinary reviews.`);

        const formattedCulinaryReviews = culReviews.map(review => ({
            ...review,
            destination: review.spot,
            type: 'CULINARY'
        }));

        // Check structure of formatted review
        if (formattedCulinaryReviews.length > 0) {
            console.log("Sample formatted culinary review:", JSON.stringify(formattedCulinaryReviews[0], null, 2));
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
