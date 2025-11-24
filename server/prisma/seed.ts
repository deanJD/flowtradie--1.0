// prisma/seed.ts
import seedRegion from "./seeds/seedRegion.js";
import seedBusiness from "./seeds/seedBusiness.js";
import seedAdmin from "./seeds/seedAdmin.js";
import seedClient from "./seeds/seedClient.js";
import seedProject from "./seeds/seedProject.js";

async function main() {
  console.log("🌱 Starting full seed...");

  await seedRegion();     // 1) must run first
  await seedBusiness();   // 2) must run second (creates invoiceSettings automatically)
  await seedAdmin();      // 3) creates user
  await seedClient();     // 4) client
  await seedProject();    // 5) project

  console.log("🌱 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
  })
  .finally(async () => {
    console.log("The seed command has been executed.");
    process.exit(0);
  });
