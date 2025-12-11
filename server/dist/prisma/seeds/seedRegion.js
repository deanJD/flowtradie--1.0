// prisma/seeds/seedRegion.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default async function seedRegion() {
    console.log("🌱 Seeding Regions...");
    const regions = [
        {
            code: "AU",
            name: "Australia",
            currencyCode: "AUD",
            currencySymbol: "$",
            taxLabel: "GST",
            defaultTaxRate: 10.0,
            locale: "en-AU",
        },
        {
            code: "UK", // or GB
            name: "United Kingdom",
            currencyCode: "GBP",
            currencySymbol: "£",
            taxLabel: "VAT",
            defaultTaxRate: 20.0, // Standard UK VAT
            locale: "en-GB",
        },
        {
            code: "US",
            name: "United States",
            currencyCode: "USD",
            currencySymbol: "$",
            taxLabel: "Tax", // US Tax varies by state, so we default to generic "Tax"
            defaultTaxRate: 0.0, // Default to 0% and let them set it in Settings
            locale: "en-US",
        },
        {
            code: "NZ",
            name: "New Zealand",
            currencyCode: "NZD",
            currencySymbol: "$",
            taxLabel: "GST",
            defaultTaxRate: 15.0,
            locale: "en-NZ",
        }
    ];
    for (const region of regions) {
        await prisma.region.upsert({
            where: { code: region.code },
            update: region, // Updates existing if they changed
            create: region,
        });
        console.log(`   ➤ Region ${region.code} seeded.`);
    }
}
//# sourceMappingURL=seedRegion.js.map