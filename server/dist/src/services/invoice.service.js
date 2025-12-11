import { InvoiceStatus } from "@prisma/client";
/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */
const calcTotals = (items, rate) => {
    const subtotal = items.reduce((sum, item) => sum + ((item.quantity ?? 1) * item.unitPrice), 0);
    const taxAmount = subtotal * rate;
    const totalAmount = subtotal + taxAmount;
    return { subtotal, taxAmount, totalAmount };
};
const normalizeRate = (rate) => {
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
       Create Invoice (auto derive business/client + snapshots)
    ------------------------------------------------------- */
    create: async (input, ctx) => {
        // we only pull out known fields here; everything else in restInput
        const { projectId, items, taxRate, issueDate, dueDate, ...restInput } = input;
        return ctx.prisma.$transaction(async (tx) => {
            // 1️⃣ Find project → derive business & client
            const project = await tx.project.findUnique({
                where: { id: projectId },
                include: { client: true, business: { include: { address: true } } },
            });
            if (!project)
                throw new Error("Project not found");
            const businessId = project.businessId;
            const clientId = project.clientId;
            // 2️⃣ Load settings and increment invoice number
            const settings = await tx.invoiceSettings.findUnique({
                where: { businessId },
            });
            // Safety net: Create default settings if missing
            const safeSettings = settings || await tx.invoiceSettings.create({
                data: {
                    businessId,
                    taxRate: 0.1, // Default fallback
                    taxLabel: "GST"
                },
            });
            const updatedSettings = await tx.invoiceSettings.update({
                where: { id: safeSettings.id },
                data: { startingNumber: { increment: 1 } },
            });
            const sequence = updatedSettings.startingNumber ?? 1;
            const prefix = updatedSettings.invoicePrefix ?? "INV-";
            const invoiceNumber = `${prefix}${sequence.toString().padStart(3, "0")}`;
            // 3️⃣ Dates
            const now = new Date();
            const finalIssueDate = issueDate ?? now;
            const defaultDueDays = updatedSettings.defaultDueDays ?? 14;
            const autoDue = new Date(finalIssueDate.getTime());
            autoDue.setDate(autoDue.getDate() + defaultDueDays);
            const finalDueDate = dueDate ?? autoDue;
            // 4️⃣ Totals
            const rate = normalizeRate(taxRate ?? (updatedSettings.taxRate ? Number(updatedSettings.taxRate) : null));
            const itemsData = items.map((i) => ({
                description: i.description,
                quantity: i.quantity ?? 1,
                unitPrice: i.unitPrice,
                total: (i.quantity ?? 1) * i.unitPrice,
            }));
            const { subtotal, taxAmount, totalAmount } = calcTotals(itemsData, rate);
            // 5️⃣ Business snapshot JSON (Corrected Logic)
            const businessSnapshot = {
                businessName: project.business.name,
                abn: project.business.registrationNumber,
                phone: project.business.phone,
                email: project.business.email,
                website: project.business.website,
                logoUrl: project.business.logoUrl,
                bankDetails: updatedSettings.bankDetails,
                address: project.business.address ? {
                    line1: project.business.address.line1,
                    line2: project.business.address.line2,
                    city: project.business.address.city,
                    state: project.business.address.state,
                    postcode: project.business.address.postcode,
                    country: project.business.address.country,
                    countryCode: project.business.address.countryCode,
                } : null,
            };
            // 6️⃣ Client snapshot JSON
            const clientSnapshot = {
                id: project.client.id,
                firstName: project.client.firstName,
                lastName: project.client.lastName,
                businessName: project.client.businessName,
                phone: project.client.phone,
                email: project.client.email,
                type: project.client.type,
                address: null, // Can be extended later
            };
            // 7️⃣ Create invoice
            return tx.invoice.create({
                data: {
                    ...restInput,
                    projectId,
                    businessId,
                    clientId,
                    invoiceNumber,
                    invoicePrefix: prefix,
                    invoiceSequence: sequence,
                    issueDate: finalIssueDate,
                    dueDate: finalDueDate,
                    status: restInput.status ?? InvoiceStatus.DRAFT,
                    taxRate: rate,
                    taxLabelSnapshot: updatedSettings.taxLabel ?? "GST",
                    currencyCode: "AUD",
                    subtotal,
                    taxAmount,
                    totalAmount,
                    businessSnapshot,
                    clientSnapshot,
                    items: {
                        createMany: { data: itemsData },
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
    /* -------------------------------------------------------
       Update Invoice
    ------------------------------------------------------- */
    update: async (id, input, ctx) => {
        return ctx.prisma.$transaction(async (tx) => {
            const { items, businessSnapshot, clientSnapshot, ...invoiceDataInput } = input;
            const invoiceData = {};
            if (invoiceDataInput.invoiceNumber !== undefined)
                invoiceData.invoiceNumber = invoiceDataInput.invoiceNumber;
            if (invoiceDataInput.issueDate !== undefined)
                invoiceData.issueDate = invoiceDataInput.issueDate;
            if (invoiceDataInput.dueDate !== undefined)
                invoiceData.dueDate = invoiceDataInput.dueDate;
            if (invoiceDataInput.status !== undefined)
                invoiceData.status = invoiceDataInput.status;
            if (invoiceDataInput.notes !== undefined)
                invoiceData.notes = invoiceDataInput.notes;
            if (invoiceDataInput.taxRate !== undefined)
                invoiceData.taxRate = invoiceDataInput.taxRate;
            if (businessSnapshot !== undefined)
                invoiceData.businessSnapshot = businessSnapshot;
            if (clientSnapshot !== undefined)
                invoiceData.clientSnapshot = clientSnapshot;
            // Update main invoice fields
            await tx.invoice.update({
                where: { id },
                data: invoiceData,
            });
            // Replace items if provided
            if (items !== undefined) {
                await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });
                if (items && items.length > 0) {
                    await tx.invoiceItem.createMany({
                        data: items.map((i) => ({
                            invoiceId: id,
                            description: i.description,
                            quantity: i.quantity ?? 1,
                            unitPrice: i.unitPrice,
                            total: (i.quantity ?? 1) * i.unitPrice,
                        })),
                    });
                }
            }
            // Recalculate totals
            const updatedItems = await tx.invoiceItem.findMany({
                where: { invoiceId: id },
                select: { quantity: true, unitPrice: true },
            });
            const invoiceRecord = await tx.invoice.findUnique({
                where: { id },
                select: { taxRate: true },
            });
            const normalizedItems = updatedItems.map((i) => ({
                quantity: i.quantity ?? 1,
                unitPrice: Number(i.unitPrice),
            }));
            const rate = normalizeRate(invoiceRecord?.taxRate ? Number(invoiceRecord.taxRate) : null);
            const { subtotal, taxAmount, totalAmount } = calcTotals(normalizedItems, rate);
            return tx.invoice.update({
                where: { id },
                data: { subtotal, taxAmount, totalAmount },
                include: {
                    items: true,
                    payments: { where: { deletedAt: null }, orderBy: { date: "asc" } },
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