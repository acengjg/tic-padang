
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkData() {
    try {
        const culinarySpots = await prisma.culinarySpot.findMany();
        console.log('Total Culinary Spots:', culinarySpots.length);
        if (culinarySpots.length > 0) {
            console.log('First spot name:', culinarySpots[0].name);
        } else {
            console.log('No culinary spots found in database.');
        }

        const destinations = await prisma.destination.findMany();
        console.log('Total Destinations:', destinations.length);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

checkData();
