import { PrismaClient } from 'src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';
import { hash } from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({adapter})

async function main() {
    const users = await Promise.all([
        prisma.users.upsert({
            where: {username: 'admin'},
            update: {},
            create:{
                username: 'admin',
                password_hash: await hash('admin123', 10),
                role: 'ADMIN',
                full_name: 'Administrator',
            }
        }),
        prisma.users.upsert({
            where: {username: 'waiter1'},
            update: {},
            create:{
                username: 'waiter1',
                password_hash: await hash('waiter123', 10),
                role: 'WAITER',
                full_name: 'John Waiter',
                phone: '123-456-7891',
            }
        }),
        prisma.users.upsert({
            where: {username: 'waiter2'},
            update: {},
            create:{
                username: 'waiter2',
                password_hash: await hash('waiter123', 10),
                role: 'WAITER',
                full_name: 'Sarah Waiter',
                phone: '123-456-7892',
            }
        }),
        prisma.users.upsert({
            where: {username: 'kitchen1'},
            update: {},
            create:{
                username: 'kitchen1',
                password_hash: await hash('kitchen123', 10),
                role: 'KITCHEN',
                full_name: 'Chef Kitchen',
                phone: '123-456-7893',
            }
        }),
        prisma.users.upsert({
            where: {username: 'cashier1'},
            update: {},
            create:{
                username: 'cashier1',
                password_hash: await hash('cashier123', 10),
                role: 'CASHIER',
                full_name: 'Mike Cashier',
                phone: '123-456-7894',
            }
        }),
    ]);
    console.log(`✓ Created ${users.length} users:`, users.map(u => `${u.username} (${u.role})`).join(', '));

    // Create sample tables
    const tables = await prisma.tables.createMany({
        data: [
            { table_number: '1', capacity: 2, status: 'AVAILABLE' },
            { table_number: '2', capacity: 2, status: 'AVAILABLE' },
            { table_number: '3', capacity: 4, status: 'AVAILABLE' },
            { table_number: '4', capacity: 4, status: 'OCCUPIED' },
            { table_number: '5', capacity: 6, status: 'AVAILABLE' },
            { table_number: '6', capacity: 8, status: 'AVAILABLE' },
        ],
        skipDuplicates: true,
    });
    console.log(`✓ Created ${tables.count} tables`);
}

main().then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});