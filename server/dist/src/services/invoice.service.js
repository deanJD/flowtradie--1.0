import { InvoiceStatus } from "@prisma/client";
// Helper to calculate totals based on items
const calculateInvoiceTotals = (items, gstRate) => {
    const rate = gstRate ?? 0.1;
    const subtotal = items.reduce((sum, item) => sum + ((item.quantity ?? 1) * item.unitPrice), 0);
    const gstAmount = subtotal * rate;
    const totalAmount = subtotal + gstAmount;
    return { subtotal, gstAmount, totalAmount };
};
export const invoiceService = {
    // --- Get All Invoices ---
    getAll: async (projectId, ctx) => {
        const where = { deletedAt: null };
        if (projectId)
            where.projectId = projectId;
        return ctx.prisma.invoice.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                items: { select: { id: true } },
                payments: { where: { deletedAt: null }, select: { amount: true } },
                project: { include: { client: { select: { id: true, name: true } } } },
            },
        });
    },
    // --- Get Single Invoice ---
    getById: async (id, ctx) => {
        return ctx.prisma.invoice.findFirst({
            where: { id, deletedAt: null },
            include: {
                items: true,
                payments: { where: { deletedAt: null }, orderBy: { date: "asc" } },
                project: { include: { client: true } },
            },
        });
    },
    // --- Create Invoice (SNAPSHOT) ---
    create: async (input, ctx) => {
        const { projectId, items, gstRate, status, ...restInput } = input;
        const settings = await ctx.prisma.companySettings.findFirst();
        if (!settings) {
            throw new Error("Company settings not found. Please configure them before creating invoices.");
        }
        const currentGstRate = gstRate ?? 0.1;
        const currentStatus = status ?? InvoiceStatus.DRAFT;
        const totals = calculateInvoiceTotals(items, currentGstRate);
        const itemsData = items.map((i) => ({
            description: i.description,
            quantity: i.quantity ?? 1,
            unitPrice: i.unitPrice,
            total: (i.quantity ?? 1) * i.unitPrice,
        }));
        return ctx.prisma.invoice.create({
            data: {
                ...restInput,
                projectId,
                gstRate: currentGstRate,
                status: currentStatus,
                ...totals,
                // ✅ SNAPSHOT
                businessName: settings.businessName,
                abn: settings.abn ?? null,
                address: settings.address ?? null,
                phone: settings.phone ?? null,
                email: settings.email ?? null,
                website: settings.website ?? null,
                logoUrl: settings.logoUrl ?? null,
                bankDetails: settings.bankDetails ?? null,
                items: { createMany: { data: itemsData } },
            },
            include: {
                items: true,
                project: { include: { client: true } },
                payments: true,
            },
        });
    },
    // --- Create from Quote (SNAPSHOT) ---
    createFromQuote: async (quoteId, ctx) => {
        const quote = await ctx.prisma.quote.findFirst({
            where: { id: quoteId, deletedAt: null },
            include: { items: true, project: true },
        });
        if (!quote || !quote.project)
            throw new Error("Quote or associated project not found.");
        const settings = await ctx.prisma.companySettings.findFirst();
        if (!settings) {
            throw new Error("Company settings not found. Please configure them before creating invoices.");
        }
        const newInvoiceNumber = `INV-${quote.quoteNumber}`;
        const issueDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);
        return ctx.prisma.$transaction(async (prismaTX) => {
            return prismaTX.invoice.create({
                data: {
                    projectId: quote.projectId,
                    invoiceNumber: newInvoiceNumber,
                    issueDate,
                    dueDate,
                    status: InvoiceStatus.DRAFT,
                    subtotal: quote.subtotal,
                    gstRate: quote.gstRate,
                    gstAmount: quote.gstAmount,
                    totalAmount: quote.totalAmount,
                    // ✅ SNAPSHOT
                    businessName: settings.businessName,
                    abn: settings.abn ?? null,
                    address: settings.address ?? null,
                    phone: settings.phone ?? null,
                    email: settings.email ?? null,
                    website: settings.website ?? null,
                    logoUrl: settings.logoUrl ?? null,
                    bankDetails: settings.bankDetails ?? null,
                    items: {
                        createMany: {
                            data: quote.items.map((item) => ({
                                description: item.description,
                                quantity: item.quantity,
                                unitPrice: item.unitPrice,
                                total: item.total,
                            })),
                        },
                    },
                },
                include: {
                    items: true,
                    project: { include: { client: true } },
                    payments: true,
                },
            });
        });
    },
    // --- Update Invoice (NULLS IGNORED ✅) ---
    update: async (id, input, ctx) => {
        return ctx.prisma.$transaction(async (prismaTX) => {
            const { items, ...invoiceDataInput } = input;
            const invoiceData = {};
            if (invoiceDataInput.invoiceNumber != null)
                invoiceData.invoiceNumber = invoiceDataInput.invoiceNumber;
            if (invoiceDataInput.dueDate != null)
                invoiceData.dueDate = invoiceDataInput.dueDate;
            if (invoiceDataInput.status != null)
                invoiceData.status = invoiceDataInput.status;
            if (invoiceDataInput.gstRate != null)
                invoiceData.gstRate = invoiceDataInput.gstRate;
            let updatedInvoice = await prismaTX.invoice.update({
                where: { id },
                data: invoiceData,
            });
            if (items && items.length > 0) {
                await prismaTX.invoiceItem.deleteMany({ where: { invoiceId: id } });
                const itemsData = items.map((item) => ({
                    invoiceId: id,
                    description: item.description,
                    quantity: item.quantity ?? 1,
                    unitPrice: item.unitPrice,
                    total: (item.quantity ?? 1) * item.unitPrice,
                }));
                await prismaTX.invoiceItem.createMany({ data: itemsData });
            }
            const currentItems = await prismaTX.invoiceItem.findMany({
                where: { invoiceId: id },
            });
            const totals = calculateInvoiceTotals(currentItems, updatedInvoice.gstRate);
            return prismaTX.invoice.update({
                where: { id },
                data: {
                    subtotal: totals.subtotal,
                    gstAmount: totals.gstAmount,
                    totalAmount: totals.totalAmount,
                },
                include: {
                    items: true,
                    payments: { where: { deletedAt: null }, orderBy: { date: "asc" } },
                    project: { include: { client: true } },
                },
            });
        });
    },
    // --- Soft Delete Invoice ---
    delete: async (id, ctx) => {
        return ctx.prisma.invoice.update({
            where: { id },
            data: { deletedAt: new Date() },
            select: { id: true },
        });
    },
};
//# sourceMappingURL=invoice.service.js.map