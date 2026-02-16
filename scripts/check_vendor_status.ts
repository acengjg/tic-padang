
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkVendors() {
    try {
        const vendors = await prisma.souvenirVendor.findMany({
            include: {
                user: true
            }
        });

        console.log('--- Souvenir Vendors ---');
        vendors.forEach((v) => {
            console.log(`ID: ${v.id}, Name: ${v.name}, Status: ${v.status}, User: ${v.user?.name} (Role: ${v.user?.role})`);
        });

        const products = await prisma.souvenirProduct.findMany({
            include: {
                vendor: true
            }
        });

        console.log('\n--- Souvenir Products ---');
        products.forEach((p) => {
            console.log(`ID: ${p.id}, Name: ${p.name}, Vendor: ${p.vendor?.name} (${p.vendor?.status})`);
        });

    } catch (error) {
        console.error('Error checking vendors:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkVendors();
