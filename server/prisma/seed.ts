// server/prisma/seed.ts
import { PrismaClient, UserRole } from '@prisma/client';
import { hashPassword } from '../src/utils/password.js';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // 1. DELETE ALL EXISTING DATA (in reverse order of creation to avoid errors)
  console.log('Deleting existing data...');
  await prisma.task.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.quoteItem.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.jobExpense.deleteMany();
  await prisma.timeLog.deleteMany();
  await prisma.job.deleteMany();
  await prisma.customer.deleteMany();
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

  // 3. CREATE A CUSTOMER
  console.log('Creating a customer...');
  const customer = await prisma.customer.create({
    data: {
      name: 'Skyline Constructions',
      email: 'skyline@example.com',
    },
  });

  // 4. CREATE A JOB FOR THAT CUSTOMER
  console.log('Creating a job...');
  const job = await prisma.job.create({
    data: {
      title: 'Downtown Office Renovation',
      status: 'ACTIVE',
      customerId: customer.id,
      managerId: owner.id, // Assign our new owner as the manager
    },
  });

  // 5. CREATE TASKS FOR THAT JOB
  console.log('Creating tasks for the job...');
  await prisma.task.createMany({
    data: [
      { title: 'Finalize blueprint', isCompleted: true, jobId: job.id, assignedToId: owner.id },
      { title: 'Order materials', isCompleted: true, jobId: job.id },
      { title: 'Begin demolition', isCompleted: false, jobId: job.id },
      { title: 'Plumbing rough-in', isCompleted: false, jobId: job.id },
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