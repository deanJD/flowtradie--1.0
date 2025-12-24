// prisma/seed.ts
import seedRegion from "./seedRegion.js";
import seedBusiness from "./seedBusiness.js";
import seedAdmin from "./seedAdmin.js";
import seedClient from "./seedClient.js";
import seedProject from "./seedProject.js";
import { seedTasks } from "./seedTask.js";
async function main() {
    console.log("🌱 Starting full seed...");
    await seedRegion(); // 1) must run first
    await seedBusiness(); // 2) must run second (creates invoiceSettings automatically)
    await seedAdmin(); // 3) creates user
    await seedClient(); // 4) client
    await seedProject();
    await seedTasks(); // 5) project
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
//# sourceMappingURL=seed.js.map