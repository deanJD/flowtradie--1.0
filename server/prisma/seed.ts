// server/prisma/seed.ts
import { PrismaClient, UserRole } from '@prisma/client';
import { hashPassword } from '../src/utils/password.js'; // Adjust path if your password util is elsewhere

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  const password = await hashPassword('password123');

  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      email: 'owner@example.com',
      name: 'Admin User',
      password: password,
      role: UserRole.OWNER,
    },
  });

  console.log(`Seeding finished.`);
  console.log(`Created OWNER user: ${owner.email} with password: 'password123'`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });