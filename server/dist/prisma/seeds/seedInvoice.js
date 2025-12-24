import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
function addDays(date, days) {
    return new Date(date.getTime() + days * 86400000);
}
function subDays(date, days) {
    return new Date(date.getTime() - days * 86400000);
}
export default async function seedInvoice(prisma) {
    console.log("🌱 Seeding invoices...");
    const business = await prisma.business.findFirst();
    if (!business)
        throw new Error("Business not found – seedBusiness must run first");
    const settings = await prisma.invoiceSettings.findUnique({
        where: { businessId: business.id },
    });
    if (!settings)
        throw new Error("Invoice settings not found – seedInvoiceSettings must run first");
    const region = await prisma.region.findUnique({
        where: { id: business.regionId },
    });
    if (!region)
        throw new Error("Region not found for business");
    const projects = await prisma.project.findMany({
        where: { businessId: business.id },
        include: { client: true },
    });
    if (projects.length === 0) {
        console.log("   ➤ No projects found – seedProject must run first");
        return;
    }
    const existingCount = await prisma.invoice.count({
        where: { businessId: business.id },
    });
    if (existingCount > 0) {
        console.log(`   ➤ ${existingCount} invoices already exist – skipping`);
        return;
    }
    const prefix = settings.invoicePrefix ?? "INV-";
    let sequence = settings.startingNumber ?? 1;
    const taxRate = Number(region.defaultTaxRate);
    const invoicesData = [];
    const possibleStatuses = ["DRAFT", "SENT", "PAID", "OVERDUE", "PARTIALLY_PAID"];
    for (const project of projects) {
        const numInvoices = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < numInvoices; i++) {
            const subtotal = Number((Math.random() * 1200 + 300).toFixed(2));
            const taxAmount = Number((subtotal * taxRate).toFixed(2));
            const totalAmount = subtotal + taxAmount;
            const issueDate = subDays(new Date(), Math.floor(Math.random() * 30));
            const dueDate = addDays(issueDate, settings.defaultDueDays ?? 14);
            const status = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];
            invoicesData.push({
                businessId: business.id,
                projectId: project.id,
                clientId: project.clientId,
                invoicePrefix: prefix,
                invoiceSequence: sequence,
                invoiceNumber: `${prefix}${sequence.toString().padStart(4, "0")}`,
                status,
                issueDate,
                dueDate,
                notes: "Seeded invoice",
                taxRate,
                taxLabelSnapshot: region.taxLabel,
                currencyCode: region.currencyCode,
                subtotal,
                taxAmount,
                totalAmount,
                businessSnapshot: {
                    id: business.id,
                    name: business.name,
                    email: business.email,
                    phone: business.phone,
                    regionCode: region.code,
                    currencyCode: region.currencyCode,
                    taxLabel: region.taxLabel,
                },
                clientSnapshot: {
                    id: project.client.id,
                    name: project.client.businessName ??
                        `${project.client.firstName} ${project.client.lastName}`,
                    email: project.client.email,
                    phone: project.client.phone,
                    type: project.client.type,
                },
            });
            sequence++;
        }
    }
    await prisma.invoice.createMany({ data: invoicesData });
    console.log(`   ➤ Seeded ${invoicesData.length} invoices`);
}
//# sourceMappingURL=seedInvoice.js.map