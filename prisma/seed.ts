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

    const tableLocations = await prisma.tableLocations.createMany({
        data: [
            {location:'Salon'},
            {location:'Bahçe'},
            {location:'Teras'}
        ],
        skipDuplicates: true,
    });
    console.log(`✓ Created ${tableLocations.count} location`);
    // Create sample tables
    const tables = await prisma.tables.createMany({
        data: [
            { table_number: '1', capacity: 2, status: 'AVAILABLE',location_id:'cmiz5gpak00059whma26iuh0p'},
            { table_number: '2', capacity: 2, status: 'READY_TO_ORDER',location_id:'cmiz5gpak00059whma26iuh0p' },
            { table_number: '3', capacity: 4, status: 'RESERVED',location_id:'cmiz5gpak00059whma26iuh0p'},
            { table_number: '4', capacity: 4, status: 'OCCUPIED',location_id:'cmiz5gpak00059whma26iuh0p'},
            { table_number: '5', capacity: 6, status: 'CLOSED',location_id:'cmiz5gpak00069whmq0oj7jqh' },
            { table_number: '6', capacity: 8, status: 'AVAILABLE',location_id:'cmiz5gpak00079whmc36ru69y'},
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