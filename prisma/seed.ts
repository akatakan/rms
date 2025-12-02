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
    const admin = await prisma.user.upsert({
        where: {username: 'admin'},
        update: {},
        create:{
            username: 'admin',
            password: await hash('admin123', 10),
            role: 'ADMIN',
        }
    });
    console.log('Admin user created:', admin);
}

main().then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});