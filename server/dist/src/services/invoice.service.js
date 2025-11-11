import { InvoiceStatus } from "@prisma/client";
/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */
const calcTotals = (items, gstRate) => {
    const rate = gstRate ?? 0.1;
    const subtotal = items.reduce((sum, item) => sum + ((item.quantity ?? 1) * item.unitPrice), 0);
    const gstAmount = subtotal * rate;
    const totalAmount = subtotal + gstAmount;
    return { subtotal, gstAmount, totalAmount };
};
const normalizeGst = (rate) => {
    if (rate == null)
        return 0.1;
    return rate > 1 ? rate / 100 : rate;
};
/* -------------------------------------------------------
   Invoice Service
------------------------------------------------------- */
export const invoiceService = {
    /* ----------------------------
       Get All Invoices
    ---------------------------- */
    getAll: async (projectId, ctx) => {
        const where = { deletedAt: null };
        if (projectId)
            where.projectId = projectId;
        return ctx.prisma.invoice.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                items: true,
                payments: { where: { deletedAt: null }, orderBy: { date: "asc" } },
                project: { include: { client: true } },
            },
        });
    },
    /* ----------------------------
       Get Single Invoice
    ---------------------------- */
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
    /* -------------------------------------------------------
       Create Invoice (with race-safe number increment + snapshots)
    ------------------------------------------------------- */
    create: async (input, ctx) => {
        const { projectId, items, gstRate, status, ...restInput } = input;
        return ctx.prisma.$transaction(async (tx) => {
            // Get current settings AND atomically increment the invoice number
            const settings = await tx.invoiceSettings.findFirst();
            if (!settings) {
                throw new Error("Invoice settings not found. Please configure them before creating invoices.");
            }
            const updatedSettings = await tx.invoiceSettings.update({
                where: { id: settings.id },
                data: { startingNumber: { increment: 1 } },
                select: {
                    id: true,
                    businessName: true,
                    abn: true,
                    phone: true,
                    email: true,
                    website: true,
                    logoUrl: true,
                    bankDetails: true,
                    invoicePrefix: true,
                    startingNumber: true,
                    gstRate: true,
                    // Structured address snapshot
                    addressLine1: true,
                    addressLine2: true,
                    city: true,
                    state: true,
                    postcode: true,
                    country: true,
                },
            });
            // Invoice number generation
            const prefix = updatedSettings.invoicePrefix ?? "INV-";
            const currentNumber = (updatedSettings.startingNumber ?? 1) - 1;
            const next = Math.max(currentNumber, 0)
                .toString()
                .padStart(3, "0");
            const invoiceNumber = `${prefix}${next}`;
            // Totals
            const rate = normalizeGst(gstRate ?? updatedSettings.gstRate);
            const { subtotal, gstAmount, totalAmount } = calcTotals(items, rate);
            const itemsData = items.map((i) => ({
                description: i.description,
                quantity: i.quantity ?? 1,
                unitPrice: i.unitPrice,
                total: (i.quantity ?? 1) * i.unitPrice,
            }));
            // Create invoice
            const invoice = await tx.invoice.create({
                data: {
                    ...restInput,
                    projectId,
                    invoiceNumber,
                    issueDate: restInput.issueDate,
                    dueDate: restInput.dueDate,
                    status: status ?? InvoiceStatus.DRAFT,
                    gstRate: rate,
                    subtotal,
                    gstAmount,
                    totalAmount,
                    // Snapshot fields
                    businessName: updatedSettings.businessName ?? "",
                    abn: updatedSettings.abn ?? "",
                    phone: updatedSettings.phone ?? "",
                    email: updatedSettings.email ?? "",
                    website: updatedSettings.website ?? "",
                    logoUrl: updatedSettings.logoUrl ?? "",
                    bankDetails: updatedSettings.bankDetails ?? "",
                    // Structured address snapshot
                    addressLine1: updatedSettings.addressLine1 ?? "",
                    addressLine2: updatedSettings.addressLine2 ?? "",
                    city: updatedSettings.city ?? "",
                    state: updatedSettings.state ?? "",
                    postcode: updatedSettings.postcode ?? "",
                    country: updatedSettings.country ?? "",
                    items: { createMany: { data: itemsData } },
                },
                include: {
                    items: true,
                    payments: true,
                    project: { include: { client: true } },
                },
            });
            return invoice;
        });
    },
    /* -------------------------------------------------------
       Update Invoice + Replace items + Recalculate totals
    ------------------------------------------------------- */
    update: async (id, input, ctx) => {
        return ctx.prisma.$transaction(async (tx) => {
            const { items, ...invoiceDataInput } = input;
            const invoiceData = {};
            /* Standard fields */
            if (invoiceDataInput.invoiceNumber !== undefined && invoiceDataInput.invoiceNumber !== null)
                invoiceData.invoiceNumber = invoiceDataInput.invoiceNumber;
            if (invoiceDataInput.issueDate !== undefined)
                invoiceData.issueDate = invoiceDataInput.issueDate;
            if (invoiceDataInput.dueDate !== undefined)
                invoiceData.dueDate = invoiceDataInput.dueDate;
            if (invoiceDataInput.status !== undefined && invoiceDataInput.status !== null)
                invoiceData.status = invoiceDataInput.status;
            if (invoiceDataInput.gstRate !== undefined)
                invoiceData.gstRate = invoiceDataInput.gstRate === null ? undefined : invoiceDataInput.gstRate;
            if (invoiceDataInput.notes !== undefined)
                invoiceData.notes = invoiceDataInput.notes;
            /* Snapshot business fields */
            if (invoiceDataInput.businessName !== undefined)
                invoiceData.businessName = invoiceDataInput.businessName;
            if (invoiceDataInput.abn !== undefined)
                invoiceData.abn = invoiceDataInput.abn;
            if (invoiceDataInput.phone !== undefined)
                invoiceData.phone = invoiceDataInput.phone;
            if (invoiceDataInput.email !== undefined)
                invoiceData.email = invoiceDataInput.email;
            if (invoiceDataInput.website !== undefined)
                invoiceData.website = invoiceDataInput.website;
            if (invoiceDataInput.logoUrl !== undefined)
                invoiceData.logoUrl = invoiceDataInput.logoUrl;
            if (invoiceDataInput.bankDetails !== undefined)
                invoiceData.bankDetails = invoiceDataInput.bankDetails;
            /* Structured snapshot address fields */
            if (invoiceDataInput.addressLine1 !== undefined)
                invoiceData.addressLine1 = invoiceDataInput.addressLine1;
            if (invoiceDataInput.addressLine2 !== undefined)
                invoiceData.addressLine2 = invoiceDataInput.addressLine2;
            if (invoiceDataInput.city !== undefined)
                invoiceData.city = invoiceDataInput.city;
            if (invoiceDataInput.state !== undefined)
                invoiceData.state = invoiceDataInput.state;
            if (invoiceDataInput.postcode !== undefined)
                invoiceData.postcode = invoiceDataInput.postcode;
            if (invoiceDataInput.country !== undefined)
                invoiceData.country = invoiceDataInput.country;
            /* Update invoice record */
            await tx.invoice.update({
                where: { id },
                data: invoiceData,
            });
            /* Replace items if provided */
            if (items !== undefined) {
                await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });
                if (items && items.length > 0) {
                    const itemsData = items.map((i) => ({
                        invoiceId: id,
                        description: i.description,
                        quantity: i.quantity ?? 1,
                        unitPrice: i.unitPrice,
                        total: (i.quantity ?? 1) * i.unitPrice,
                    }));
                    await tx.invoiceItem.createMany({ data: itemsData });
                }
            }
            /* Pull updated items & GST rate */
            const updatedItems = await tx.invoiceItem.findMany({
                where: { invoiceId: id },
                select: {
                    quantity: true,
                    unitPrice: true,
                },
            });
            const invoiceRecord = await tx.invoice.findUnique({
                where: { id },
                select: { gstRate: true },
            });
            const { subtotal, gstAmount, totalAmount } = calcTotals(updatedItems, invoiceRecord?.gstRate);
            /* Save recalculated totals */
            return tx.invoice.update({
                where: { id },
                data: { subtotal, gstAmount, totalAmount },
                include: {
                    items: true,
                    payments: {
                        where: { deletedAt: null },
                        orderBy: { date: "asc" },
                    },
                    project: { include: { client: true } },
                },
            });
        });
    },
    /* ----------------------------
       Soft Delete
    ---------------------------- */
    delete: async (id, ctx) => {
        return ctx.prisma.invoice.update({
            where: { id },
            data: { deletedAt: new Date() },
            select: { id: true },
        });
    },
};
//# sourceMappingURL=invoice.service.js.map