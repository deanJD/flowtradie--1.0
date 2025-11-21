// prisma/seed.ts
import seedRegion from "./seeds/seedRegion.js"
import seedBusiness from "./seeds/seedBusiness.js"
import seedInvoiceSettings from "./seeds/seedInvoiceSettings.js"
import seedAdmin from "./seeds/seedAdmin.js"

async function main() {
  console.log("🌱 Starting full seed...")

  await seedRegion()
  await seedBusiness()
  await seedInvoiceSettings()
  await seedAdmin()

  console.log("🌱 Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e)
    process.exit(1)
  })
