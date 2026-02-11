import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('1. Connecting to DB...');
        const user = await prisma.user.findUnique({
            where: { email: 'admin@tic.com' }
        });

        if (!user) {
            console.error('User not found!');
            return;
        }

        console.log('2. User found:', user.email, user.role);
        console.log('3. Stored Hash:', user.password);

        const testPass = '12345678';
        console.log('4. Testing password:', testPass);
        const isMatch = await bcrypt.compare(testPass, user.password);

        console.log('5. Match Result:', isMatch);
    } catch (e) {
        console.error('ERROR:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
