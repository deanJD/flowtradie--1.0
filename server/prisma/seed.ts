// server/prisma/seed.ts
import { PrismaClient } from "@prisma/client";

import seedRegion from "./seeds/seedRegion.js";
import seedBusiness from "./seeds/seedBusiness.js";
import seedInvoiceSettings from "./seeds/seedInvoiceSettings.js";
import seedAdmin from "./seeds/seedAdmin.js";
import seedClient from "./seeds/seedClient.js";
import seedProject from "./seeds/seedProject.js";
import seedInvoice from "./seeds/seedInvoice.js";
import seedPayment from "./seeds/seedPayment.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting full seed...");

  await seedRegion(prisma);
  await seedBusiness(prisma);
  await seedInvoiceSettings(prisma);
  await seedAdmin(prisma);
  await seedClient(prisma);
  await seedProject(prisma);
  await seedInvoice(prisma);
  await seedPayment(prisma);

  console.log("🌱 Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
