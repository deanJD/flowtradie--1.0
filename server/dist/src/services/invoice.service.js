import { InvoiceStatus } from "@prisma/client";
/** ---- Helpers ---- */
const calcTotals = (items, gstRate) => {
    const rate = gstRate ?? 0.1;
    const subtotal = items.reduce((sum, item) => sum + ((item.quantity ?? 1) * item.unitPrice), 0);
    const gstAmount = subtotal * rate;
    const totalAmount = subtotal + gstAmount;
    return { subtotal, gstAmount, totalAmount };
};
/** Optional: 10 → 0.1 guard if settings accidentally stored as percent */
const normalizeGst = (rate) => {
    if (rate == null)
        return 0.1;
    return rate > 1 ? rate / 100 : rate;
};
export const invoiceService = {
    /** --- Get all invoices --- */
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
    /** --- Get single invoice --- */
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
    /** --- Create invoice (race-safe auto-number + snapshot) --- */
    create: async (input, ctx) => {
        const { projectId, items, gstRate, status, ...restInput } = input;
        // Do not pre-read settings outside the transaction for numbering!
        return ctx.prisma.$transaction(async (tx) => {
            // Lock + atomically increment the counter and fetch needed fields
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
                    address: true,
                    phone: true,
                    email: true,
                    website: true,
                    logoUrl: true,
                    bankDetails: true,
                    invoicePrefix: true,
                    startingNumber: true, // this is the *new* incremented value
                    gstRate: true,
                },
            });
            // Use the *previous* number (incremented - 1) for this invoice
            const prefix = updatedSettings.invoicePrefix ?? "INV-";
            const currentNumber = (updatedSettings.startingNumber ?? 1) - 1;
            const numberWidth = 3; // adjust if you want 4+ digits
            const nextNumberStr = Math.max(currentNumber, 0)
                .toString()
                .padStart(numberWidth, "0");
            const invoiceNumber = `${prefix}${nextNumberStr}`;
            // Totals
            const rate = normalizeGst(gstRate ?? updatedSettings.gstRate);
            const { subtotal, gstAmount, totalAmount } = calcTotals(items, rate);
            const itemsData = items.map((i) => ({
                description: i.description,
                quantity: i.quantity ?? 1,
                unitPrice: i.unitPrice,
                total: (i.quantity ?? 1) * i.unitPrice,
            }));
            const invoice = await tx.invoice.create({
                data: {
                    ...restInput,
                    projectId,
                    invoiceNumber,
                    issueDate: restInput.issueDate, // already Date from resolver input
                    dueDate: restInput.dueDate,
                    status: status ?? InvoiceStatus.DRAFT,
                    gstRate: rate,
                    subtotal,
                    gstAmount,
                    totalAmount,
                    // Snapshot fields
                    businessName: updatedSettings.businessName ?? "",
                    abn: updatedSettings.abn ?? "",
                    address: updatedSettings.address ?? "",
                    phone: updatedSettings.phone ?? "",
                    email: updatedSettings.email ?? "",
                    website: updatedSettings.website ?? "",
                    logoUrl: updatedSettings.logoUrl ?? "",
                    bankDetails: updatedSettings.bankDetails ?? "",
                    items: { createMany: { data: itemsData } },
                },
                include: {
                    items: true,
                    project: { include: { client: true } },
                    payments: true,
                },
            });
            return invoice;
        });
    },
    /** --- Update invoice (recalculate totals if items change) --- */
    update: async (id, input, ctx) => {
        return ctx.prisma.$transaction(async (tx) => {
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
            if (invoiceDataInput.notes !== undefined)
                invoiceData.notes = invoiceDataInput.notes;
            // Update invoice main fields
            await tx.invoice.update({
                where: { id },
                data: invoiceData,
            });
            // ✅ Handle item logic with FULL semantics:
            // null = leave items unchanged
            // [] = delete all items
            // [..] = replace items
            if (items !== undefined) {
                // Always delete existing items first
                await tx.invoiceItem.deleteMany({
                    where: { invoiceId: id },
                });
                // Create new items only if array is non-empty
                if (items && items.length > 0) {
                    const itemsData = items.map((item) => ({
                        invoiceId: id,
                        description: item.description,
                        quantity: item.quantity ?? 1,
                        unitPrice: item.unitPrice,
                        total: (item.quantity ?? 1) * item.unitPrice,
                    }));
                    await tx.invoiceItem.createMany({ data: itemsData });
                }
            }
            // Pull updated items
            const currentItems = await tx.invoiceItem.findMany({
                where: { invoiceId: id },
                select: { quantity: true, unitPrice: true },
            });
            // Pull updated invoice
            const currentInvoice = await tx.invoice.findUnique({
                where: { id },
                select: { gstRate: true },
            });
            const { subtotal, gstAmount, totalAmount } = calcTotals(currentItems, currentInvoice?.gstRate);
            // Final update with totals and full include (for UI return)
            return tx.invoice.update({
                where: { id },
                data: {
                    subtotal,
                    gstAmount,
                    totalAmount,
                },
                include: {
                    items: true,
                    payments: { where: { deletedAt: null }, orderBy: { date: "asc" } },
                    project: { include: { client: true } },
                    // ✅ Snapshot fields needed by Edit + Preview
                    // We include them by default because they exist on the Invoice model itself
                },
            });
        });
    },
    /** --- Soft delete --- */
    delete: async (id, ctx) => {
        return ctx.prisma.invoice.update({
            where: { id },
            data: { deletedAt: new Date() },
            select: { id: true },
        });
    },
};
//# sourceMappingURL=invoice.service.js.map