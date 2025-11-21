export const businessService = {
    async createBusiness(input, ctx) {
        const userId = ctx?.user?.id; // From auth context (decoded JWT)
        if (!userId) {
            throw new Error("You must be logged in to create a business.");
        }
        // 🛡 Prevent multiple businesses per user (for now)
        const user = await ctx.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user)
            throw new Error("User not found.");
        if (user.businessId) {
            throw new Error("You already have a business assigned.");
        }
        const { name, legalName, registrationNumber, email, phone, website, logoUrl, regionCode, addressLine1, addressLine2, city, state, postcode, country, } = input;
        // 🔍 1️⃣ Validate Region
        const region = await ctx.prisma.region.findUnique({
            where: { code: regionCode },
        });
        if (!region) {
            throw new Error(`Region "${regionCode}" does not exist.`);
        }
        // 🏠 2️⃣ Create Address (only if fields provided)
        let address = null;
        if (addressLine1 ||
            addressLine2 ||
            city ||
            state ||
            postcode ||
            country) {
            address = await ctx.prisma.address.create({
                data: {
                    addressLine1,
                    addressLine2,
                    city,
                    state,
                    postcode,
                    country,
                },
            });
        }
        // 🧱 3️⃣ Create Business
        const business = await ctx.prisma.business.create({
            data: {
                name,
                legalName,
                registrationNumber,
                email,
                phone,
                website,
                logoUrl,
                region: { connect: { id: region.id } },
                address: address ? { connect: { id: address.id } } : undefined,
            },
            include: {
                region: true,
                address: true,
            },
        });
        // 🔗 4️⃣ Link Business to User (make them OWNER officially)
        await ctx.prisma.user.update({
            where: { id: userId },
            data: { businessId: business.id, role: "OWNER" },
        });
        // ⚙️ 5️⃣ Optional — Create Invoice Settings (default to region values)
        await ctx.prisma.invoiceSettings.create({
            data: {
                business: { connect: { id: business.id } },
                taxRate: region.defaultTaxRate ?? 0.1,
            },
        });
        return business;
    },
};
//# sourceMappingURL=business.service.js.map