import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const existing = await prisma.invoiceSettings.findFirst();
    if (existing) {
        console.log("⚠️  Invoice settings already exist in the database.");
        return;
    }
    // ✅ Create your default Invoice Settings record
    const settings = await prisma.invoiceSettings.create({
        data: {
            businessName: "Flowtradie Pty Ltd",
            abn: "98 977 056 345",
            address: "1 Rise Rd, Perth WA",
            phone: "0482 789 345",
            email: "contact@flowtradie.com",
            website: "https://flowtradie.com",
            logoUrl: "",
            bankDetails: "BSB: 123-456 | ACC: 987654321",
            invoicePrefix: "INV-",
            startingNumber: 1,
            defaultDueDays: 14,
            gstRate: 0.1,
            smtpHost: "",
            smtpPort: null,
            smtpUser: "",
            smtpPassword: "",
            fromEmail: "noreply@flowtradie.com",
            fromName: "Flowtradie Admin",
        },
    });
    console.log("✅ Invoice settings saved to your database:");
    console.log(settings);
}
main()
    .catch((e) => {
    console.error("❌ Error seeding invoice settings:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seedInvoiceSettings.js.map