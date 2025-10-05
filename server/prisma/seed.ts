// server/prisma/seed.ts
import { PrismaClient, UserRole, ProjectStatus } from '@prisma/client'; // <-- 1. ADD ProjectStatus HERE
import { hashPassword } from '../src/utils/password.js';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // 1. DELETE ALL EXISTING DATA
  console.log('Deleting existing data...');
  await prisma.task.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.quoteItem.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.projectExpense.deleteMany();
  await prisma.timeLog.deleteMany();
  await prisma.project.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  // 2. CREATE THE OWNER USER
  console.log('Creating owner user...');
  const password = await hashPassword('password123');
  const owner = await prisma.user.create({
    data: {
      email: 'owner@example.com',
      name: 'Admin Owner',
      password: password,
      role: UserRole.OWNER,
    },
  });

  // 3. CREATE A CLIENT
  console.log('Creating a client...');
  const client = await prisma.client.create({
    data: {
      name: 'Skyline Constructions',
      email: 'skyline@example.com',
    },
  });

  // 4. CREATE A PROJECT FOR THAT CLIENT
  console.log('Creating a project...');
  const project = await prisma.project.create({
    data: {
      title: 'Downtown Office Renovation',
      status: ProjectStatus.ACTIVE, // <-- 2. USE THE ENUM MEMBER HERE
      clientId: client.id,
      managerId: owner.id,
    },
  });

  // 5. CREATE TASKS FOR THAT PROJECT
  console.log('Creating tasks for the project...');
  await prisma.task.createMany({
    data: [
      { title: 'Finalize blueprint', isCompleted: true, projectId: project.id, assignedToId: owner.id },
      { title: 'Order materials', isCompleted: true, projectId: project.id },
      { title: 'Begin demolition', isCompleted: false, projectId: project.id },
      { title: 'Plumbing rough-in', isCompleted: false, projectId: project.id },
    ],
  });

  console.log(`Seeding finished.`);
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