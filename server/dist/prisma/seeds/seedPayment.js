function addDays(date, days) {
    return new Date(date.getTime() + days * 86400000);
}
export default async function seedPayment(prisma) {
    console.log("🌱 Seeding payments...");
    const business = await prisma.business.findFirst();
    if (!business)
        throw new Error("Business not found – seedBusiness must run first");
    const invoices = await prisma.invoice.findMany({
        where: { businessId: business.id },
        include: { client: true },
    });
    if (invoices.length === 0) {
        console.log("   ➤ No invoices found – seedInvoice must run first");
        return;
    }
    const existingCount = await prisma.payment.count({
        where: { businessId: business.id },
    });
    if (existingCount > 0) {
        console.log(`   ➤ ${existingCount} payments already exist – skipping`);
        return;
    }
    const paymentsData = [];
    for (const invoice of invoices) {
        if (invoice.status === "PAID") {
            paymentsData.push({
                businessId: business.id,
                clientId: invoice.clientId,
                invoiceId: invoice.id,
                amount: invoice.totalAmount,
                date: addDays(invoice.issueDate, 7),
                method: "Bank Transfer",
                notes: "Seeded full payment",
            });
        }
        else if (invoice.status === "PARTIALLY_PAID") {
            const partial = Number((Number(invoice.totalAmount) * 0.5).toFixed(2));
            paymentsData.push({
                businessId: business.id,
                clientId: invoice.clientId,
                invoiceId: invoice.id,
                amount: partial,
                date: addDays(invoice.issueDate, 7),
                method: "Bank Transfer",
                notes: "Seeded partial payment",
            });
        }
    }
    if (paymentsData.length > 0) {
        await prisma.payment.createMany({ data: paymentsData });
    }
    console.log(`   ➤ Seeded ${paymentsData.length} payments`);
}
//# sourceMappingURL=seedPayment.js.map